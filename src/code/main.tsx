import React from 'react';
import ReactDOM from 'react-dom';
import '../css/style.css';
import { Todo } from './Todo';

window.onload = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js');
  }

  const link = document.createElement('link');
  link.rel = 'manifest';
  link.type = 'text/json';
  link.href = '/todo/manifest.json';
  document.head.appendChild(link);

  document.body.className = 'themDarkBlue';
};

const body = document.getElementsByTagName('body')[0];
if (body) {
  const div = document.createElement('div');
  div.id = 'reactAttachmentPointContentScript';
  body.appendChild(div);
  const reactDiv = document.getElementById(div.id);
  if (reactDiv) {
    console.log('reactDiv', reactDiv);
    ReactDOM.render(<Todo />, reactDiv);
  }
}
