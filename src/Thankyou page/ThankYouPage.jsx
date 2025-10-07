import React from "react";
import { useLocation, NavLink } from "react-router-dom";

function ThankYouPage() {
  const location = useLocation();
  const message =
    location.state?.message ||
    "Your inquiry is sent successfully, we'll get in touch soon.";
  return (
    <div>
      {/* <h2 className="logo_heading">QR Genie</h2> */}
      <div className="text-center mt-5 mb-4">
        <img
          src="assests/image/Thankufinal.svg"
          alt="Company Picture"
          className="company-pic"
          loading="lazy"
        />
        <p className="text-center">{message}</p>
        <NavLink to="/">
          <button className="Login_btn">Home</button>
        </NavLink>
      </div>
    </div>
  );
}

export default ThankYouPage;

// jay

// import React, { useState } from 'react';
// import axios from 'axios';
// import { twilio } from 'twilio';

// const MyPage = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [message, setMessage] = useState('');
//   const [status, setStatus] = useState('');

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     const accountSid = 'your_account_SID'; // Replace with your Twilio Account SID
//     const authToken = 'your_auth_token';  // Replace with your Twilio Auth Token

//     try {
//       const client = twilio(accountSid, authToken);
//       const response = await client.messages.create({
//         body: message,
//         from: 'your_twilio_phone_number', // Replace with your Twilio phone number
//         to: phoneNumber
//       });

//       if (response.sid) {
//         setStatus('Message sent successfully!');
//       } else {
//         setStatus('Failed to send message.');
//       }
//     } catch (error) {
//       setStatus('Error sending message: ' + error.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Send SMS using Twilio</h1>
//       <form onSubmit={sendMessage}>
//         <div>
//           <label>Phone Number:</label>
//           <input
//             type="text"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Message:</label>
//           <textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Send Message</button>
//       </form>
//       {status && <p>{status}</p>}
//     </div>
//   );
// };

// export default MyPage;

// ****** New R&D*****
// import React, { useState } from 'react';
// import axios from 'axios';

// const MyPage = () => {
//   const [status, setStatus] = useState('');

//   const makeCall = async (e) => {
//     e.preventDefault();
//     const accountSid = 'AC66ba8b28ffa36c33c2d6b081dee4f2ca'; // Your Twilio Account SID
//     const authToken = '95b4dc8f093b3d8ef1f092dabe648290'; // Your Twilio Auth Token
//     const twilioNumber = '+13254407443'; // Your Twilio phone number
//     const toPhoneNumber = '+919427534693'; // Phone number you want to call

//     try {
//       const response = await axios.post(
//         `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`,
//         new URLSearchParams({
//           To: toPhoneNumber,
//           From: twilioNumber,
//           Url: 'http://demo.twilio.com/docs/voice.xml'
//         }),
//         {
//           headers: {
//             'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
//             'Content-Type': 'application/x-www-form-urlencoded'
//           }
//         }
//       );

//       if (response.status === 201) {
//         setStatus('Call initiated successfully! Call SID: ' + response.data.sid);
//       } else {
//         setStatus('Failed to initiate call.');
//       }
//     } catch (error) {
//       setStatus('Error: ' + error.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Make a Call using Twilio</h1>
//       <form onSubmit={makeCall}>
//         <button type="submit">Make Call</button>
//       </form>
//       {status && <p>{status}</p>}
//     </div>
//   );
// };

// export default MyPage;
