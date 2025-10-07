import React from "react";
import { NavLink } from "react-router-dom";

function Navbar_white() {
  return (
    <div>
      <nav
        className="new-navbar navbar navbar-expand-md navbar-light"
        aria-label="Furni navigation bar"
      >
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img
              src="/assests/image/new_logo_qr.png"
              alt="Brand Logo"
              style={{ height: "50px" }}
              loading="lazy"
            />
          </NavLink>
          <button
            className="navbar-toggler collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarsFurni"
            aria-controls="navbarsFurni"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
          <div className="collapse navbar-collapse" id="navbarsFurni">
            <ul className="new-navbar-nav navbar-nav ms-auto sm-mt15 mb-2 mb-md-0">
              <li className="nav-item-spacing">
                <NavLink className="nav-link" to="/">
                  About
                </NavLink>
              </li>
              <li className="nav-item-spacing">
                <NavLink className="nav-link" to="/">
                  Product
                </NavLink>
              </li>
              <li className="nav-item-spacing">
                <NavLink className="nav-link" to="/">
                  How it works
                </NavLink>
              </li>
              <li className="nav-item-spacing">
                <NavLink className="nav-link" to="/#contact">
                  Contact
                </NavLink>
              </li>
            </ul>

            <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5 sm-ms-0">
              <li>
                <NavLink to="/userlogin">
                  <button
                    className="Login_new sm-m0"
                    style={{ marginRight: "-13px" }}
                  >
                    Login
                  </button>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar_white;
