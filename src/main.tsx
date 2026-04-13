import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "@aws-amplify/core";
import outputs from "../amplify_outputs.json";
import App from "./App.tsx";
import "./index.css";

const amplifyConfig = {
  API: {
    GraphQL: {
      endpoint: outputs.data.url,
      region: outputs.data.aws_region,
      defaultAuthMode: 'apiKey',
      apiKey: outputs.data.api_key,
      modelIntrospection: outputs.data.model_introspection,
    },
  },
} as unknown as Parameters<typeof Amplify.configure>[0];

Amplify.configure(amplifyConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
