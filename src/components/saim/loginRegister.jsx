import React from 'react'
import './loginRegister.css'
import { FaUser,FaLock } from "react-icons/fa6";

const loginRegister = () => {
  return (
    <div>
      <div className="wrapper">
        <div className="form-box login">
            <form action="">
                <h1>Login</h1>
                
                <div className="input-box">
                    <input type="email" placeholder='Email' required />
                    <FaUser className='icon' />
                </div>
                <div className="input-box">
                    <input type="password" placeholder='Password' required />
                    <FaLock className='icon'/>
                </div>
                <div className="remember">
                    <a href="#">Forgot Passowrd? <br /></a>
                  
                </div>
                <button type='submit'>Submit</button>
                <div className="register">
                    <p>Dont have an Account? <a href="#">Register Now</a></p>
                </div>
                
            </form>
        </div>

      </div>
    </div>
  )
}

export default loginRegister
