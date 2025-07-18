import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PostHogProvider } from 'posthog-js/react';
import posthog from 'posthog-js';

const apiKey = process.env.REACT_APP_POSTHOG_KEY;
console.log("PostHog API Key:", apiKey);
const options = {
  api_host: process.env.REACT_APP_POSTHOG_HOST || "",
};

if (apiKey) {
  posthog.init(apiKey, options);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PostHogProvider apiKey={apiKey || ""} options={options}>
      <App />
    </PostHogProvider>
  </React.StrictMode>
);
