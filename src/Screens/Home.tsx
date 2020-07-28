import React from "react";
import ReactDOM from "react-dom";
import Modal from '@material-ui/core/Modal';
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
import Navigation from "./Navigation";
import { makeStyles } from '@material-ui/core/styles';


const renderItem = (res: any /*, triggerClickAnalytics: any*/) => {
 
  const image = res.mediaLink
  const title = res.objectName
  const openUrl = (urlToOpen: string, res : any) => () => window.open(urlToOpen, "_blank");
  return (
    <Row
      // onClick={triggerClickAnalytics}
      type="flex"
      gutter={16}
      key={res._id}
      style={{ margin: "20px auto", borderBottom: "1px solid #ededed" }}
    >
      <Col span={image ? 14 : 0}>
        <div onClick={() => console.log("Image clicked")}>
          {image && <img width="400" src={res.mediaLink} alt={res.name} />}
        </div>  
      </Col>
      <Col span={image ? 10 : 24}>
        <h3
          style={{ fontWeight: 600 }}
          dangerouslySetInnerHTML={{
            __html: title || "Choose a valid Title Field",
          }}
        />
        <p
          style={{ fontSize: "1em" }}
          dangerouslySetInnerHTML={{
            __html: res.imageDescription || "Choose a valid Description Field",
          }}
        />
      </Col>
      <div style={{ padding: "20px" }}>
          <div>
            <Button
              shape="circle"
              icon="link"
              style={{ marginRight: "5px" }}
              onClick={openUrl(`./ViewProduct?${res._id}`, res)}
            />
            <Button
            style={{ marginRight: "5px" }}
            onClick={openUrl(`https://uykusuz.eu`, res)}>Purchase Issue</Button>
        </div>
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
  const VALUE = "SOME VALUE"
  useEffect(() => {
    const { loggedUser } = props;
    db.doGetAnUnser(loggedUser.uid).then((res: any) => {
      setState({ users: null, username: "", loading: false });
    });
  });
  return (
  <div>
    <Navigation />
    {/* <ShowModel /> */}
    <ReactiveBase
      app="archive"
      credentials="user:meuP4b1U4L2Y"
      url="https://elasticsearch.mizaharsiv.org/elasticsearch"
      analytics={true}
      searchStateHeader={true}
    >
      <Row gutter={16} style={{ padding: 20 }}>
        <Col span={10}>
          <Card>
            <MultiList
              showCheckbox={true}
              componentId="list-2"
              dataField="artist.keyword"
              size={1000}
              style={{
                marginBottom: 20,
              }}
              title="Yazar"
              placeholder="Yazar ara"
            />
          </Card>
        </Col>
        <Col span={14}>
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
  </div>
  )
}
const authCondition = (authUser: any) => !!authUser;

export default withAuthorization(authCondition)(Home); //grants authorization to open endpoint if an user is signed in
