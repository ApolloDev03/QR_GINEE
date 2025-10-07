// import React from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";

// function Navbar_white() {
//   const navigate = useNavigate();

//   const handleSectionClick = (sectionId) => {
//     // Navigate to the homepage
//     navigate("/");

//     // Delay to allow for page load, then scroll to the specified section
//     setTimeout(() => {
//       const sectionElement = document.getElementById(sectionId);
//       if (sectionElement) {
//         sectionElement.scrollIntoView({ behavior: "smooth" });
//       }
//     }, 100);
//   };

//   return (
//     <div>
//       <nav
//         className="navbar sticky-top navbar-expand-lg navbar-light"
//         aria-label="Furni navigation bar"
//       >
//         <div className="container">
//           <NavLink className="navbar-brand" to="/">
//             <img
//               src="/assests/image/new_logo_qr.png"
//               alt="Brand Logo"
//               style={{ height: "50px" }}
//               loading="lazy"
//             />
//           </NavLink>
//           <button
//             className="navbar-toggler collapsed"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarsFurni"
//             aria-controls="navbarsFurni"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span />
//             <span />
//             <span />
//           </button>
//           <div className="collapse navbar-collapse" id="navbarsFurni">
//             <ul className="new-navbar-nav navbar-nav ms-auto sm-mt15 mb-2 mb-md-0">
//               <li className="nav-item-spacing">
//                 <button
//                   className="nav-link"
//                   onClick={() => handleSectionClick("aboutus")}
//                   style={{ background: "none", border: "none" }}
//                 >
//                   About
//                 </button>
//               </li>
//               <li className="nav-item-spacing">
//                 <button
//                   className="nav-link"
//                   onClick={() => handleSectionClick("feature")}
//                   style={{ background: "none", border: "none" }}
//                 >
//                   Product
//                 </button>
//               </li>
//               <li className="nav-item-spacing">
//                 <Link className="nav-link" to="/productdetail">
//                   Buy Now
//                 </Link>
//               </li>
//               <li className="nav-item-spacing">
//                 <button
//                   className="nav-link"
//                   onClick={() => handleSectionClick("howitwork")}
//                   style={{ background: "none", border: "none" }}
//                 >
//                   How it works
//                 </button>
//               </li>
//               <li className="nav-item-spacing">
//                 <button
//                   className="nav-link"
//                   onClick={() => handleSectionClick("contact")}
//                   style={{ background: "none", border: "none" }}
//                 >
//                   Contact
//                 </button>
//               </li>
//             </ul>

//             <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5 sm-ms-0">
//               <li>
//                 <NavLink to="/userlogin">
//                   <button className="Login_btn sm-mt-0">Login</button>
//                 </NavLink>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }

// export default Navbar_white;

import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
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
                  onClick={() => handleSectionClick("aboutus")}
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                >
                  About
                </span>
              </li>
              <li className="nav-item">
                <span
                  onClick={() => handleSectionClick("feature")}
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
                  onClick={() => handleSectionClick("howitwork")}
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                >
                  How it works
                </span>
              </li>
              <li className="nav-item">
                <span
                  onClick={() => handleSectionClick("contact")}
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
