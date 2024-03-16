import React from 'react'
import ReactDOM from 'react-dom/client'
import RouterApp from './Router'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterApp />
    </ChakraProvider>
  </React.StrictMode>,
)