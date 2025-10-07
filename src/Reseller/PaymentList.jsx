import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../config';

function PaymentList() {
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const guid = localStorage.getItem('guid'); 
      
      if (!guid) {
        console.error('GUID not found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${apiUrl}/payment_list`, {
          guid: guid // Use the dynamic guid from localStorage
        });

        if (response.data.status === 'success') {
          setPaymentData(response.data.payment_list);
        } else {
          console.error('Failed to fetch data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="loader">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">Payment Summary</h2>
      <div className="table-responsive mt-4">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Payment Date</th>
              <th>Amount</th>
              <th>Reference Number</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.paymentDate}</td>
                <td>{entry.amount}</td>
                <td>{entry.transaction_refrence_no}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentList;
