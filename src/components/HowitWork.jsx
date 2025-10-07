import React from "react";

function HowitWork() {
  return (
    <div>
      {/* how it works start */}
      <section
        className="how_works pad-80"
        style={{ backgroundColor: "#F4F4F4" }}
      >
        <div className="Header_homepage p-3">
          <h1>
            How It <span>Works</span>
          </h1>
        </div>
        <div className="container">
          <h6
            className="text-center"
            style={{ color: "#666666", marginTop: 20 }}
          >
            Getting started with QR Genie services
          </h6>
          <div className="row course_section position-relative">
            {/* Vertical dot image for 1st card */}
            <img
              src="assests/image/arrow/vertical_dot.png"
              alt="Vertical Dots"
              className="vertical-dot-on-card-1"
              loading="lazy"
            />
            {/* Right arrow between card 1 and card 2 */}
            <img
              src="assests/image/arrow/up_arrow.svg"
              alt="Right_up Arrow"
              className="right-arrow-between-cards-1-2"
              loading="lazy"
            />
            <div className="col-lg-3 col-md-6 col-sm-12 mt-5 card-column">
              <div className="card p-4 position-relative">
                <div className="number-box">1</div>
                <h6 className="card-title">Purchase the Product</h6>
                <div className="card-body">
                  <p>
                    You can buy QR Genie either online or through our trusted
                    affiliate partners. Once the payment is successful, we’ll
                    ship your product directly to you.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mt-5 card-column">
              <div className="card p-4">
                <div className="number-box">2</div>
                <h6 className="card-title">Receive the Stickers</h6>
                <div className="card-body">
                  <p>
                    Each purchase includes two QR Genie stickers that you can
                    apply to your vehicle(s).
                  </p>
                </div>
              </div>
            </div>
            {/* Left arrow below the space between card 2 and card 3 */}
            <img
              src="assests/image/arrow/Down_arrow.svg"
              alt="Left Arrow"
              className="left-arrow-below-cards-2-3"
              loading="lazy"
            />
            <div className="col-lg-3 col-md-6 col-sm-12 mt-5 card-column">
              <div className="card p-4">
                <div className="number-box">3</div>
                <h6 className="card-title">Register Your Details</h6>
                <div className="card-body">
                  <p>
                    After receiving your stickers, simply scan the QR code to
                    register. You will be asked to enter your personal details,
                    vehicle identification number (VIN), and emergency contact
                    information.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mt-5 card-column">
              <div className="card p-4">
                <div className="number-box">4</div>
                <h6 className="card-title">Ready to Use</h6>
                <div className="card-body">
                  <p style={{}}>
                    Once registered, your vehicle is protected for life. Any
                    passerby can scan the code, send a pre-set SMS, or make an
                    anonymous call to inform you of any issues with your
                    vehicle. The caller’s identity will always be protected
                    through a virtual number rerouting system.
                  </p>
                </div>
              </div>
            </div>
            {/* Right arrow between card 3 and card 4 */}
            <img
              src="assests/image/arrow/up_arrow.svg"
              alt="Right_up Arrow"
              className="right-arrow-between-cards-3-4"
              loading="lazy"
            />
            {/* Horizontal dot image for 1st card */}
            <img
              src="assests/image/arrow/Horizontal_img.png"
              alt="Horizontal Dots"
              className="horizontal-dot-on-card-1"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default HowitWork;
