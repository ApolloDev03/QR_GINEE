import React from "react";
import { NavLink } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  return (
    <div>
      {/* Home start */}

      <div className="container-fluid">
        <div className="row banner">
          <div className="col-12">
            <img
              className="img-fluid"
              src="assests/image/Home_final_banner.svg"
              alt="Home Banner"
            />
          </div>
        </div>
      </div>

      {/* Home end */}
    </div>
  );
}

export default Home;
