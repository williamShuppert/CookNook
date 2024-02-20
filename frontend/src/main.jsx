import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import NavBar from './components/common/NavBar/index.jsx'
import { Provider } from 'react-redux'
import store from './redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
        <NavBar />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
)
