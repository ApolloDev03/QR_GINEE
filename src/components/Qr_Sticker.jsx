import React from 'react'
import { NavLink } from 'react-router-dom';

function Qr_Sticker() {
  return (
  <div>
  {/* Qr sticker start */}
  <section className="QR_sticker">
    <div className="container">
      <div className="row g-0 align-items-center sm-flex-col">
        <div className="col-lg-6 d-flex align-items-center justify-content-center h-100">
          <div className="left-content_QR_sticker w-100">
            <h2>QR Genie Sticker Pack </h2>
            <h6>Lifetime Vehicle Protection at Your Fingertips</h6>
            <p>Your vehicle's safety is now in your control with QR Genie.  Get two lifetime-use QR
              stickers that provide seamless, anonymous communication in emergencies. Whether it's a forgotten light,
              an accident, or an open window, any passerby can help without revealing their identity. Purchase online
              or through an affiliate partner and enjoy lifetime peace of mind with QR Genie.</p>
              <NavLink to="/productdetail" className="btn btn-white-outline abc-btn">Buy now</NavLink>

          </div>
        </div>
        {/* Right side: image */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center h-100  position-relative">
          <div className="right-image w-100 text-end">
            <img src="assests/image/QR_sticker.svg" alt="QR Genie" className="img-fluid right-main-img" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* Qr sticker end*/}
</div>

  )
}

export default Qr_Sticker