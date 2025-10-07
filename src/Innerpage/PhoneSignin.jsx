import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { auth } from '../firebase/firebase'; 

function PhoneSignin() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState(null);

  const sendOtp = async () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth,'recaptcha', {});
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
      setUser(confirmation);
      console.log(confirmation);
    } catch (err) {
      console.log(err);
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await user.confirm(otp);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };


  return (

    
    <div className='phone_main'>
    <h2></h2>
      <div className='phone-content'>
        <PhoneInput
          country={"us"}
          value={phone}
          onChange={phone => setPhone("+" + phone)}
        />
        <button type="button" className="btn btn-outline-primary mt-2" onClick={sendOtp}>Send OTP</button>
        <div id="recaptcha"style={{marginTop:'5px'}} ></div>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="form-control mt-2"
        />
        
        <button type="button" className="btn btn-outline-success mt-2" onClick={verifyOtp}>Verify OTP</button>
      </div>
    </div>
  );
}

export default PhoneSignin;
