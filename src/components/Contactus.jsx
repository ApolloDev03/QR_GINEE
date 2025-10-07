import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config";

const Contactus = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validatePhone = (phone) => /^\d{10}$/.test(phone); // Ensure only numbers and exactly 10 digits
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname) newErrors.firstname = "First name is required.";
    if (!formData.lastname) newErrors.lastname = "Last name is required.";
    if (!formData.email)
      newErrors.email = "Email is required."; // Add required email validation
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email address.";
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    else if (!validatePhone(formData.phone))
      newErrors.phone = "Phone number must be a valid 10-digit number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For phone number, restrict alphabet entry and enforce max length 10
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return; // Prevent non-digit characters
      if (value.length > 10) return; // Prevent more than 10 digits
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${apiUrl}/inquiry`,
        formData
      );
      toast.success(response.data.Message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Slide,
      });

      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        message: "",
      });
      setErrors({});

      setTimeout(() => {
        navigate("/thank-you");
      }, 3000);
    } catch (error) {
      toast.error("An error occurred while submitting the inquiry.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Slide,
      });
      console.error("There was an error!", error);
    }
  };

  return (
    <div>
      <section id="contact" className="contact section-gap">
        <div className="container">
          <div className="Header_homepage">
            <h1>
              Contact <span>Us</span>
            </h1>
          </div>
          <div className="row">
            <div className="col-lg-8 mt-5 sm-mt-0 mt-lg-0 d-flex align-items-stretch">
              <form className="php-email-form mt-5" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label htmlFor="firstname">
                      First Name <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      className="form-control"
                      id="firstname"
                      onChange={handleChange}
                      value={formData.firstname}
                      aria-required="true"
                      maxLength="30"
                    />
                    {errors.firstname && (
                      <div className="text-danger">{errors.firstname}</div>
                    )}
                  </div>
                  <div className="form-group col-md-6 mt-3 mt-md-0">
                    <label htmlFor="lastname">
                      Last Name <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      className="form-control"
                      id="lastname"
                      onChange={handleChange}
                      value={formData.lastname}
                      aria-required="true"
                      maxLength="30"
                      required
                    />
                    {errors.lastname && (
                      <div className="text-danger">{errors.lastname}</div>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="email">
                      Email <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      onChange={handleChange}
                      value={formData.email}
                      aria-required="true"
                      maxLength="50"
                      required
                    />
                    {errors.email && (
                      <div className="text-danger">{errors.email}</div>
                    )}
                  </div>
                  <div className="form-group col-md-6 mt-3 mt-md-0">
                    <label htmlFor="phone">
                      Phone <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      id="phone"
                      onChange={handleChange}
                      value={formData.phone}
                      aria-required="true"
                      maxLength="10"
                      required
                    />
                    {errors.phone && (
                      <div className="text-danger">{errors.phone}</div>
                    )}
                  </div>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="message">Message</label>
                  <textarea
                    className="form-control"
                    name="message"
                    rows={5}
                    onChange={handleChange}
                    value={formData.message}
                  />
                  {errors.message && (
                    <div className="text-danger">{errors.message}</div>
                  )}
                </div>
                <div className="mt-4">
                  <button className="btn_main" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
            <div className="col-lg-4 d-flex align-items-stretch mt-5">
              <div className="info">
                <h4>More Information</h4>
                {/* <div className="phone">
                  <i className="fa-solid fa-phone" />
                  <p>+91 9967542470</p>
                </div> */}
                <div className="email mb-3">
                  <i className="fa-regular fa-envelope" />

                  <p>contact@myqrgenie.com</p>
                </div>

                {/* <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12097.433213460943!2d-74.0062269!3d40.7101282!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb89d1fe6bc499443!2sDowntown+Conference+Center!5e0!3m2!1smk!2sbg!4v1539943755621"
                  frameBorder={0}
                  style={{
                    border: 0,
                    width: "100%",
                    height: 320,
                    borderRadius: "8px",
                  }}
                  allowFullScreen
                /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default Contactus;
