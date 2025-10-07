import React from "react";
import { NavLink } from "react-router-dom";

function Feature() {
  return (
    <div className="section-gap">
      <div className="Header_homepage mt-3">
        <h1>
          Product <span>Features</span>
        </h1>
      </div>
      <div className="container ip-features-container">
        <div className="row justify-content-c-d sm-between align-items-center">
          {/* Left side features */}
          <div className="col-lg-4 col-md-6 ip-features-left sm-order2">
            {/* 1 feature */}
            <div className="ip-features-item">
              <div className="image sm-w40 d-flex">
                <img
                  src="assests/image/feature/feature_01.svg"
                  alt="feature_1"
                  loading="lazy"
                />
                <h3 className="pl-3">
                  Vehicle <br />
                  Identification Number
                </h3>
              </div>
              <div className="text">
                <p>
                  The sticker is linked to your unique vehicle identification
                  number (VIN), ensuring the right vehicle is identified during
                  emergencies or alerts.
                </p>
              </div>
            </div>
            <div className="ip-features-item">
              <div className="image sm-w40 d-flex">
                <img
                  src="assests/image/feature/feature_2.svg"
                  alt="feature_2"
                  loading="lazy"
                />
                <h3 className="pl-3">
                  Blood Group
                  <br /> of Vehicle Owner
                </h3>
              </div>
              <div className="text">
                <p>
                  Should the owner be unreachable, emergency contacts can be
                  notified without exposing the caller's personal information.
                </p>
              </div>
            </div>
            <div className="ip-features-item">
              <div className="image sm-w40 d-flex">
                <img
                  src="assests/image/feature/feature_3.svg"
                  alt="feature_3"
                  loading="lazy"
                />
                <h3>
                  Send Predefined <br />
                  SMS to Vehicle Owner
                </h3>
              </div>
              <div className="text">
                <p>
                  Upon scanning the QR code, the user can send a pre-set SMS
                  directly to the vehicle owner, notifying them of any issues.
                </p>
              </div>
            </div>
          </div>
          {/* Product image in the center */}
          <div className="col-lg-3 col-md-4 product-image-section px-0">
            <img
              src="assests/image/arrow/left_arrow.svg"
              alt="Left Arrow"
              className="left-arrow"
              loading="lazy"
            />
            <img
              src="assests/image/product_img.svg"
              alt="Product Image"
              className="product-image w-100"
              loading="lazy"
            />
            <img
              src="assests/image/arrow/Isolation_Mode.svg"
              alt="Isolation Image"
              className="isolation-image"
              loading="lazy"
            />
            <img
              src="assests/image/arrow/vertical_dot.png"
              alt="Vertical Dot"
              className="vertical-dot"
              loading="lazy"
            />
            <img
              src="assests/image/arrow/Horizontal_img.png"
              alt="Horizontal Dot"
              className="horizontal-dot"
              loading="lazy"
            />
          </div>
          {/* Right side features */}
          <div className="col-lg-4 col-md-12 ip-features-right sm-order2">
            <div className="ip-features-item-right">
              <div className="image sm-w40 d-flex">
                <img
                  src="assests/image/feature/feature_04.svg"
                  alt="feature_4"
                  loading="lazy"
                />
                <h3>
                  Call Owner with
                  <br /> Complete Anonymity
                </h3>
              </div>
              <div className="text">
                <p>
                  All calls are rerouted through a virtual number, meaning the
                  caller's identity remains fully anonymous while still helping
                  the vehicle owner.
                </p>
              </div>
            </div>
            <div className="ip-features-item-right">
              <div className="image sm-w40 d-flex">
                <img
                  src="assests/image/feature/feature_5.svg"
                  alt="feature_5"
                  loading="lazy"
                />
                <h3 className="pl-3">
                  Reach <br />
                  Emergency Contacts
                </h3>
              </div>
              <div className="text">
                <p>
                  Should the owner be unreachable, emergency contacts can be
                  notified without exposing the caller's personal information.
                </p>
              </div>
            </div>
            <NavLink to="/productdetail">
              <button className="btn btn_main">Buy now</button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feature;
