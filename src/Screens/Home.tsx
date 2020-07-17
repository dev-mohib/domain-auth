import React from "react";
import ReactDOM from "react-dom";

import {
  DataSearch,
  MultiList,
  ReactiveBase,
  ReactiveList,
  SelectedFilters,
} from "@appbaseio/reactivesearch";
import {
  Button,
  Card,
  Col,
  Row,
  // Switch, Tree, Popover, Affix
} from "antd";
import "antd/dist/antd.css";
import { useEffect } from "react";
import withAuthorization from "../helpers/withAuthorization";
import { db } from "../firebase";
import { useState } from "react";

function getNestedValue(obj: object, path: string) {
  const keys = path.split(".");
  const currentObject = obj;
  const nestedValue = keys.reduce((value: any, key: string) => {
    if (value) {
      return value[key];
    }
    return "";
  }, currentObject);
  if (typeof nestedValue === "object") {
    return JSON.stringify(nestedValue);
  }
  return nestedValue;
}

function renderItem(res: any /*, triggerClickAnalytics: any*/) {
  let { image, url, description, title } = {
    description: "caption",
    image: "mediaLink",
    title: "objectName",
    url: "",
  };
  image = getNestedValue(res, image);
  title = getNestedValue(res, title);
  url = getNestedValue(res, url);
  description = getNestedValue(res, description);
  const openUrl = (urlToOpen: string) => () => window.open(urlToOpen, "_blank");
  return (
    <Row
      // onClick={triggerClickAnalytics}
      type="flex"
      gutter={16}
      key={res._id}
      style={{ margin: "20px auto", borderBottom: "1px solid #ededed" }}
    >
      <Col span={image ? 6 : 0}>
        {image && <img width="100" src={image} alt={title} />}
      </Col>
      <Col span={image ? 18 : 24}>
        <h3
          style={{ fontWeight: 600 }}
          dangerouslySetInnerHTML={{
            __html: title || "Choose a valid Title Field",
          }}
        />
        <p
          style={{ fontSize: "1em" }}
          dangerouslySetInnerHTML={{
            __html: description || "Choose a valid Description Field",
          }}
        />
      </Col>
      <div style={{ padding: "20px" }}>
        {url ? (
          <Button
            shape="circle"
            icon="link"
            style={{ marginRight: "5px" }}
            onClick={openUrl(url)}
          />
        ) : null}
      </div>
    </Row>
  );
}

const Home = (props: any) => {
  const [state, setState] = useState({
    users: null,
    username: "",
    loading: true,
  });
  useEffect(() => {
    const { loggedUser } = props;
    db.doGetAnUnser(loggedUser.uid).then((res: any) => {
      setState({ users: null, username: res.val().username, loading: false });
    });
  });
  return (
    <ReactiveBase
      app="archive"
      credentials="user:meuP4b1U4L2Y"
      url="https://elasticsearch.mizaharsiv.org/elasticsearch"
      analytics={true}
      searchStateHeader={true}
    >
      <Row gutter={16} style={{ padding: 20 }}>
        <Col span={12}>
          <Card>
            <MultiList
              showCheckbox={true}
              componentId="list-2"
              dataField="artist.keyword"
              size={100}
              style={{
                marginBottom: 20,
              }}
              title="Yazar"
              placeholder="Yazar ara"
            />
          </Card>
        </Col>
        <Col span={12}>
          <DataSearch
            autosuggest={false}
            componentId="search"
            dataField={[
              "caption",
              "artist",
              "imageDescription",
              "keywords",
              "objectName",
              "copyright",
            ]}
            fieldWeights={[1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1]}
            fuzziness={2}
            highlight={true}
            highlightField={[
              "caption",
              "artist",
              "imageDescription",
              "keywords",
              "objectName",
              "copyright",
            ]}
            placeholder="Aramak istediğiniz kelimeyi buraya yazın"
            style={{
              marginBottom: 20,
            }}
            title="Arama"
          />

          <SelectedFilters />

          <ReactiveList
            componentId="result"
            dataField="_score"
            pagination={true}
            react={{
              and: ["search", "list-2"],
            }}
          renderItem={renderItem}
            size={10}
            style={{
              marginTop: 20,
            }}
          />
        </Col>
      </Row>
    </ReactiveBase>
  );
};
const authCondition = (authUser: any) => !!authUser;

export default withAuthorization(authCondition)(Home); //grants authorization to open endpoint if an user is signed in
