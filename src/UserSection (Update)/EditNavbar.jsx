import React from "react";
import { NavLink } from "react-router-dom";

function EditNavbar() {
  const quickContactImg = "assests/image/quick_final.png";
  const logoImg = "assests/image/new_logo_qr.png";

  return (
    <div>
      <header className="header-container d-flex justify-content-between align-items-center mb-2">
        <NavLink to="/userdetail">
          <img
            src={logoImg}
            alt="Logo"
            className="logo-img Register-logo-img"
            style={{ height: "60px", paddingLeft: "17px", width: "175px" }}
            loading="lazy"
          />{" "}
        </NavLink>
        <img
          src={quickContactImg}
          alt="Quick Contact"
          className="quick-img"
          loading="lazy"
        />
      </header>
    </div>
  );
}

export default EditNavbar;
