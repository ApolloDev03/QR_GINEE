import React from 'react';
import { NavLink } from 'react-router-dom';

function ThankuPostpaid() {
  // Retrieve data from local storage
  // const guid = localStorage.getItem('guid');
  // const UserLoginID = localStorage.getItem('UserLoginID');
  // const vehicleOwnerMasterDetailId = localStorage.getItem('vehicleOwnerMasterDetailId');

  const message = `Your details added successfully..!`;

  return (
    <div>
      <div className="text-center mt-5 mb-4">
        <img src="assests/image/Thanku.png" alt="Company Picture" className="company-pic" loading="lazy" />
        <p className='text-bold text-center' style={{ color: '#66666', fontSize: '18px' }}>{message}</p>
        <NavLink to="/userdetail">
          <button className="Login_btn">Home</button>
        </NavLink>
      </div>
    </div>
  );
}

export default ThankuPostpaid;
