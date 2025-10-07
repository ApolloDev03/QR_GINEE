import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../config';

function MyAccount() {
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const guid = localStorage.getItem('guid'); // Retrieve the guid from localStorage
      
      if (!guid) {
        console.error('GUID not found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${apiUrl}/ledger_list`, {
          guid: guid, // Use the guid retrieved from localStorage
        });

        if (response.data.status === 'success') {
          setAccountData(response.data.ledger_list);
        } else {
          // Handle the case where status is not success
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
      <h2 className="text-center">Account Summary</h2>
      <div className="table-responsive mt-4">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Sr No</th>
              
              <th>Opening Balance</th>
              <th>Credit Balance</th>
              <th>Debit Balance</th>
              <th>Closing Balance</th>
              <th>Created date</th>
            </tr>
          </thead>
          <tbody>
            {accountData.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
              
                <td>{entry.opening_balance}</td>
                <td>{entry.creading_balance}</td>
                <td>{entry.debit_balance}</td>
                <td>{entry.closing_balance}</td>
                <td>{entry.created_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyAccount;
