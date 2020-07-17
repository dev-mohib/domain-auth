const mockObject = {
	metadata: undefined,
	bucket: 'mizaharsiv-jpg',
	contentType: 'image/jpeg',
	crc32c: 'SutR+g==',
	etag: 'CI7whp/By+MCEAE=',
	generation: '1563901005248526',
	id: 'mizaharsiv-jpg/2019/01/04-540/2.jpg/1563901005248526',
	kind: 'storage#object',
	md5Hash: 'lUm5U90lu+QTJSN+NMSoeQ==',
	mediaLink:
		'https://www.googleapis.com/download/storage/v1/b/mizaharsiv-jpg/o/2019%2F01%2F04-540%2F2.jpg?generation=1563901005248526&alt=media',
	metageneration: '14',
	name: '2019/01/04-540/2.jpg',
	selfLink: 'https://www.googleapis.com/storage/v1/b/mizaharsiv-jpg/o/2019%2F01%2F04-540%2F2.jpg',
	size: '325035',
	storageClass: 'REGIONAL',
	timeCreated: new Date('2019-07-23T16:56:45.248Z'),
	timeStorageClassUpdated: new Date('2019-07-23T16:56:45.248Z'),
	updated: new Date('2019-07-23T16:56:45.248Z')
};

const { handleUpload, handleMetadataUpdate } = global;

const tests = async () => {
	const [ handleUploadResponse, handleMetadataUpdateResponse ] = await Promise.all([
		handleUpload(mockObject),
		handleMetadataUpdate(mockObject)
	]);
	return {
		handleUploadResponse,
		handleMetadataUpdateResponse
	};
};

const runTests = () => {
	return (
		tests()
			.then(console.log)
			// .then(() => process.exit(0))
			.catch((error) => console.error(error) || process.exit(1))
	);
};

runTests();
