import * as functions from 'firebase-functions';
import { Client } from '@elastic/elasticsearch';
import { kebabCase } from 'lodash';
// import { ExifImage, ExifImageCallback } from 'exif';
import { promisify, debuglog, inspect } from 'util';
import { extname, join } from 'path';
import { tmpdir } from 'os';
import {
	// readFile as readFileCallback,
	unlink as unlinkCallback
} from 'fs';
// import moment from 'moment';
import * as admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import { ObjectMetadata } from 'firebase-functions/lib/providers/storage';
import { Index } from '@elastic/elasticsearch/api/requestParams';
import * as serviceAccount from './service-account.json';
// import request from 'request';
import { randomBytes } from 'crypto';
import { stdout as supportsColors } from 'supports-color';
import { exiftool } from 'exiftool-vendored';

process.env.NODE_DEBUG = 'functions*';

// const requestPromise = (url: string, options?: object, debugPrefix?: string): Promise<any> =>
// 	new Promise((resolve, reject) => {
// 		const log = debugLog(debugPrefix, 'requestPromise');
// 		request(url, options, (error, response, body: any) => {
// 			if (error instanceof Error) reject(error);
// 			resolve(log(body, 'body'));
// 		});
// 	});

// const requestBody = async (url: string, debugPrefix?: string) => {
// 	const log = debugLog(debugPrefix, 'requestBody');
// 	const body = await requestPromise(url, { encoding: null }, debugPrefix);
// 	return log(body, 'body');
// };

const BUCKET = 'mizaharsiv-jpg';

const serviceAccountParams = {
	type: serviceAccount.type,
	projectId: serviceAccount.project_id,
	privateKeyId: serviceAccount.private_key_id,
	privateKey: serviceAccount.private_key,
	clientEmail: serviceAccount.client_email,
	clientId: serviceAccount.client_id,
	authUri: serviceAccount.auth_uri,
	tokenUri: serviceAccount.token_uri,
	authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
	clientC509CertUrl: serviceAccount.client_x509_cert_url
};

admin.initializeApp({
	credential: admin.credential.cert(serviceAccountParams),
	databaseURL: 'https://valiant-index-243410.firebaseio.com'
});

const { region, config: functionsConfig } = functions;
const { storage, https } = region('europe-west1');

const colors = supportsColors || Boolean(process.env.FUNCTIONS_EMULATOR);

const debugLog = (section?: string, ...sections: string[]) => (toDebug: any, description?: string) => {
	debuglog(
		[ 'functions', section, ...sections ]
			.filter((sectionsItem) => typeof sectionsItem === 'string')
			.map(kebabCase)
			.join('/')
	)(
		[ description, '%s' ].join(' '),
		inspect(toDebug, {
			depth: null,
			colors
		})
	);
	return toDebug;
};

const getConfig = (debugPrefix?: string) => {
	const log = debugLog(debugPrefix, 'getConfig');
	const config = functionsConfig();
	return log(config, 'config');
};

const getElasticsearchConfig = async (debugPrefix?: string) => {
	const log = debugLog(debugPrefix, 'getElasticsearchConfig');
	const { elasticsearch: elasticsearchEnvironmentConfig } = getConfig();
	return log(elasticsearchEnvironmentConfig, 'elasticsearchEnvironmentConfig');
};

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = https.onRequest((httpsRequest, httpsResponse) => {
	return httpsResponse.send('Hello from Firebase!');
});

// const getImageUrl = async <T extends ObjectMetadata>(
// 	{ bucket: bucketName, name: fileName }: T,
// 	debugPrefix?: string
// ) => {
// 	const log = debugLog(debugPrefix, 'getImageUrl');
// 	log(bucketName, 'bucketName');
// 	log(fileName, 'fileName');
// 	if (typeof fileName !== 'string') throw new Error('fileName is not string');

// 	const googleCloudStorage = new Storage();
// 	const [ signedUrl ] = await googleCloudStorage.bucket(bucketName).file(fileName).getSignedUrl({
// 		expires: moment().add(1, 'days').format('MM-DD-YYYY'),
// 		action: 'read'
// 	});
// 	return log(signedUrl, 'signedUrl');
// };

const tmpFileName = (fileName: string, debugPrefix?: string) => {
	const log = debugLog(debugPrefix, 'tmpFileName');
	const randomFileName = randomBytes(20).toString('hex') + extname(fileName);
	const tempLocalFile = join(tmpdir(), randomFileName);
	return log(tempLocalFile, 'tempLocalFile');
};

// const readFile = promisify(readFileCallback);
const unlink = promisify(unlinkCallback);

const getTemporaryImage = async <T extends ObjectMetadata>(
	{ bucket: bucketName, name: fileName }: T,
	debugPrefix?: string
) => {
	const log = debugLog(debugPrefix, 'getTemporaryImage');
	log(bucketName, 'bucketName');
	log(fileName, 'fileName');
	if (typeof fileName !== 'string') throw new Error('fileName is not string');

	const destination = tmpFileName(fileName);

	const googleCloudStorage = new Storage();
	await googleCloudStorage.bucket(bucketName).file(fileName).download({ destination });

	return log(destination, 'destination');
};

