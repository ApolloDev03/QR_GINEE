import React from 'react';
import { NavLink } from 'react-router-dom';

function PaymentFailed() {
  const message = `Payment Failed`;

  return (
    <div>
      {/* <h2 className="logo_heading">QR Genie</h2> */}
      <div className="text-center mt-5 mb-4">
        {/* Payment Failed Image */}
        <img src="assests/image/payment_failed.svg" alt="Payment Failed" className="company-pic" loading="lazy" />

        {/* Payment Failed message */}
        <h2 className="dark-message mt-3" style={{ color: '#4E4E4E' }}>{message}</h2>
         <h5 className="contact-message">Please contact us for more information</h5>
        {/* Contact Button */}
        <NavLink to="/contactus">
          <button className="Login_btn" style={{ width: '170px', height: '50px'}}>Contact</button>
        </NavLink>
      </div>
    </div>
  );
}

export default PaymentFailed;
