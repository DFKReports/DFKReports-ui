import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { DAppProvider, Config, Harmony } from "@usedapp/core";


const config: Config = {
  readOnlyChainId: Harmony.chainId,
}

ReactDOM.render(
  <React.StrictMode>

    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
