import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify
import { apiUrl } from "../config";
console.log(apiUrl, "Url");

function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const guid = localStorage.getItem("guid");
  const VehicleOwnerMasterId = "";
  const UserLogInID = "";
  //  New add 9-11-2024
  const setStrEmail = "";
  //  New add 9-11-2024

  const [phone, setPhone] = useState("");
  // const [strEmail, setStrEmail] = useState('');
  // const [strPhone, setStrPhone] = useState('');
  const strEmail = "";
  const strPhone = "";
  const [password, setPassword] = useState(""); // For OTP
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(600); // Timer for 5-minute countdown
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // useEffect(() => {
  //   if (guid && VehicleOwnerMasterId) {
  //     localStorage.setItem('guid', guid);
  //     localStorage.setItem('VehicleOwnerMasterId', VehicleOwnerMasterId);
  //   }

  //   console.log('GUID by login:', guid);
  //   console.log('VehicleOwnerMasterId by login:', VehicleOwnerMasterId);
  // }, [guid, VehicleOwnerMasterId]);

  useEffect(() => {
    let timer;
    if (isOtpSent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown <= 0) {
      setError("OTP expired. Please request a new OTP.");
      setIsOtpSent(false); // Reset to the email and phone input form
      setPassword(""); // Clear the OTP input
      setCountdown(600); // Reset countdown
    }
    return () => clearInterval(timer);
  }, [countdown, isOtpSent]);

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    if (input.length <= 10) {
      setPhone(input);
    }
  };

  const handleOtpChange = (e) => {
    const input = e.target.value;
    if (input.length <= 6) {
      setPassword(input); // OTP is stored in password state
    }
  };

  // const handlePhoneChange = (e) => setStrPhone(e.target.value);
  const handleEmailChange = (e) => setStrEmail(e.target.value);
  const handleLogin = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    const loginUrl = `${apiUrl}/login`;

    try {
      setIsLoading(true); // Start loading
      const response = await axios.post(loginUrl, {
        strEmail,
        strPhone,
        phone,
        guid,
        // UserLogInID,
        // VehicleOwnerMasterId
      });

      if (response.data.Status === "Success") {
        setIsOtpSent(true);
        setCountdown(600); // Start 10-minute countdown
        setError("");
        // local storage
        localStorage.setItem(
          "VehicleOwnerMasterId",
          response.data.VehicleOwnerMasterId
        );
        localStorage.setItem("UserLoginID", response.data.UserLogInID);
        localStorage.setItem("strPhone", response.data.strPhone);
        localStorage.setItem("strEmail", response.data.strEmail);
        // strPhone=response.data.strPhone;
        // strEmail=response.data.strEmail;
        console.log("login-response", localStorage.getItem("UserLoginID"));
        toast.success("OTP sent successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Slide, // Use Slide transition
        });
      } else {
        setError(response.data.Message || "Failed to send OTP");
      }
    } catch (error) {
      setError("An error occurred during login.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const verifyOtpUrl = `${apiUrl}/verifyOTP`;

    try {
      setIsLoading(true); // Start loading
      const response = await axios.post(verifyOtpUrl, {
        phone,
        password,
        guid,
        // UserLogInID,
        // VehicleOwnerMasterId
      });

      if (response.data.ErrorCode === "0") {
        const updatedVehicleOwnerMasterId =
          response.data.VehicleOwnerMasterId || VehicleOwnerMasterId;
        const authToken = response.data.authorisation.token; // Get the auth token

        // Store authToken in localStorage
        localStorage.setItem("authToken", authToken);
        // localStorage.setItem('VehicleOwnerMasterId', updatedVehicleOwnerMasterId);

        // Check vehicle count to determine redirect
        if (response.data.vehiclecount === 0) {
          navigate("/profiledetail", {
            state: {
              strEmail: localStorage.getItem("strEmail"),
              strPhone: localStorage.getItem("strPhone"),
            },
          });
        } else {
          navigate("/logindetail");
        }

        toast.success("OTP verified successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Slide,
        });
      } else {
        setError(response.data.Message || "Failed to verify OTP");
      }
    } catch (error) {
      setError("Invalid OTP..!"); // Handle error case
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Convert countdown seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="container mt-5 mb-4">
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
          <div className="text-center mb-3">
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
            onSubmit={isOtpSent ? handleVerifyOtp : handleLogin}
          >
            <h2 className="login_heading">
              {isOtpSent ? "Verify OTP" : "Login"}
            </h2>

            {!isOtpSent && (
              <div className="form-group mb-3">
                <label htmlFor="phone">
                  Phone Number <span className="required-asterisk">*</span>
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">+91</span>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter phone number"
                    required
                    inputMode="numeric"
                  />
                </div>
              </div>
            )}

            {isOtpSent && (
              <div className="form-group mb-3">
                <label htmlFor="otp">
                  OTP <span className="required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  value={password}
                  onChange={handleOtpChange}
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
              disabled={isLoading}
            >
              {isLoading ? (
                <span>
                  <span className="loading-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                  {isOtpSent ? "Verifying OTP" : "Sending OTP"}
                </span>
              ) : isOtpSent ? (
                "Verify OTP"
              ) : (
                "Send OTP"
              )}
            </button>
            <div className="text-center mt-4">
              <p>
                Don't have an account?{" "}
                <NavLink to="/register" state={{ guid, VehicleOwnerMasterId }}>
                  <span
                    className="link"
                    style={{
                      color: "#EF4F5F",
                      textDecoration: "underline",
                      fontWeight: "600",
                    }}
                  >
                    Register{" "}
                  </span>
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
