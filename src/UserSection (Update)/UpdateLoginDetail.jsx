import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';

function UpdateLoginDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { VehicleOwnerMasterDetailId, vehiclePlateNumber, emergencyContactNumber, UserLoginID } = location.state || {};
  const {item} = location.state;
console.log("item" ,item)
  const [plateNumber, setPlateNumber] = useState(vehiclePlateNumber || '');
  const [emergencyNumber, setEmergencyNumber] = useState(emergencyContactNumber || '');
  const [loading, setLoading] = useState(false);
  const [plateNumberError, setPlateNumberError] = useState('');
  const [emergencyNumberError, setEmergencyNumberError] = useState('');

  const validatePlateNumber = (plateNumber) => {
    const regex = /^[A-Za-z0-9]{4,10}$/;
    if (!regex.test(plateNumber)) {
      setPlateNumberError('Vehicle plate number should be alphanumeric and between 4 and 10 characters long.');
      return false;
    }
    setPlateNumberError('');
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate vehicle plate number
    if (!validatePlateNumber(plateNumber)) {
      setLoading(false);
      return;
    }

    if (emergencyNumber.length !== 10) {
      setEmergencyNumberError('Emergency contact number should be exactly 10 digits.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/vehicle_owner/UpdateQRCode`, {
        VehicleOwnerMasterDetailId,
        vehiclePlateNumber: plateNumber,
        emergencyContactNumber: emergencyNumber,
        UserLoginID
      });
      if (response.data.ErrorCode === "0") {
        navigate('/userdetail');
      } else {
        console.error(response.data.Message);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyNumberChange = (e) => {
    const value = e.target.value;
    // Allow only numeric values and limit length to 10
    if (/^\d*$/.test(value) && value.length <= 10) {
      setEmergencyNumber(value);
      setEmergencyNumberError(''); 
    }
  };

  return (
    <div className="container mt-5 mb-3">
      <h2 className="text-center">Edit Vehicle Information</h2>
      <form onSubmit={handleUpdate}>
        <div className="col-md-6 mb-3">
          <label htmlFor="vehiclePlateNumber" className="form-label">Vehicle Plate Number <span className="text-danger">*</span></label>
          <input readOnly type="text" id="vehiclePlateNumber" 
            className={`form-control ${plateNumberError ? 'is-invalid' : ''}`} value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            onBlur={() => validatePlateNumber(plateNumber)} 
            maxLength="10" required />
          {plateNumberError && <div className="text-danger">{plateNumberError}</div>}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="emergencyContactNumber" className="form-label">Emergency Contact Number <span className="text-danger">*</span></label>
          <input type="text" id="emergencyContactNumber"
            className={`form-control ${emergencyNumberError ? 'is-invalid' : ''}`} value={emergencyNumber}
            onChange={handleEmergencyNumberChange}  maxLength="10" required />
          {emergencyNumberError && <div className="text-danger">{emergencyNumberError}</div>}
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
}

export default UpdateLoginDetail;
