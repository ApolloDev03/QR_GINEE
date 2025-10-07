import React from 'react';

const Payment = ({ formData, amount }) => {
  const openRazorpay = async () => {
    const options = {
      key: 'rzp_test_ke8KVUSjDb7vmt',
      amount: amount,
      currency: 'INR',  
      name: 'QR Genie',
      description: 'Payment for Order',
      image: 'https://your-logo-url.com/logo.png', // Replace with your actual logo URL
      handler: function(response) {
        alert(`Payment ID: ${response.razorpay_payment_id}`);
        // Handle success callback (e.g., update order status on backend)
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.mobile
      },
      notes: {
        address: formData.address,
      },
      theme: {
        color: '#F37254'
      }
    };

    // if (window.Razorpay) {
    //   const razorpayInstance = new window.Razorpay(options);
    //   razorpayInstance.open();
    // } else {
    //   console.error('Razorpay SDK not loaded.');
    //   // Optionally, you could retry loading the SDK or notify the user
    // }
  };

  return (
    <div>
      <button className='payment_btn' onClick={openRazorpay}>Place order</button>
    </div>
  );
};

export default Payment;
