import { Fragment, useState } from 'react'
import reactLogo from './assets/react.svg'
import logo from './assets/logo.png'
import './App.css'

function App() {
  const handleRedirect = (url) => {
    window.open(url, "_blank"); // O  
  };

  return (
    <Fragment>
    <div className='nav'>
      <img src={logo} alt="" />
    </div>
      <div style={{ textAlign: "center" }}>
      <h1>Welcome to RJP Infotek</h1>
      <div className='center'>
          <div>
            <button
            onClick={() => handleRedirect("http://bas.rjpinfotek.com:5173")}
            style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
          >
            Dashboard Login
          </button>
          </div>
          <div>
          <button
          onClick={() => handleRedirect("http://bas.rjpinfotek.com:5174")}
          className='bg-pink-400'
          style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        >
          Trainer Login
        </button>
          </div>
      </div>
    </div>
    </Fragment>
  )
}

export default App
