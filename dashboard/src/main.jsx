import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import { Provider } from 'react-redux'
import { persistor, store } from './app/store.js'
import { PersistGate } from 'redux-persist/es/integration/react'
import { QueryClient, QueryClientProvider } from 'react-query';

import { ReactQueryDevtools } from 'react-query/devtools'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>  
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
        <StrictMode>
          <App />
          <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
        </StrictMode>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </QueryClientProvider>,
)
