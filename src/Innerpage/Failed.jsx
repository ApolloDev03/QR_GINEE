import React from 'react';
import { NavLink } from 'react-router-dom';

function Failed() {
  return (
    <div className='text-center'>
        <h2 className="logo_heading mt-3">QR Genie</h2>
        <div className="text-center mt-5 mb-3">
            <img src="assests/image/sorry.jpg" alt="Company Picture" className="company-pic" loading="lazy" />
            
          </div>
          <NavLink to="/">
      <button className="Login_btn" style={{background:'#EF4F5F'}}>Home</button>
      </NavLink>
    </div>
  )
}

export default Failed
