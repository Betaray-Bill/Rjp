import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
// import './index.css'
import { Provider } from 'react-redux'
// import store from './app/store.js';
import { persistor, store } from './app/store.js'
import { PersistGate } from 'redux-persist/es/integration/react'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
      <StrictMode>
        <App />
      </StrictMode>
      </PersistGate>
    </Provider>
  </BrowserRouter>
  ,
)
