import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for Toastify
import { apiUrl } from "../config";
// console.log(apiUrl, "register Page");

function Register() {
  const location = useLocation();
  const navigate = useNavigate();

  const { guid, VehicleOwnerMasterId } = location.state || {
    guid: localStorage.getItem("guid"),
    VehicleOwnerMasterId: localStorage.getItem("VehicleOwnerMasterId"),
  };

  const [strEmail, setStrEmail] = useState("");
  const [strPhone, setStrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10-minute countdown for OTP

  useEffect(() => {
    if (guid && VehicleOwnerMasterId) {
      localStorage.setItem("guid", guid);
      localStorage.setItem("VehicleOwnerMasterId", VehicleOwnerMasterId);
    }

    console.log("GUID by register:", guid);
    console.log("VehicleOwnerMasterId by register:", VehicleOwnerMasterId);
  }, [guid, VehicleOwnerMasterId]);

  useEffect(() => {
    let timer;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown <= 0) {
      setError("OTP expired. Please request a new OTP.");
      setOtpSent(false); // Reset to the email and phone input form
      setPassword(""); // Clear the OTP input
      setCountdown(600); // Reset countdown
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handlePhoneChange = (e) => setStrPhone(e.target.value);
  const handleEmailChange = (e) => setStrEmail(e.target.value);
  const handleOtpChange = (e) => setPassword(e.target.value);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const registerUrl = `${apiUrl}/register`;

    try {
      const response = await axios.post(registerUrl, {
        strEmail,
        strPhone,
        guid,
        VehicleOwnerMasterId,
      });

      if (response.data.Status === "Success") {
        setOtpSent(true);
        setCountdown(600); // Start 5-minute countdown
        setError("");

        toast.success("OTP sent successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          transition: Slide,
        });
      } else {
        setError(response.data.Message || "Failed to send OTP");
        toast.error("Failed to send OTP", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          transition: Slide,
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Extract and format error messages
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        setError(errorMessages);

        toast.error(errorMessages, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          transition: Slide,
        });
      } else {
        setError("User Already Registered..!");
        toast.error("User Already Registered..!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          transition: Slide,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const verifyOtpUrl = `${apiUrl}/verifyOTP`;

    try {
      const response = await axios.post(verifyOtpUrl, {
        strEmail,
        phone: strPhone,
        password,
        guid,
        VehicleOwnerMasterId,
      });
      console.log("Verify OTP Response:", response.data);

      if (response.data.Status === "Success") {
        setError("");

        const updatedVehicleOwnerMasterId =
          response.data.VehicleOwnerMasterId || VehicleOwnerMasterId;
        const updatedGuid = response.data.guid || guid;

        localStorage.setItem(
          "VehicleOwnerMasterId",
          updatedVehicleOwnerMasterId
        );
        localStorage.setItem("guid", updatedGuid);

        navigate("/profiledetail", {
          state: {
            // guid: updatedGuid,
            // VehicleOwnerMasterId: updatedVehicleOwnerMasterId,
            strEmail,
            strPhone,
          },
        });
      } else {
        setError(response.data.Message || "Failed to verify OTP");
        toast.error("Failed to verify OTP", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          transition: Slide,
        });
      }
    } catch (error) {
      setError("Invalid OTP..!");
      toast.error("Invalid OTP..!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        transition: Slide,
      });
    } finally {
      setLoading(false);
    }
  };

  // Convert countdown seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="container mt-5 mb-5">
      <ToastContainer />
      <div className="text-center mb-3">
        <img
          src="/assests/image/new_logo_qr.png"
          alt="Logo"
          className="img-fluid logo_heading"
          style={{ maxWidth: "150px" }}
          loading="lazy"
        />
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="text-center mt-5">
            <img
              src="assests/image/login_img.svg"
              alt="Company Picture"
              className="company-pic"
              loading="lazy"
            />
          </div>
        </div>
        <div className="col-md-6">
          <form
            className="verification-form mt-5"
            onSubmit={otpSent ? handleVerifyOtp : handleRegister}
          >
            <h2 className="login_heading">
              {otpSent ? "Verify OTP" : "Register"}
            </h2>
            {!otpSent && (
              <>
                <div className="form-group mb-3">
                  <label htmlFor="phone">
                    Phone Number <span className="required-asterisk">*</span>
                  </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">+91</span>
                    </div>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      value={strPhone}
                      onChange={handlePhoneChange}
                      placeholder="Enter phone number"
                      maxLength="10"
                      required
                    />
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="email">
                    Email Address <span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={strEmail}
                    onChange={handleEmailChange}
                    placeholder="Enter email address"
                    maxLength="50"
                    required
                  />
                </div>
              </>
            )}

            {otpSent && (
              <div className="form-group mb-3">
                <label htmlFor="password">
                  OTP <span className="required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    const otp = e.target.value;
                    // Only allow input if it's numeric and up to 6 digits
                    if (/^\d{0,6}$/.test(otp)) {
                      setPassword(otp);
                    }
                  }}
                  placeholder="Enter OTP"
                  maxLength="6" // Restrict to 6 digits
                  required
                />

                <small className="text-muted">
                  OTP expires in {formatTime(countdown)}
                </small>
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <button
              type="submit"
              className="btn btn-block mt-3"
              disabled={loading}
            >
              {loading ? "Please wait..." : otpSent ? "Verify OTP" : "Register"}
            </button>
            <div className="text-center mt-4">
              <p>
                Already have an account?{" "}
                <Link to="/login" state={{ guid, VehicleOwnerMasterId }}>
                  <span
                    className="link"
                    style={{
                      color: "#EF4F5F",
                      textDecoration: "underline",
                      fontWeight: "600",
                    }}
                  >
                    Login
                  </span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
