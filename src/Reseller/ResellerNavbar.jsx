import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

function ResellerNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close the menu when the location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div>
      <nav
        className="custom-navbar navbar navbar-expand-md navbar-dark"
        aria-label="Furni navigation bar"
      >
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img
              src="/assests/image/new_logo_qr.png"
              alt="Brand Logo"
              loading="lazy"
            />
          </NavLink>
          <button
            className={`navbar-toggler ${isMenuOpen ? "" : "collapsed"}`}
            type="button"
            aria-controls="navbarsFurni"
            aria-expanded={isMenuOpen ? "true" : "false"}
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
          <div
            className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
            id="navbarsFurni"
          >
            <ul className="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
              <li>
                <NavLink
                  className="nav-link"
                  to="/myorder"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Order
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="nav-link"
                  to="/neworder"
                  onClick={() => setIsMenuOpen(false)}
                >
                  New Order
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="nav-link"
                  to="/myqrcode"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My QRcodes
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="nav-link"
                  to="/myaccount"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="nav-link"
                  to="/paymentlist"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Payment List
                </NavLink>
              </li>
            </ul>
            <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
              <li className="nav-item" style={{ marginRight: 50 }}>
                <NavLink
                  className="nav-link active"
                  to="/resellerlogin"
                  style={{ color: "#000000" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i
                    className="fas fa-sign-out-alt"
                    style={{ color: "#000000" }}
                  />{" "}
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default ResellerNavbar;
