import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "../config";

function UserLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [strEmail, setStrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guid, setGuid] = useState("");
  const [vehicleOwnerMasterId, setVehicleOwnerMasterId] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(600);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const emailFromStorage = localStorage.getItem("strEmail");
    const phoneFromStorage = localStorage.getItem("phone");
    const storedGuid = localStorage.getItem("guid");
    const storedVehicleOwnerMasterId = localStorage.getItem(
      "VehicleOwnerMasterId"
    );

    if (emailFromStorage) setStrEmail(emailFromStorage);
    if (phoneFromStorage) setPhone(phoneFromStorage);
    if (storedGuid) setGuid(storedGuid);
    if (storedVehicleOwnerMasterId)
      setVehicleOwnerMasterId(storedVehicleOwnerMasterId);
  }, []);
  useEffect(() => {
    let timer;
    if (isOtpSent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown <= 0) {
      setError("OTP expired. Please request a new OTP.");
      setIsOtpSent(false);
      setPassword("");
      setCountdown(600);
    }
    return () => clearInterval(timer);
  }, [countdown, isOtpSent]);

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    if (/^\d{0,10}$/.test(input)) {
      setPhone(input);
      setError("");
    } else {
      setError("Please enter a valid 10-digit phone number.");
    }
  };

  // const handleEmailChange = (e) => {
  //   setEmail(e.target.value);
  //   setError('');
  // };

  const handleOtpChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   setError('Please enter a valid email address.');
    //   return;
    // }

    const loginUrl = `${apiUrl}/vehicle_owner/login`;

    try {
      setIsLoading(true);
      const response = await axios.post(loginUrl, { phone });
      if (response.data.Status === "Success") {
        setIsOtpSent(true);
        setCountdown(600);
        setError("");
        toast.success("OTP sent successfully!", {
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
        setError(response.data.Message || "Failed to send OTP");
        toast.error("Failed to send OTP", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Slide,
        });
      }
    } catch (error) {
      setError("An error occurred during login.");
      toast.error("An error occurred during login.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Slide,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const verifyOtpUrl = `${apiUrl}/vehicle_owner/verifyOTP`;

    try {
      setIsLoading(true);
      const response = await axios.post(verifyOtpUrl, {
        mobile: phone,
        password,
      });
      if (response.data.ErrorCode === "0") {
        const { UserLoginID, VehicleOwnerMasterId, authToken } = response.data;

        localStorage.setItem("UserLoginID", UserLoginID);
        localStorage.setItem("VehicleOwnerMasterId", VehicleOwnerMasterId);
        localStorage.setItem("authToken", authToken);

        navigate("/userdetail");
      } else {
        setError(response.data.Message || "Failed to verify OTP");
      }
    } catch (error) {
      setError("Invalid OTP..!");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      <div className="container mb-5 py-3 pt-3">
        <ToastContainer />
        <div className="text-center mt-5"></div>
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
              className="verification-form mt-2"
              onSubmit={isOtpSent ? handleVerifyOtp : handleLogin}
            >
              <h2 className="login_heading">
                {isOtpSent ? "Verify OTP" : "User Login"}
              </h2>

              {!isOtpSent && (
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
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="Enter phone number"
                        required
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                      />
                    </div>
                  </div>

                  {/* <div className="form-group mb-3">
                  <label htmlFor="email">Email Address <span className="required-asterisk">*</span></label>
                  <input type="email" className="form-control" id="email" value={email}
                    onChange={handleEmailChange} placeholder="Enter email address" maxLength="50" required />
                </div> */}
                </>
              )}

              {isOtpSent && (
                <div className="form-group mb-3">
                  <label htmlFor="password">
                    OTP <span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={handleOtpChange}
                    placeholder="Enter OTP"
                    maxLength={6}
                    required
                    onInput={(e) => {
                      e.target.value = e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 6);
                    }}
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserLogin;
