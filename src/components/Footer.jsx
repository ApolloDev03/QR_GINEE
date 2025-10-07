import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const handleSectionClick = (sectionId) => {
    // Navigate to the homepage
    navigate("/");

    // Delay to allow for page load, then scroll to the specified section
    setTimeout(() => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div>
      {/* Footer start */}
      <section className="footer-section" style={{ padding: "10px 0" }}>
        {" "}
        {/* Adjusted padding */}
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="footer-logo mt-3">
                <a href="#" className="footer-logo">
                  <img
                    src="/assests/image/Footer_logo.svg"
                    alt="QR Genie Logo"
                    style={{ height: "50px" }}
                    loading="lazy"
                  />
                </a>
              </div>
              {/* <p className="mb-4 text-white mt-3">
                Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique. Pellentesque habitant
              </p> */}
              <ul className="list-unstyled custom-social mt-4">
                <li style={{ marginRight: "15px" }}>
                  <NavLink
                    to="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="fa fa-brands fa-facebook-f" />
                  </NavLink>
                </li>
                <li style={{ marginRight: "15px" }}>
                  <NavLink
                    to="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="fa fa-brands fa-instagram" />
                  </NavLink>
                </li>
                <li style={{ marginRight: "15px" }}>
                  <NavLink
                    to="https://www.twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="fa fa-brands fa-x-twitter" />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="https://www.youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="fa fa-brands fa-youtube" />
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="col-lg-7">
              <div className="row links-wrap">
                <h4
                  className="text-white mt-2"
                  style={{
                    borderBottom: "1px solid #C6C6C6",
                    paddingBottom: "1rem",
                  }}
                >
                  Quick Links
                </h4>
                <div className="col-6 col-sm-6 col-md-6">
                  <ul className="list-unstyled">
                    <li onClick={() => handleSectionClick("home")}>
                      <NavLink to="/">Home</NavLink>
                    </li>
                    <li onClick={() => handleSectionClick("aboutus")}>
                      <NavLink to="#">About us</NavLink>
                    </li>
                    <li onClick={() => handleSectionClick("feature")}>
                      <NavLink to="/productdetail">Our Product</NavLink>
                    </li>
                    <li onClick={() => handleSectionClick("contact")}>
                      <NavLink to="/contactus">Contact us</NavLink>
                    </li>
                    {/* <li><NavLink to="#">Features</NavLink></li> */}
                  </ul>
                </div>
                <div className="col-6 col-sm-6 col-md-6">
                  <ul className="list-unstyled">
                    {/* <li><NavLink to="#">Sitemap</NavLink></li> */}
                    <li>
                      <NavLink to="/shippingdelivery">
                        Shipping &amp; Delivery
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/termscondition">
                        Terms &amp; Conditions
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/privacypolicy">Privacy & Policy </NavLink>
                    </li>
                    <li>
                      <NavLink to="/refundpolicy">Refund Policy</NavLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer end */}

      {/* Footer bottom */}
      {/* <section className="footer-bottom" style={{ backgroundColor: '#1D1D1D', height: '40px', justifyContent: 'center', textAlign: 'center', padding: '10px 0' }}> 
        <div className="container">
          <div className="row">
            <div className="col-6 text-start">
              <p className="mb-0 text-white">©2019 - 2024 QR Genie</p>
            </div>
            <div className="col-6 text-end">
              <p className="mb-0 text-white">Powered by - Insightsoft Solutions LLP</p>
            </div>
          </div>
        </div>
      </section> */}
      {/* Footer bottom end */}
    </div>
  );
}

export default Footer;
