import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../config';


function MyQrcode() {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchQrCodes = async () => {
      const guid = localStorage.getItem('guid'); // Retrieve guid from localStorage
      console.log('GUID:', guid);

      if (!guid) {
        setError('GUID is missing. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${apiUrl}/myQR`, { guid });
        console.log('API Response:', response.data);

        if (response.data.status === 'success') {
          setQrCodes(response.data.myQR);
        } else {
          setError('Failed to fetch QR codes.');
        }
      } catch (err) {
        console.error('Error fetching QR codes:', err);
        setError('An error occurred while fetching QR codes.');
      } finally {
        setLoading(false);
      }
    };

    fetchQrCodes();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = qrCodes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(qrCodes.length / itemsPerPage);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loader">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">My QR Codes</h2>
      <div className="table-responsive mt-4">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Qr_id</th>
              <th>GUID</th>
              <th>Product Name</th>
              <th>Status</th>
              <th>Customer Name</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((qrCode) => (
                <tr key={qrCode.GUID}>
                  <td>{qrCode.qr_id}</td>
                  <td>{qrCode.GUID}</td>
                  <td>{qrCode.product_name}</td>
                  <td>{qrCode.Status}</td>
                  <td>{qrCode.customer_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No QR codes available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="demo mt-4">
        <nav className="pagination-outer" aria-label="Page navigation">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <a href="#" className="page-link" aria-label="Previous" onClick={(e) => { e.preventDefault(); paginate(currentPage - 1); }}>
                <span aria-hidden="true">«</span>
              </a>
            </li>
            {[...Array(totalPages).keys()].map((num) => (
              <li key={num} className={`page-item ${currentPage === num + 1 ? 'active' : ''}`}>
                <a href="#" className="page-link" onClick={(e) => { e.preventDefault(); paginate(num + 1); }}>
                  {num + 1}
                </a>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <a href="#" className="page-link" aria-label="Next" onClick={(e) => { e.preventDefault(); paginate(currentPage + 1); }}>
                <span aria-hidden="true">»</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default MyQrcode;
