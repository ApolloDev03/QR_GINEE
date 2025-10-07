import React from "react";
import { useLocation, NavLink } from "react-router-dom";

function ThankuFinal() {
  const location = useLocation();

  // Handle the message with a line break for the fallback
  const message = location.state?.message || (
    <>
      Your Message is sent successfully
      <br />
      Thank you for Helping !!
    </>
  );

  return (
    <div>
      <div className="text-center mt-5 mb-4">
        <img
          src="assests/image/Thankufinal.svg"
          alt="Company Picture"
          className="company-pic"
          loading="lazy"
        />
        <p className="text-center">{message}</p>
        <NavLink to="/">
          <button className="Login_btn">Home</button>
        </NavLink>
      </div>
    </div>
  );
}

export default ThankuFinal;
