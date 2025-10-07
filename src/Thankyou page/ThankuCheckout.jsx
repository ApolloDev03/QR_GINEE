import React from "react";
import { useLocation, NavLink } from "react-router-dom";

function ThankuCheckout() {
  const location = useLocation();
  const orderID = location.state?.orderID;
  const message = `Your order has been placed successfully.`;

  return (
    <div>
      {/* <h2 className="logo_heading">QR Genie</h2> */}
      <div className="text-center mt-5 mb-4">
        <img
          src="assests/image/Thanku.png"
          alt="Company Picture"
          className="company-pic"
          loading="lazy"
        />
        <p className="dark-message text-center">{message}</p>
        {orderID && <p className="order-id text-center">Order ID: {orderID}</p>}
        <NavLink to="/">
          <button className="Login_btn">Home</button>
        </NavLink>
      </div>
    </div>
  );
}

export default ThankuCheckout;
