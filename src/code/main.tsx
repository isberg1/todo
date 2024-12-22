import React from "react";
import ReactDOM from "react-dom";
//import styles from "../css/style.css";


window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js');
  }
}


console.log("Hello from main");

function Abx() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>test1236</h1>

    </div>
  );
}

const body = document.getElementsByTagName("body")[0];
if (body) {
  const div = document.createElement("div");
  div.id = "reactAttachmentPointContentScript";
  body.appendChild(div);
  const reactDiv = document.getElementById(div.id);
  if (reactDiv) {
    console.log("reactDiv", reactDiv);
    ReactDOM.render(<Abx />, reactDiv);
  }
}
