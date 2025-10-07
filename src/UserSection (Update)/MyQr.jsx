import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiUrl } from '../config';

function MyQr() {
  const navigate = useNavigate();
  const location = useLocation();
  const [qrList, setQrList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve UserLoginID from navigation state or localStorage
  const UserLoginID = localStorage.getItem('UserLoginID');
  const VehicleOwnerMasterDetailId = location.state?.VehicleOwnerMasterDetailId; 


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Log UserLoginID to debug
        console.log('UserLoginID:', UserLoginID);

        const response = await axios.post(`${apiUrl}/vehicle_owner/getQRCode`, {
          UserLoginID,
        });
        if (response.data.ErrorCode === "0") {
          setQrList(response.data.QRList);
        } else {
          console.error(response.data.Message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (UserLoginID) {
      fetchData();
    } else {
      console.error('UserLoginID is missing.');
      setLoading(false);
    }
  }, [UserLoginID, navigate]);

  const handleEdit = (item) => {
    // Ensure that UserLoginID is available and navigate to the intended route
    if (UserLoginID) {
      navigate('/updatelogindetail', { state: { ...item } });
    } else {
      console.error('UserLoginID is missing. Cannot navigate to edit page.');
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
      <div className="container mt-5">
        <h2 className='text-center'>Vehicle Information</h2>
        <div className="table-container mt-5">
          <table className="table table-striped table-bordered table-hover">
            <thead className="thead-dark text-center">
              <tr style={{color:'#ef4f5f'}}>
                <th>No.</th>
                <th>Vehicle Plate Number</th>
                <th>Emergency Number</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {qrList.map((item, index) => (

                <tr key={item.VehicleOwnerMasterDetailId} className='text-center'>
                  <td>{index + 1}</td>
                  <td>{item.vehiclePlateNumber}</td>
                  <td>{item.emergencyContactNumber}</td>
                  <td className="icon-center">
                    <button onClick={() => handleEdit(item)} className="btn btn-primary cm-btn" >
                      <i className="fas fa-edit" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
   

  </>
  );
}

export default MyQr;
