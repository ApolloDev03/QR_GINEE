import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { apiUrl } from "../config";

function Qrcode_process() {
  const { dynamicContent } = useParams();
  const navigate = useNavigate();
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);

  const fetchQrData = async (guid) => {
    try {
      setError(null);
      const response = await axios.post(`${apiUrl}/qrcodedetail`, { guid });
      const data = response.data;

      // Check for successful response
      if (data.ErrorCode === "0" && data.Status === "Success") {
        setQrData(data.data);

        // Store GUID in local storage
        localStorage.setItem("GUID", guid); //QR CODE GUID Store the GUID from the function parameter
        localStorage.setItem("SCANGUID", guid);
        console.log("QRGUID", guid);
        localStorage.setItem("productid", data.data.productid); // Store productid in local storage
        localStorage.setItem("strBloodGroup", data.data.strBloodGroup); // Store strBloodGroup in local storage
        localStorage.setItem(
          "vehiclePlateNumber",
          data.data.vehiclePlateNumber
        ); // Store vehiclePlateNumber in local storage

        const cartItems = [
          {
            id: data.data.id,
            name: data.data.QRCodeFor,
            price: data.data.rate,
            rate: data.data.rate,
            productid: data.data.productid,
            productname: data.data.productname,
          },
        ];

        // Navigation logic
        if (data.data.QRCodeFor === 1 || data.data.QRCodeFor === 2) {
          if (
            data.data.VehicleOwnerMasterId > 0 &&
            data.data.VehicleOwnerMasterDetailId > 0
          ) {
            navigate("/quickcontact", {
              state: {
                guid,
                VehicleOwnerMasterId: data.data.VehicleOwnerMasterId,
              },
            });
          } else {
            navigate("/register", {
              state: {
                guid,
                VehicleOwnerMasterId: data.data.VehicleOwnerMasterId,
              },
            });
          }
        } else if (data.data.QRCodeFor === 3) {
          if (data.data.isPaid === 1) {
            if (
              data.data.VehicleOwnerMasterId > 0 &&
              data.data.VehicleOwnerMasterDetailId > 0
            ) {
              navigate("/quickcontact", {
                state: {
                  guid,
                  VehicleOwnerMasterId: data.data.VehicleOwnerMasterId,
                },
              });
            } else {
              navigate("/register", {
                state: {
                  guid,
                  VehicleOwnerMasterId: data.data.VehicleOwnerMasterId,
                },
              });
            }
          } else {
            navigate("/postpaidcheckout", {
              state: {
                cart: cartItems,
                rate: data.data.rate,
                guid,
                VehicleOwnerMasterId: data.data.VehicleOwnerMasterId,
              },
            });
          }
        } else {
          navigate("/inactiveqr");
        }
      } else {
        navigate("/inactiveqr");
      }
    } catch (error) {
      setError("An error occurred while fetching the data.");
      console.error("Error fetching the data:", error);
    }
  };

  useEffect(() => {
    if (dynamicContent) {
      fetchQrData(dynamicContent);
    } else {
      setError("GUID is not provided.");
    }
  }, [dynamicContent]);

  return (
    <div className="text-center">
      {error && <p>{error}</p>}
      {qrData ? (
        <div>
          <p>QR Code ID: {qrData.id}</p>
          <p>QR Code Text: {qrData.QRCodeText}</p>
          <p>QR Code For: {qrData.QRCodeFor}</p>
          <p>Is Paid: {qrData.isPaid ? "Yes" : "No"}</p>
          <p>Activation Date: {qrData.ActivationDate || "N/A"}</p>
          <p>Expiry Date: {qrData.ExpiryDate || "N/A"}</p>
          <p>Rate: {qrData.rate}</p>
        </div>
      ) : (
        !error && (
          <div className="welcome-container">
            <h1>Please wait....!!</h1>
            <Player
              autoplay
              loop
              src="/assests/image/Qr_scan.json"
              className="welcome-animation"
            />
          </div>
        )
      )}
    </div>
  );
}

export default Qrcode_process;
