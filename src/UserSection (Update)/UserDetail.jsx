import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../config';

function UserDetail() {
  const [vehicleList, setVehicleList] = useState([]);
  const [personalInfo, setPersonalInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const UserLoginID = localStorage.getItem('UserLoginID');
  const VehicleOwnerMasterId = localStorage.getItem('VehicleOwnerMasterId');

  useEffect(() => {
    if (!UserLoginID || UserLoginID.length === 0) {
    console.log("Inside if UserLoginID", UserLoginID);
    navigate('/userlogin');
  }
  }, [UserLoginID, navigate]);

  useEffect(() => {
    const fetchVehicleInfo = async () => {
      try {
        const response = await axios.post(`${apiUrl}/vehicle_owner/getQRCode`, { UserLoginID });
        if (response.data.ErrorCode === "0" && response.data.Status === "Success") {
          setVehicleList(response.data.QRList);
          localStorage.setItem('vehicleList', JSON.stringify(response.data.QRList));
        } else {
          console.error('Failed to fetch vehicle info:', response.data.Message);
        }
      } catch (error) {
        console.error('API call failed:', error);
      }
    };

    const fetchPersonalInfo = async () => {
      try {
        const response = await axios.post(`${apiUrl}/vehicle_owner/profile`, { UserLoginID });
        if (response.data.ErrorCode === "0" && response.data.Status === "Success") {
          setPersonalInfo(response.data);
          localStorage.setItem('personalInfo', JSON.stringify(response.data));
        } else {
          console.error('Failed to fetch personal info:', response.data.Message);
        }
      } catch (error) {
        console.error('API call for personal info failed:', error);
      } finally {
        setLoading(false);
      }
    };

    if (UserLoginID) {
      fetchVehicleInfo();
      fetchPersonalInfo();
    } else {
      setLoading(false);
    }
  }, [UserLoginID]);

  // useEffect(() => {
  //   if (vehicleList.length === 0 && !loading) {
  //     navigate('/warning');
  //   }
  // }, [vehicleList, loading, navigate]);

  const handleEditVehicleClick = () => {
    navigate('/myqr');
  };

  const handleEditPersonalClick = () => {
    navigate('/userprofile');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="loader">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ paddingLeft: '0', paddingRight: '0' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 style={{ color: '#3F4756', padding: '10px 20px 0px 30px' }}>Vehicle's Information</h5>
        <i className="fas fa-pencil-alt mr-3" style={{ cursor: 'pointer', color: '#3F4756', marginRight: '20px' }} onClick={handleEditVehicleClick}></i>
      </div>
      {vehicleList.map((vehicle, index) => (
        <div key={vehicle.VehicleOwnerMasterDetailId} className="box-1 mb-4 border rounded shadow">
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column" style={{ padding: '20px 20px 20px 30px' }}>
              <label htmlFor={`vehicle-plate-${index}`}>Vehicle License Plate Number:</label>
              <span style={{ fontSize: '18px', color: '#EF4F5F', fontWeight: '500' }}>{vehicle.vehiclePlateNumber || 'N/A'}</span>

              <label htmlFor={`emergency-contact-${index}`} className="mt-3">Emergency Contact Number:</label>
              <span style={{ fontSize: '18px', color: '#EF4F5F', fontWeight: '500' }}>{vehicle.emergencyContactNumber || 'N/A'}</span>
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 style={{ color: '#3F4756', padding: '10px 20px 0px 30px' }}>Personal Information</h5>
        <i className="fas fa-pencil-alt mr-3" style={{ cursor: 'pointer', color: '#3F4756', marginRight: '20px' }} onClick={handleEditPersonalClick}></i>
      </div>
      <div className="box-1 mb-4 border rounded shadow">
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column" style={{ padding: '20px 20px 20px 30px' }}>
            <label htmlFor="name">Name:</label>
            <span style={{ fontSize: '18px', color: '#303030', fontWeight: '500' }}>{personalInfo.VehicleOwnerName || 'N/A'}</span>

            <label htmlFor="dob" className="mt-3">DOB:</label>
            <span style={{ fontSize: '18px', color: '#303030', fontWeight: '500' }}>{formatDate(personalInfo.VehicleOwnerDOB)}</span>

            <label htmlFor="bloodGroup" className="mt-3">Blood Group:</label>
            <span style={{ fontSize: '18px', color: '#303030', fontWeight: '500' }}>{personalInfo.VehicleOwnerBloodGroup || 'N/A'}</span>

            <label htmlFor="email" className="mt-3">Email:</label>
            <span style={{ fontSize: '18px', color: '#303030', fontWeight: '500' }}>{personalInfo.VehicleOwnerEmail || 'N/A'}</span>

            <label htmlFor="phoneNumber" className="mt-3">Phone Number:</label>
            <span style={{ fontSize: '18px', color: '#303030', fontWeight: '500' }}>{personalInfo.VehicleOwnerMobile || 'N/A'}</span>

            <label htmlFor="address" className="mt-3">Address:</label>
            <span style={{ fontSize: '18px', color: '#303030', fontWeight: '500' }}>{personalInfo.VehicleOwnerAddress || 'N/A'}</span>

            <label htmlFor="city" className="mt-3">City:</label>
            <span style={{ fontSize: '18px', color: '#303030', fontWeight: '500' }}>{personalInfo.VehicleOwnerCity || 'N/A'}</span>

            <label htmlFor="state" className="mt-3">State:</label>
            <span style={{ fontSize: '18px', color: '#303030', fontWeight: '500' }}>{personalInfo.VehicleOwnerState || 'N/A'}</span>

            <label htmlFor="pincode" className="mt-3">Pincode:</label>
            <span style={{ fontSize: '18px', color: '#303030', fontWeight: '500' }}>{personalInfo.VehicleOwnerPincode || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
