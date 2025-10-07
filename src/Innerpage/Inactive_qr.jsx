import React from 'react';

function Inactive_qr() {
    const message = `This QR Code is inactive..!`;
    
    return (
        <div>
    <div className="text-center mt-5 mb-4">
    <img src="assests/image/payment_failed.svg" alt="Payment Failed - QR Code Inactive" className="company-pic" />
                <h2 className="dark-message mt-3" style={{ color: '#4E4E4E' }}>
                    {message}
                </h2>
            </div>
        </div>
    );
}

export default Inactive_qr;
