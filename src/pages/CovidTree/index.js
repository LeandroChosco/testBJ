import React, { useState } from "react";
import Tree from "react-tree-graph";
import "./style.css";
import { Image } from "semantic-ui-react";

import ModalCovidTree from "../../components/ModalCovidTree";

const imageURL =
  "http://prod.adminc5.bj.sails.energetikadevelepment.com:1337/public/154/172.20.39.15_01_20200624140213876_MEASURE_TEMP_ALARM_DETECTION.jpg";

const CovidTree = () => {
  let data = {
    name: "PRINCIPAL",
    pathProps: {},
    textProps: { x: -25, y: 25 },
    children: [
      {
        name: "Black",
        pathProps: { className: "black" },
        textProps: { x: -25, y: 25 },
        children: []
      },
      {
        name: "Blue",
        pathProps: { className: "blue" },
        textProps: { x: -25, y: 25 },
        color: "blue",
        children: [
          {
            name: "Aquamarine",
            textProps: { x: -25, y: 25 },
            color: "aquamarine",
            children: []
          },
          {
            name: "Cyan",
            textProps: { x: -25, y: 25 },
            color: "cyan",
            children: []
          },
          {
            name: "Navy",
            textProps: { x: -25, y: 25 },
            color: "navy",
            children: []
          },
          {
            name: "Turquoise",
            textProps: { x: -25, y: 25 },
            color: "turquoise",
            children: []
          }
        ]
      },
      {
        name: "Green",
        pathProps: { className: "green" },
        textProps: { x: -25, y: 25 },
        color: "green",
        children: []
      },
      //
      {
        name: "Indigo",
        textProps: { x: -25, y: 25 },
        color: "indigo",
        children: []
      },
      {
        name: "Violet",
        textProps: { x: -25, y: 25 },
        color: "violet",
        children: []
      },
      {
        name: "Red",
        pathProps: { className: "red" },
        textProps: { x: -25, y: 25 },
        color: "red",
        children: [
          {
            name: "Crimson",
            textProps: { x: -25, y: 25 },
            color: "crimson",
            children: []
          },
          {
            name: "Maroon",
            textProps: { x: -25, y: 25 },
            color: "maroon",
            children: []
          },
          {
            name: "Scarlet",
            textProps: { x: -25, y: 25 },
            color: "scarlet",
            children: []
          }
        ]
      },
      {
        name: "White",
        pathProps: { className: "grey" },
        textProps: { x: -25, y: 25 },
        color: "grey",
        children: []
      },
      {
        name: "Yellow",
        pathProps: { className: "yellow" },
        textProps: { x: -25, y: 25 },
        color: "yellow",
        children: []
      }
    ]
  };

  const [node, setNode] = useState();
  const [showModal, setShowModal] = useState(false);

  const handleClick = (event, node) => {
    console.log("handle click ", event);
    console.log("handle click node", node);
    setNode(node);
    setShowModal(true);
    // alert(`${node} AQUI UN MODAL, FOTO O INFORMACION`);
  };

  const hideModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <ModalCovidTree
          node={node}
          modal={showModal}
          hide={() => hideModal()}
        />
      )}
      <div
        className="custom-container row p-10"
        style={{ alignItems: "center" }}
      >
        <div className="col-6 m-0" style={{ display: "contents" }}>
          <Image
            className=" ustify-content-end m-0"
            size="small"
            src={imageURL}
            alt=""
          />
        </div>
        <div className="col-6 justify-content-start">
          <Tree
            animated={true}
            data={data}
            nodeRadius={15}
            margins={{ top: 20, bottom: 10, left: 20, right: 200 }}
            height={700}
            width={1000}
            gProps={{
              className: "node",
              onClick: handleClick
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CovidTree;
