import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Autoplay } from "swiper/modules";
function Aboutus() {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // Delay between slides in ms (2 seconds here)
    speed: 500, // Transition speed in ms
    slidesToShow: 3,
    slidesToScroll: 1, // Slides to scroll at a time
    responsive: [
      {
        breakpoint: 991, // Screen width <= 991px
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 575, // Screen width <= 575px
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div>
      {/* home 2 start */}
      <section className="secondary_home section-gap">
        <div className="Header_homepage">
          <h1>
            Welcome to <span>QR Genie</span>
          </h1>
        </div>
        {/* heading section */}
        <section>
          <div className="container">
            <div className="row g-0 mt60 sm-flex-dcol md-flex-dcol">
              <div className="col-lg-6 d-flex align-items-center justify-content-center h-100 mt-4 sm-mt-0 secondary_home">
                <div className="left-content w-100  sm-pt0">
                  <p>
                    Your personal safety assistant for your vehicle. Imagine a
                    scenario where your vehicle is in trouble, whether it's a
                    minor mishap, a forgotten light left on, or an open window.
                    Anyone passing by can easily scan the QR code on your
                    vehicle and alert you instantly, but with a crucial feature
                    – <strong>the caller’s identity remains anonymous.</strong>
                    The message or call is rerouted through a virtual number,
                    ensuring privacy at all times.
                  </p>
                  <p>
                    <strong>QR Genie</strong> is a one-time purchase product
                    that offers lifetime usage. It's designed to offer peace of
                    mind knowing that you’ll always be reachable when your
                    vehicle needs attention. Available for purchase online or
                    through our affiliate partners, QR Genie comes with two QR
                    stickers, enabling seamless tracking and registration of
                    your vehicle. Once you've received your stickers, simply
                    register and map the QR codes to your details to start using
                    it right away.
                  </p>
                </div>
              </div>

              <div className="col-lg-6 d-flex align-items-center justify-content-center h-100 position-relative">
                <div className="right-image w-100 position-relative">
                  <img
                    src="assests/image/Home/Home_banner_2.png"
                    alt="QR Genie"
                    className="img-fluid right-main-img"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* home 2 end */}

        <div className="container-fluid ov-x-h pt50">
          <Slider {...settings}>
            <div>
              <img
                src="assests/image/text_img/text_1.svg"
                alt="One time purchase"
                className="img-fluid mx-auto d-block"
              />
            </div>
            <div>
              <img
                src="assests/image/text_img/text_2.svg"
                alt="Caller privacy"
                className="img-fluid mx-auto d-block"
              />
            </div>
            <div>
              <img
                src="assests/image/Contact-img.png"
                alt="Reach emergency co"
                className="img-fluid mx-auto d-block"
              />
            </div>
          </Slider>
        </div>
      </section>
    </div>
  );
}

export default Aboutus;
