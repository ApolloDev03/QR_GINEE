import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function ProfileDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { strEmail, strPhone } = location.state || {};

  const [strName, setStrName] = useState('');
  const [strDOB, setStrDOB] = useState('');
  const [strAddress, setStrAddress] = useState('');
  const [strCity, setStrCity] = useState('');
  const [strState, setStrState] = useState('');
  const [states, setStates] = useState([]); // State to hold the fetched states list
  const [strPincode, setStrPincode] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [plateNumberError, setPlateNumberError] = useState('');
  const [emergencyNumberError, setEmergencyNumberError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // New state for checkbox
  const [checkboxError, setCheckboxError] = useState(''); // Error state for checkbox

  const guid = localStorage.getItem('GUID');
  const VehicleOwnerMasterId = localStorage.getItem('VehicleOwnerMasterId');

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.post('https://apolloinfotech.in/QR_Genie/api/state_list');
        if (response.data.status === 'success') {
          setStates(response.data.state); // Populate the states dropdown
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();
  }, []);

  const validatePlateNumber = (vehiclePlateNumber) => {
    const regex = /^[A-Za-z0-9]{4,10}$/;
    if (!regex.test(vehiclePlateNumber)) {
      setPlateNumberError('Vehicle plate number should be alphanumeric and between 4 and 10 characters long.');
      return false;
    }
    setPlateNumberError('');
    return true;
  };

  const validateEmergencyContactNumber = (emergencyContactNumber) => {
    const regex = /^[0-9]{10}$/;
    if (!regex.test(emergencyContactNumber)) {
      setEmergencyNumberError('Emergency contact number should be exactly 10 digits long and contain only numbers.');
      return false;
    }
    setEmergencyNumberError('');
    return true;
  };

  const validateForm = () => {
    let isValid = true;
    if (!validatePlateNumber(vehiclePlateNumber)) {
      isValid = false;
    }

    if (!validateEmergencyContactNumber(emergencyContactNumber)) {
      isValid = false;
    }
    if (!isChecked) {
      setCheckboxError('You must agree to the Terms of Use and Privacy Policy.'); // Set checkbox error message
      isValid = false;
    }else {
      setCheckboxError(''); // Reset checkbox error if checked
    }

    return isValid // Ensure checkbox is checked before submission
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset the error state before submission
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
    const data = {
      strName,
      strPhone,
      strEmail,
      strDOB,
      strAddress,
      strCity,
      strState,
      strPincode,
      emergencyContactNumber,
      vehiclePlateNumber,
      bloodGroup,
      guid,
      VehicleOwnerMasterId,
    };
  
    try {
      const response = await axios.post('https://apolloinfotech.in/QR_Genie/api/registerwithvehicledetail', data);
      console.log("API Response:", response.data); // Log the full response for debugging
      if (response.status === 200) {
        const { UserLoginID, vehicleOwnerMasterDetailId } = response.data;
        localStorage.setItem('UserLoginID', UserLoginID);
        console.log("profiledetail UserLoginID", UserLoginID); //console
        localStorage.setItem('vehicleOwnerMasterDetailId', vehicleOwnerMasterDetailId);
        
        // Store blood group and vehicle number
        localStorage.setItem('strBloodGroup', bloodGroup);
        localStorage.setItem('vehiclePlateNumber', vehiclePlateNumber);
        navigate('/thank-you-postpaid');
      } else {
        setError('There was an error submitting the form.'); // You might want to refine this message
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError('There was an error submitting the form.'); // Provide more context if possible
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <div className="untree_co-section mt-5 mb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mb-5 mb-lg-0">
              <div className='text-center'>
                <h2 className="h3 mb-3 text-black">Profile Details</h2>
                <img src="assests/image/profile_detail_logo.svg" alt="Image Description" className="img-fluid mb-4 text-center" loading="lazy" />
                {/* Display GUID below the QR Image */}
                <h5 className="text-center" style={{ color: '#4E4E4E' }}>
                  ID: {guid}
                </h5>
              </div>

              <form id="billingForm" onSubmit={handleSubmit}>
                <div className="p-3 p-lg-5 bg-white">
                  <div className="form-group row mt-4">
                  <div className="col-md-6 mt-4">
                      <label htmlFor="strName" className="text-black">Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" id="strName" name="strName" maxLength="50"
                        value={strName} onChange={(e) => setStrName(e.target.value)} required />
                    </div>
                    <div className="col-md-3 mt-4">
                      <label htmlFor="strDOB" className="text-black">Date of Birth <span className="text-danger">*</span></label>
                      <input type="date" className="form-control" id="strDOB" name="strDOB"
                        value={strDOB} onChange={(e) => setStrDOB(e.target.value)} required />
                    </div>
                    <div className="col-md-3 mt-4">
                      <label htmlFor="bloodGroup" className="text-black">Blood Group <span className="text-danger">*</span></label>
                      <select className="form-control blood_group_select" id="bloodGroup" name="bloodGroup" value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)} >
                        <option value="">Select Blood Group</option>
                        <option value="Don't know">Don't Know</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    </div>
                    <div className="form-group row mt-4">
                    <div className="col-md-12">
                      <label htmlFor="strAddress" className="text-black">Address <span className="text-danger">*</span></label>
                      <textarea type="text" className="form-control" id="strAddress" name="strAddress"
                        value={strAddress} onChange={(e) => setStrAddress(e.target.value)} required />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-4 mt-4">
                      <label htmlFor="strCity" className="text-black">City <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" id="strCity" name="strCity" maxLength="30"
                        value={strCity} onChange={(e) => setStrCity(e.target.value)} required />
                    </div>
                    <div className="col-md-4 mt-4">
                      <label htmlFor="strState" className="text-black">State <span className="text-danger">*</span></label>
                      <select className="form-control" id="strState" name="strState" value={strState}
                        onChange={(e) => setStrState(e.target.value)} required>
                        <option value="">Select State</option>
                        {states.map(state => (
                          <option key={state.id} value={state.state_name}>{state.state_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mt-4">
                      <label htmlFor="strPincode" className="text-black">Pincode <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" id="strPincode" name="strPincode"
                        value={strPincode} onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6); // Allow only numbers and limit to 6 digits
                    setStrPincode(value); }}
                      maxLength="6" required />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-6 mt-4">
                      <label htmlFor="strEmail" className="text-black">Email Address <span className="text-danger">*</span></label>
                      <input type="email" className="form-control" id="strEmail" name="strEmail"
                        value={strEmail} readOnly />
                    </div>
                    <div className="col-md-6 mt-4">
                      <label htmlFor="strPhone" className="text-black">Phone Number <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" id="strPhone" name="strPhone"
                        value={strPhone} readOnly />
                    </div>
                  </div>
                  <h2 className="h5 text-black mt-4" style={{ borderBottom: '2px solid #ECECEC', paddingBottom: '1rem' }}>Vehicle Information</h2>

                  <div className="form-group row">
                    <div className="col-md-6 mt-2">
                      <label htmlFor="vehiclePlateNumber" className="text-black">Vehicle Plate Number <span className="text-danger">*</span></label>
              <input type="text" className="form-control" id="vehiclePlateNumber" name="vehiclePlateNumber"
              value={vehiclePlateNumber} onChange={(e) => setVehiclePlateNumber(e.target.value)} required />
                      {plateNumberError && <p className="text-danger">{plateNumberError}</p>}
                    </div>
                    <div className="col-md-6 mt-4">
                      <label htmlFor="emergencyContactNumber" className="text-black">Emergency Contact Number <span className="text-danger">*</span></label>
          <input type="text" className="form-control" id="emergencyContactNumber" name="emergencyContactNumber"
          value={emergencyContactNumber} onChange={(e) => setEmergencyContactNumber(e.target.value)} maxLength="10"
                        required />
                      {emergencyNumberError && <p className="text-danger">{emergencyNumberError}</p>}
                    </div>
                  </div>

                    <input type="checkbox" id="termsCheckbox" checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)} />
                    <label htmlFor="termsCheckbox" className="text-black ms-2">
                      I agree to the Terms of Use and Privacy Policy
                    </label>
                    {checkboxError && <p className="text-danger">{checkboxError}</p>} 

                  <div className="form-group mt-4">
                    <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading || !isChecked}>
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                  </div>
                  {error && <p className="text-danger">{error}</p>}
                  </form>
                </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}


export default ProfileDetail;
