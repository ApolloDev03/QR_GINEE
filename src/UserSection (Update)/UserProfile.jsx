import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "../config";

function UserProfile() {
  const navigate = useNavigate();
  const UserLoginID = localStorage.getItem("UserLoginID");
  // const guid = localStorage.getItem('guid');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    VehicleOwnerMasterId: "",
    UserLoginID: UserLoginID || "",
    VehicleOwnerName: "",
    VehicleOwnerDOB: "",
    VehicleOwnerAddress: "",
    VehicleOwnerCity: "",
    VehicleOwnerState: "",
    VehicleOwnerPincode: "",
    VehicleOwnerEmail: "",
    VehicleOwnerMobile: "",
    VehicleOwnerBloodGroup: "",
  });
  const [stateList, setStateList] = useState([]); // State for dropdown list
  const [error, setError] = useState("");

  // Fetch profile data from the API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.post(`${apiUrl}/vehicle_owner/profile`, {
          UserLoginID,
        });
        if (response.data && response.data.ErrorCode === "0") {
          const data = response.data;
          setProfileData({
            VehicleOwnerMasterId: data.VehicleOwnerMasterId || "",
            UserLoginID: data.UserLoginID || "",
            VehicleOwnerName: data.VehicleOwnerName || "",
            VehicleOwnerDOB: data.VehicleOwnerDOB || "",
            VehicleOwnerAddress: data.VehicleOwnerAddress || "",
            VehicleOwnerCity: data.VehicleOwnerCity || "",
            VehicleOwnerState: data.VehicleOwnerState || "",
            VehicleOwnerPincode: data.VehicleOwnerPincode || "",
            VehicleOwnerEmail: data.VehicleOwnerEmail || "",
            VehicleOwnerMobile: data.VehicleOwnerMobile || "",
            VehicleOwnerBloodGroup: data.VehicleOwnerBloodGroup || "",
          });
        } else {
          setError("Failed to fetch profile data.");
        }
      } catch (error) {
        setError("There was an error fetching the profile data.");
        console.error("Fetching error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [UserLoginID, navigate]);

  // Fetch state list from API
  useEffect(() => {
    const fetchStateList = async () => {
      try {
        const response = await axios.post(`${apiUrl}/state_list`);
        if (response.data && response.data.status === "success") {
          setStateList(response.data.state); // Set state list
        } else {
          setError("Failed to fetch state list.");
        }
      } catch (error) {
        console.error("Error fetching state list:", error);
        setError("There was an error fetching the state list.");
      }
    };

    fetchStateList();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validate DOB format to ensure the year is 4 digits
  const handleDobChange = (e) => {
    const { value } = e.target;
    const year = value.split("-")[0]; // Extract the year
    if (year.length === 4) {
      setProfileData((prevState) => ({
        ...prevState,
        VehicleOwnerDOB: value,
      }));
    } else {
      toast.error("Please enter a valid year with 4 digits.");
    }
  };

  // Handle form submission

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSubmitting(true);
  //   try {
  //     const response = await axios.post(`${apiUrl}/vehicle_owner/update_profile`, profileData);
  //     if (response.data && response.data.ErrorCode === '0') {
  //       toast.success('Profile updated successfully!');
  //       localStorage.setItem('UserLoginID', profileData.UserLoginID);
  //       localStorage.setItem('VehicleOwnerMasterId', profileData.VehicleOwnerMasterId);
  //       setTimeout(() => {
  //         navigate('/userdetail');
  //       }, 2000);
  //     } else {
  //       toast.error('There was an error submitting the form.');
  //     }
  //   } catch (error) {
  //     toast.error('There was an error submitting the form.');
  //     console.error('Submission error:', error);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate DOB
    const currentDate = new Date();
    const enteredDate = new Date(profileData.VehicleOwnerDOB);
    const age = currentDate.getFullYear() - enteredDate.getFullYear();
    const isBirthdayPassed =
      currentDate.getMonth() > enteredDate.getMonth() ||
      (currentDate.getMonth() === enteredDate.getMonth() &&
        currentDate.getDate() >= enteredDate.getDate());

    if (age < 18 || (age === 18 && !isBirthdayPassed)) {
      toast.error("You must be at least 18 years old to register.");
      window.scrollTo(0, 0); // Scroll to top if DOB is invalid
      setSubmitting(false);
      return; // Prevent submission if validation fails
    }

    try {
      const response = await axios.post(
        `${apiUrl}/vehicle_owner/update_profile`,
        profileData
      );
      if (response.data && response.data.ErrorCode === "0") {
        toast.success("Profile updated successfully!");
        localStorage.setItem("UserLoginID", profileData.UserLoginID);
        localStorage.setItem(
          "VehicleOwnerMasterId",
          profileData.VehicleOwnerMasterId
        );
        setTimeout(() => {
          navigate("/userdetail");
        }, 2000);
      } else {
        toast.error("There was an error submitting the form.");
      }
    } catch (error) {
      toast.error("There was an error submitting the form.");
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    );
  }

  return (
    <>
      <div>
        <ToastContainer />
        <div className="untree_co-section mt-5 mb-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 mb-5 mb-lg-0">
                <div className="text-center">
                  <h2 className="h3 mb-3 text-black"> User Profile</h2>
                  <img
                    src="assests/image/profile_detail_logo.svg"
                    alt="Profile"
                    className="img-fluid mb-4 text-center"
                    loading="lazy"
                  />
                </div>

                {error && <p className="text-danger">{error}</p>}
                <form id="billingForm" onSubmit={handleSubmit}>
                  <div className="p-3 p-lg-5 bg-white">
                    {/* Name */}
                    <div className="form-group row">
                      <div className="col-md-6 mt-4">
                        <label
                          htmlFor="VehicleOwnerName"
                          className="text-black"
                        >
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="VehicleOwnerName"
                          name="VehicleOwnerName"
                          maxLength="50"
                          value={profileData.VehicleOwnerName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Date of Birth */}
                      <div className="col-md-3 mt-4">
                        <label htmlFor="VehicleOwnerDOB" className="text-black">
                          Date of Birth <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="VehicleOwnerDOB"
                          name="VehicleOwnerDOB"
                          value={profileData.VehicleOwnerDOB}
                          onChange={handleDobChange}
                          required
                        />
                      </div>

                      {/* Blood Group */}
                      <div className="col-md-3 mt-4">
                        <label
                          htmlFor="VehicleOwnerBloodGroup"
                          className="text-black"
                        >
                          Blood Group <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="VehicleOwnerBloodGroup"
                          name="VehicleOwnerBloodGroup"
                          value={profileData.VehicleOwnerBloodGroup}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Blood Group</option>
                          <option value="Don't Know">Don't Know</option>
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
                    {/* Email and Mobile (Read-Only) */}
                    <div className="form-group row">
                      <div className="col-md-6 mt-4">
                        <label
                          htmlFor="VehicleOwnerEmail"
                          className="text-black"
                        >
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="VehicleOwnerEmail"
                          name="VehicleOwnerEmail"
                          maxLength="50"
                          value={profileData.VehicleOwnerEmail}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6 mt-4">
                        <label
                          htmlFor="VehicleOwnerMobile"
                          className="text-black"
                        >
                          Mobile <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          id="VehicleOwnerMobile"
                          maxLength="10"
                          name="VehicleOwnerMobile"
                          value={profileData.VehicleOwnerMobile}
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="form-group row">
                      <div className="col-md-12 mt-4">
                        <label
                          htmlFor="VehicleOwnerAddress"
                          className="text-black"
                        >
                          Address <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control"
                          id="VehicleOwnerAddress"
                          name="VehicleOwnerAddress"
                          value={profileData.VehicleOwnerAddress}
                          onChange={handleChange}
                          rows="3"
                          required
                        />
                      </div>
                    </div>

                    {/* City and State */}
                    <div className="form-group row">
                      <div className="col-md-4 mt-4">
                        <label
                          htmlFor="VehicleOwnerCity"
                          className="text-black"
                        >
                          City <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="VehicleOwnerCity"
                          name="VehicleOwnerCity"
                          maxLength="30"
                          value={profileData.VehicleOwnerCity}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-4 mt-4">
                        <label
                          htmlFor="VehicleOwnerState"
                          className="text-black"
                        >
                          State <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          id="VehicleOwnerState"
                          name="VehicleOwnerState"
                          value={profileData.VehicleOwnerState}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select State</option>
                          {stateList.map((state) => (
                            <option key={state.id} value={state.state_name}>
                              {state.state_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-4 mt-4">
                        <label
                          htmlFor="VehicleOwnerPincode"
                          className="text-black"
                        >
                          Pincode <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="VehicleOwnerPincode"
                          name="VehicleOwnerPincode"
                          value={profileData.VehicleOwnerPincode}
                          onChange={(e) => {
                            if (e.target.value.length <= 6) {
                              handleChange(e); // Only allow up to 6 digits
                            }
                          }}
                          required
                        />
                      </div>
                    </div>
                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg py-3 btn-block"
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
