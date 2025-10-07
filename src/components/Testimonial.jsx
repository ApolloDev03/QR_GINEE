import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { apiUrl } from "../config";

function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/testimonial`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        const data = await response.json();
        if (data.ErrorCode === "0") {
          setTestimonials(data.data);
          console.log("API RESPONSE OF TESTIMONIALS", data);
        } else {
          console.error("Error fetching testimonials:", data.Message);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  // If no testimonials, hide the section
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials section-gap">
        <div className="Header_homepage p-4">
          <h1 style={{ color: "#FFFFFF" }}>
            Clients<span style={{ color: "#FFFFFF" }}> Testimonial</span>
          </h1>
        </div>
        <div className="testimonial">
          <div className="container">
            <div className="testimonial__inner">
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 2000 }}
                pagination={{ clickable: true }}
                loop={true}
                breakpoints={{
                  575: { slidesPerView: 1 },
                  991: { slidesPerView: 2 },
                  1200: { slidesPerView: 3 },
                }}
                className="testimonial-slider"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="testimonial-slide">
                      <div className="testimonial_box posi-rl">
                        <div className="testimonial_box-inner">
                          <div className="testimonial_box-top">
                            <div className="testimonial_box-img">
                              <img
                                src={`${testimonial.photo}`}
                                alt="profile"
                                loading="lazy"
                              />
                            </div>
                            <div className="testimonial_box-name">
                              <h4>{testimonial.name}</h4>
                            </div>
                            <div className="testimonial_box-job">
                              <p>{testimonial.companyName || "No Company"}</p>
                            </div>
                            <div
                              className="stars"
                              style={{ color: "#ffc107", margin: "0 1px" }}
                            >
                              {[...Array(5)].map((_, index) => (
                                <i
                                  key={index}
                                  className={`fa fa-star ${
                                    index < testimonial.starRating
                                      ? "filled"
                                      : ""
                                  }`}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <i
                              className="fa fa-quote-left"
                              aria-hidden="true"
                            />
                            <div className="testimonial_box-text">
                              <p>{testimonial.description}</p>
                              <i
                                className="fa fa-quote-right"
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                        </div>
                        <img
                          className="ab-quote"
                          src="assests/image/arrow-shadow.png"
                          alt=""
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Testimonial;
