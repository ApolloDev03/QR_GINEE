import React from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    // Close the navbar after clicking a link
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    if (navbarCollapse.classList.contains("show")) {
      navbarToggler.click(); // This triggers the collapse
    }
  };

  return (
    <div>
      <nav className="navbar sticky-top navbar-expand-lg navbar-light">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img
              src="/assests/image/new_logo_qr.png"
              alt="Brand Logo"
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
            <ul className="navbar-nav mr-2 w-100 justify-content-end ms-auto mb-2 mb-md-0 sm-pt-15">
              <li className="nav-item">
                <span
                  onClick={() => scrollToSection("aboutus")}
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                >
                  About
                </span>
              </li>
              <li className="nav-item">
                <span
                  onClick={() => scrollToSection("feature")}
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                >
                  Product
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link">
                  <Link to="/productdetail">Buy Now</Link>
                </span>
              </li>
              <li className="nav-item">
                <span
                  onClick={() => scrollToSection("howitwork")}
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                >
                  How it works
                </span>
              </li>
              <li className="nav-item">
                <span
                  onClick={() => scrollToSection("contact")}
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                >
                  Contact
                </span>
              </li>
            </ul>
            <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5 sm-ms-0">
              <li>
                <NavLink to="/userlogin">
                  <button className="Login_btn sm-mt-0">Login</button>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
