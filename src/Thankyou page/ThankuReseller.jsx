import React from "react";
import { useLocation, NavLink } from "react-router-dom";

function ThankuReseller() {
  const location = useLocation();
  const orderID = location.state?.orderID;
  const message = `Your Order Has Been Placed Successfully..!`;
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
        <p className="text-bold text-center">{message}</p>
        {orderID && <p className="order-id">Order ID: {orderID}</p>}
        <NavLink to="/myorder">
          <button className="Login_btn">Home</button>
        </NavLink>
      </div>
    </div>
  );
}

export default ThankuReseller;
