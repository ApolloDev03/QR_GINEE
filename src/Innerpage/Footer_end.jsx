import React from "react";

function Footer_end() {
  return (
    <>
      <section
        className="footer-bottom"
        style={{
          backgroundColor: "#1D1D1D",
          justifyContent: "center",
          textAlign: "center",
          padding: "10px 0",
          position: "relative",
          bottom: "0px",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 text-center text-md-start mb-2 mb-md-0">
              <p className="mb-0 text-white">©2019 - 2024 QR Genie</p>
            </div>
            <div className="col-12 col-md-6 text-center text-md-end">
              <p className="mb-0 text-white">
                Powered by - Insightsoft Solutions LLP
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Footer_end;
