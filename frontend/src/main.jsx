import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import { BrowserRouter } from 'react-router-dom'
import NavBar from './components/common/NavBar/index.jsx'
import { Provider } from 'react-redux'
import store from './redux/store'

document.title = import.meta.env.VITE_APP_TITLE || 'Cook Nook'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <NavBar />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
