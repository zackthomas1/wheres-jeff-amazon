// index.js
import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import { Provider } from 'react-redux';

import './index.css'
import App from './App.jsx'
import CanvasClickApp from './CanvasClickApp';
import { store } from './store';

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_YZDde7yWa",
  client_id: "5rhuio0915e60k400o8qq3ajsm",
  redirect_uri: "https://d84l1y8p4kdic.cloudfront.net",
  response_type: "code",
  scope: "phone openid email",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

// wrap the application with AuthProvider
root.render(
  <Provider store={store}>
    <CanvasClickApp />
  </Provider>
  // <React.StrictMode>
  //   <AuthProvider {...cognitoAuthConfig}>
  //     <App />
  //   </AuthProvider>
  // </React.StrictMode>
);
