import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {store}  from './app/store.js'
import { persistor} from './app/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "@/components/ui/toaster"
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
     <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <App />
            <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
            <Toaster />
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
