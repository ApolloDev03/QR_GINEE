import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl } from "../config";

const LoginDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extracting guid and VehicleOwnerMasterId from the state or local storage

  const guid = localStorage.getItem("SCANGUID");
  const VehicleOwnerMasterId = localStorage.getItem("VehicleOwnerMasterId");
  const UserLoginID = localStorage.getItem("UserLoginID");
  console.log("login-guid", guid);
  console.log("login-UserLogInID", UserLoginID);
  console.log("login-VehicleOwnerMasterId", VehicleOwnerMasterId);

  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState("");
  const [plateNumberError, setPlateNumberError] = useState("");
  const [emergencyNumberError, setEmergencyNumberError] = useState("");
  const [formError, setFormError] = useState("");

  // Validate the vehicle plate number
  const validatePlateNumber = (plateNumber) => {
    const isValid = /^[A-Za-z0-9]{4,10}$/.test(plateNumber);
    if (!isValid) {
      setPlateNumberError(
        "Vehicle plate number must be between 4 and 10 alphanumeric characters."
      );
    } else {
      setPlateNumberError("");
    }
    return isValid;
  };

  // Validate the form before submission
  const validateForm = () => {
    let isValid = true;

    if (!validatePlateNumber(vehiclePlateNumber)) {
      isValid = false;
    }

    if (!/^\d{10}$/.test(emergencyContactNumber)) {
      setEmergencyNumberError(
        "Emergency contact number must be exactly 10 digits."
      );
      isValid = false;
    } else {
      setEmergencyNumberError("");
    }
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) {
      return; // Exit if form validation fails
    }

    const data = {
      emergencyContactNumber,
      vehiclePlateNumber,
      guid,
      VehicleOwnerMasterId,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/addvehicledetail`,
        data
      );
      if (response.status === 200) {
        navigate("/thank-you-postpaid"); // Navigate to Thank You page
      }
    } catch (error) {
      setFormError("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <div className="container mb-2">
      <h5
        className="text-start mt-4"
        style={{
          color: "#4E4E4E",
          borderBottom: "2px #BEBEBE solid",
          justifyContent: "center",
        }}
      >
        Vehicle Information
      </h5>
      <form onSubmit={handleSubmit}>
        <div className="form-group row mt-2">
          <div className="col-md-6">
            <label htmlFor="vehiclePlateNumber" className="text-black">
              Vehicle Plate Number <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="vehiclePlateNumber"
              name="vehiclePlateNumber"
              value={vehiclePlateNumber}
              onChange={(e) => setVehiclePlateNumber(e.target.value)}
              onBlur={() => validatePlateNumber(vehiclePlateNumber)}
              maxLength="10"
              required
            />
            {plateNumberError && (
              <div className="text-danger">{plateNumberError}</div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="emergencyContactNumber" className="text-black">
              Emergency Contact Number{" "}
              <span className="required-asterisk">*</span>
            </label>
            <input
              type="tel"
              className="form-control"
              id="emergencyContactNumber"
              name="emergencyContactNumber"
              value={emergencyContactNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setEmergencyContactNumber(value);
                }
              }}
              maxLength="10"
              required
            />
            {emergencyNumberError && (
              <div className="text-danger">{emergencyNumberError}</div>
            )}
          </div>
        </div>
        {formError && <div className="alert alert-danger">{formError}</div>}
        <button type="submit" className="btn btn-primary btn-block">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginDetail;