const getExifParams = async (imageBuffer: string, debugPrefix?: string) => {
	const log = debugLog(debugPrefix, 'getExifParams');
	const exifData = await exiftool.read(imageBuffer);
	log(exifData, 'exifData');
	const {
		FileType: fileType,
		FileTypeExtension: fileTypeExtension,
		MIMEType: mimeType,
		Artist: artist,
		Copyright: copyright,
		ImageDescription: imageDescription,
		DateTimeOriginal,
		ObjectName: objectName,
		Keywords: keywords,
		ImageWidth: imageWidth,
		ImageHeight: imageHeight,
		ImageSize: imageSize,
		'Caption-Abstract': caption
	} = exifData;
	const exifParams = {
		fileType,
		fileTypeExtension,
		mimeType,
		artist,
		copyright,
		imageDescription,
		dateTimeOriginal: DateTimeOriginal && DateTimeOriginal.toDate(),
		objectName,
		keywords,
		imageWidth,
		imageHeight,
		imageSize,
		caption
	};
	return log(exifParams, 'exifParams');
};

const getElasticSearchParams = <
	T extends {
		metageneration?: ObjectMetadata['metageneration'];
		generation?: ObjectMetadata['generation'];
		name?: ObjectMetadata['name'];
		bucket?: ObjectMetadata['bucket'];
		id?: ObjectMetadata['id'];
		contentType?: ObjectMetadata['contentType'];
		mediaLink?: ObjectMetadata['mediaLink'];
		selfLink?: ObjectMetadata['selfLink'];
		updated?: ObjectMetadata['updated'];
		etag?: ObjectMetadata['etag'];
		size?: ObjectMetadata['size'];
		metadata?: object;
	}
>({
	generation,
	metageneration,
	contentType,
	bucket,
	name,
	updated,
	mediaLink,
	selfLink,
	id: storageId,
	etag,
	metadata,
	size
}: T) => ({
	index: 'archive',
	id: kebabCase(name),
	body: {
		...metadata,
		name,
		storageId,
		metageneration,
		generation,
		bucket,
		mediaLink,
		selfLink,
		etag,
		size,
		...updated ? { updated: new Date(updated) } : {},
		contentType
	}
	// ...metageneration && metageneration !== '1'
	// 	? {
	// 			version: parseInt(metageneration),
	// 			version_type: 'external' as 'external'
	// 		}
	// 	: {}
});

const updateElasticSearch = async <T extends Index>(paramsObject: T, debugPrefix?: string) => {
	const log = debugLog(debugPrefix, 'updateElasticSearch');
	log(paramsObject, 'paramsObject');
	const elasticSearchConfig = await getElasticsearchConfig(debugPrefix);
	log(elasticSearchConfig, 'elasticSearchConfig');
	const response = await new Client(elasticSearchConfig).index(paramsObject);

	return log(response, 'response');
};

const handleElasticsearch = async (objectMetadata: ObjectMetadata, debugPrefix?: string) => {
	const log = debugLog(debugPrefix, 'handleElasticsearch');

	const { metadata, contentType, ...triggerObject } = objectMetadata;
	// Exit if this is triggered on a file that is not an image.
	if (!contentType || !contentType.startsWith('image/')) {
		return objectMetadata;
	}

	const imagePath = await getTemporaryImage(objectMetadata, debugPrefix);
	// const imageBuffer = await readFile(imagePath, { encoding: null });

	const exifData = await getExifParams(imagePath, debugPrefix);

	const extendedMetadata = {
		...metadata || {},
		...exifData || {}
	};

	const newTriggerObject = {
		...triggerObject,
		metadata: extendedMetadata
	};
	log(newTriggerObject, 'newTriggerObject');

	const elasticsearchParams = getElasticSearchParams(newTriggerObject);
	await Promise.all([ updateElasticSearch(elasticsearchParams, debugPrefix), unlink(imagePath) ]);

	return newTriggerObject;
};

export const handleMetadataUpdate = storage
	.bucket(BUCKET)
	.object()
	.onMetadataUpdate(async (objectMetadata: ObjectMetadata) => {
		process.env.NODE_DEBUG = 'functions*';
		const debugPrefix = 'onMetadataUpdate';
		const log = debugLog(debugPrefix);
		log(objectMetadata, 'objectMetadata');

		return handleElasticsearch(objectMetadata, debugPrefix);
	});

export const handleUpload = storage.bucket(BUCKET).object().onFinalize(async (objectMetadata: ObjectMetadata) => {
	process.env.NODE_DEBUG = 'functions*';
	const debugPrefix = 'handleUpload';
	const log = debugLog(debugPrefix);
	log(objectMetadata, 'objectMetadata');

	return handleElasticsearch(objectMetadata, debugPrefix);
});
