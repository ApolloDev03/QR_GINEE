import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // useNavigate for redirection
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import { apiUrl } from "../config";

function QuickContact() {
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState(null); // State to track selected message
  const [error, setError] = useState(null); // State to track any errors
  const [filteredMessages, setFilteredMessages] = useState([]); // State for filtered messages
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");

  const quickContactImg = "assests/image/quick_final.png";
  const logoImg = "assests/image/new_logo_qr.png";

  // Static content with unique IDs and icons
  const staticMessages = [
    // car sms
    {
      id: "6",
      text: "The lights of the car is on",
      icon: "assests/image/quick_icons/Emr1.svg",
      type: 1,
    },
    {
      id: "9",
      text: "The car is in no parking zone",
      icon: "assests/image/quick_icons/Emr2.svg",
      type: 1,
    },
    {
      id: "2",
      text: "The car is getting towed",
      icon: "assests/image/quick_icons/Emer3.png",
      type: 1,
    },
    {
      id: "10",
      text: "There is a baby or pet in the car",
      icon: "assests/image/quick_icons/Emer4.png",
      type: 1,
    },
    {
      id: "11",
      text: "Window of the car is open",
      icon: "assests/image/quick_icons/sticker1.svg",
      type: 1,
    },
    // bike sms
    {
      id: "5",
      text: "The bike is getting towed",
      icon: "assests/image/quick_icons/random_icon_3.svg",
      type: 2,
    },
    {
      id: "7",
      text: "The bike is in no parking zone",
      icon: "assests/image/quick_icons/random_icon_2.svg",
      type: 2,
    },
    {
      id: "8",
      text: "You forgot your keys in the bike",
      icon: "assests/image/quick_icons/key-chain.png",
      type: 2,
    },
    {
      id: "1",
      text: "The storage compartment of the bike is open",
      icon: "assests/image/quick_icons/box.png",
      type: 2,
    },
  ];

  // Effect to load initial values from localStorage and listen for dynamic updates
  useEffect(() => {
    const storedVehiclePlateNumber = localStorage.getItem("vehiclePlateNumber");
    const storedProductId = localStorage.getItem("productid"); // Fetch productid from local storage
    const storedBloodGroup = localStorage.getItem("strBloodGroup");

    if (storedVehiclePlateNumber)
      setVehiclePlateNumber(storedVehiclePlateNumber);
    if (storedBloodGroup) setBloodGroup(storedBloodGroup);

    // Filter messages based on productid
    if (storedProductId) {
      const filtered = staticMessages.filter(
        (message) => message.type === parseInt(storedProductId)
      );
      setFilteredMessages(filtered);
    }

    const handleStorageChange = () => {
      const updatedBloodGroup = localStorage.getItem("strBloodGroup");
      const updatedVehiclePlateNumber =
        localStorage.getItem("vehiclePlateNumber");
      const updatedProductId = localStorage.getItem("productid");

      if (updatedBloodGroup) setBloodGroup(updatedBloodGroup);
      if (updatedVehiclePlateNumber)
        setVehiclePlateNumber(updatedVehiclePlateNumber);
      if (updatedProductId) {
        const filtered = staticMessages.filter(
          (message) => message.type === parseInt(updatedProductId)
        );
        setFilteredMessages(filtered);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Function to handle sending the message
  const handleSendMessage = async () => {
    const guid = localStorage.getItem("GUID");
    if (!guid || !selectedMessageId) {
      toast.error("Please select a message first.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const url = `${apiUrl}/sms/template`;
    const params = {
      GUID: guid,
      id: selectedMessageId,
    };

    try {
      const response = await axios.post(url, params);
      if (
        response.data.ErrorCode === "0" &&
        response.data.Status === "Success"
      ) {
        toast.success("Message sent successfully!", {
          position: "top-center",
          autoClose: 2000, // Close after 2 seconds
          onClose: () => navigate("/thank-you-final"),
        });
      } else {
        toast.error("Failed to send message: " + response.data.Message, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An error occurred while sending the message.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  // Function to handle showing the popup
  const handleCallButtonClick = () => {
    setShowPopup(true);
  };

  // Function to handle closing the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Function to handle dialing the number
  const handleDialNow = async () => {
    const guid = localStorage.getItem("GUID");
    if (!guid || !phoneNumber) {
      toast.error("Please enter a valid phone number.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const url = `${apiUrl}/make-call`;
    const params = {
      GUID: guid,
      from: phoneNumber,
    };

    try {
      const response = await axios.post(url, params);
      if (
        response.data.ErrorCode === "0" &&
        response.data.Status === "Success"
      ) {
        toast.success("Call initiated successfully!", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/"),
        });
      } else {
        toast.success("Call initiated successfully!", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/"),
        });
      }
    } catch (error) {
      console.error("Error making the call:", error);
      toast.error(
        "Call cannot be made as the recipient's number is blocked by TRAI NDNC regulations.",
        {
          position: "top-center",
          autoClose: 4000,
        }
      );
    } finally {
      closePopup();
    }
  };
  // emergency contact number api
  // Function to handle showing the popup
  const handleCallButtonClickEmergency = () => {
    setShowPopup(true);
  };

  // Function to handle closing the popup
  const closePopupEmegency = () => {
    setShowPopup(false);
  };

  // Function to handle dialing the number
  const handleDialNowEmergency = async () => {
    const guid = localStorage.getItem("GUID");
    if (!guid || !phoneNumber) {
      toast.error("Please enter a valid phone number.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const url = `{apiUrl}/emergency-call`;
    const params = {
      GUID: guid,
      from: phoneNumber,
    };

    try {
      const response = await axios.post(url, params);
      if (
        response.data.ErrorCode === "0" &&
        response.data.Status === "Success"
      ) {
        toast.success("Call initiated successfully!", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/"),
        });
      } else {
        toast.success("Call initiated successfully!", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/"),
        });
      }
    } catch (error) {
      console.error("Error making the call:", error);
      toast.error(
        "Call cannot be made as the recipient's number is blocked by TRAI NDNC regulations.",
        {
          position: "top-center",
          autoClose: 4000,
        }
      );
    } finally {
      closePopupEmegency();
    }
  };
  return (
    <>
      <ToastContainer />
      <header className="header-container d-flex justify-content-between align-items-center mb-2">
        <img
          src={logoImg}
          alt="Logo"
          className="logo-img mobile-logo"
          style={{ height: "60px", paddingLeft: "17px", width: "175px" }}
        />
        <img src={quickContactImg} alt="Quick Contact" className="quick-img" />
      </header>
      <div
        className="container mt-4 p-3"
        style={{ paddingLeft: "0", paddingRight: "0" }}
      >
        <div className="box-1 mb-4 border rounded shadow">
          <h5
            className="bg-dark text-white p-3 mb-3 fs-20"
            style={{ borderRadius: "5px 5px 0px 0px" }}
          >
            Contact Vehicle Owner
          </h5>
          <div className="d-flex justify-content-between">
            <div
              className="d-flex flex-column"
              style={{ padding: "0px 10px 20px 10px" }}
            >
              <label htmlFor="vehicle-plate" className="fs-13">
                Vehicle License Plate Number:{" "}
                <span className="text-danger">*</span>
              </label>
              <span
                className="fs-16"
                style={{ fontSize: "20px", color: "#EF4F5F" }}
              >
                {vehiclePlateNumber || "N/A"}
              </span>
            </div>
            <div
              className="d-flex flex-column"
              style={{ padding: "0px 10px 20px 10px" }}
            >
              <label htmlFor="blood-group" className="fs-13">
                Blood Group: <span className="text-danger">*</span>
              </label>
              <div className="d-flex align-items-center justify-content-center">
                <img
                  src="assests/image/Layer 2.svg"
                  alt="Blood Picture"
                  className="sm-pic"
                  style={{ width: "30px", height: "30px", marginRight: "10px" }}
                />
                <span style={{ fontSize: "20px", color: "#EF4F5F" }}>
                  {bloodGroup || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="box-2 mb-4 p-3 border rounded shadow"
          style={{ borderRadius: "15px" }}
        >
          <h6 className="mb-3">
            Please select a message to contact owner of the vehicle
          </h6>
          <div className="d-flex flex-column">
            {filteredMessages.map((message) => (
              <div className="d-flex align-items-center mb-2" key={message.id}>
                <img
                  src={message.icon}
                  alt="Icon"
                  style={{
                    color: "black !important",
                    marginRight: "10px",
                    width: "30px",
                  }}
                />
               
                <div
                  className={`flex-grow-1 message-text ${
                    selectedMessageId === message.id ? "selected" : ""
                  }`}
                  style={{
                    fontWeight: 500,
                    color: selectedMessageId === message.id ? "#000" : "#000",
                  }}
                >
                  {message.text}
                </div>
                <input
                  className="form-check-input custom-radio"
                  type="radio"
                  name="option"
                  id={`option_${message.id}`}
                  onChange={() => setSelectedMessageId(message.id)}
                />
                <label htmlFor={`option_${message.id}`}></label>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn_emergency d-flex align-items-center"
              style={{
                width: "9em",
                color: "#292929",
                border: "2px solid #292929",
                marginLeft: "0px",
              }}
              onClick={handleSendMessage}
            >
              <i className="fas fa-envelope me-2"></i>
              Message
            </button>
            <button
              className="btn_emergency d-flex align-items-center"
              style={{
                width: "9em",
                color: "#292929",
                border: "2px solid #292929",
                marginRight: "0px",
              }}
              onClick={handleCallButtonClick}
            >
              <i className="fas fa-phone me-2"></i>
              Call
            </button>
          </div>
          {error && <p className="text-danger">{error}</p>}{" "}
        </div>

        <div className="text-center mb-4">
          <div
            className="bg-dark text-white"
            style={{
              borderRadius: "32px",
              maxWidth: "30em",
              margin: "0 auto",
              border: "2px solid #ddd",
              padding: "3px",
            }}
          >
            <div className="d-flex align-items-center">
              <div
                className="bg-white lock_icon"
                style={{
                  borderRadius: "50%",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src="/assests/image/call-lock-icon.svg"
                  alt="privacy icon"
                />
              </div>
              <h5
                className="ms-3 mb-0 fs-13"
                style={{ fontSize: "16px", textAlign: "center" }}
              >
                The privacy of all callers will be protected
              </h5>
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <button
            className="btn_emergency"
            onClick={handleCallButtonClickEmergency}
          >
            <img
              src="/assests/image/emergency_img.png"
              alt="Emergency Icon"
              className="me-2"
              style={{ width: "24px", height: "24px" }}
            />
            Emergency Contact Number
          </button>
        </div>

        <div className="text-center mb-4">
          <h5>
            {" "}
            Require QR Genie?{" "}
            <NavLink
              to="/productdetail"
              style={{
                color: "#EF4F5F",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Buy Now
            </NavLink>
          </h5>
        </div>
      </div>

      {/* Popup for the call confirmation */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePopup}>
              &times;
            </button>

            <div className="message-box">
              <p className="popup-message">
                To set up a <span className="txt-main">MASKED</span> call
                between <br /> you and the tag owner, we will need <br /> your
                phone number.
              </p>
            </div>
            <input
              type="text"
              maxLength="10"
              placeholder="Please enter your phone number"
              className="phone-input"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setPhoneNumber(value);
                }
              }}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ced4da",
                margin: "10px 0",
              }}
            />
            <button onClick={handleDialNow} className="new-btn-d">
              <i class="fas fa-phone"></i> Call
            </button>
            <p className="pv-txt">
              *The privacy of all callers will be protected.
            </p>
          </div>
        </div>
      )}

      {/* Emergency Contact Number*/}

      {showPopup && (
        <div className="popup-overlay" onClick={closePopupEmegency}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePopupEmegency}>
              &times;
            </button>

            <div className="message-box">
              <p className="popup-message">
                To set up a <span className="txt-main">MASKED</span> call
                between <br /> you and the tag owner, we will need <br /> your
                phone number.
              </p>
            </div>
            <input
              type="text"
              maxLength="10"
              placeholder="Please enter your phone number"
              className="phone-input"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setPhoneNumber(value);
                }
              }}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ced4da",
                margin: "10px 0",
              }}
            />
            <button onClick={handleDialNow} className="new-btn-d">
              <i class="fas fa-phone"></i> Call
            </button>
            <p className="pv-txt">
              You should receive a call from our system which will connect to
              the vehicle owner.
            </p>
            <p className="pv-txt">
              *The privacy of all callers will be protected.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default QuickContact;
