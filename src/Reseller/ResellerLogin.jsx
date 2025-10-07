import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiUrl } from '../config';

const ResellerLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // For OTP
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState(''); // State for email validation error
    const [countdown, setCountdown] = useState(600); // Timer for 5-minute countdown
    const [isLoading, setIsLoading] = useState(false); // Loading state

    useEffect(() => {
        let timer;
        if (isOtpSent && countdown > 0) {
            timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
        } else if (countdown <= 0) {
            console.log('OTP expired, resetting state.');
            setError('OTP expired. Please request a new OTP.');
            setIsOtpSent(false); // Reset to the email input form
            setPassword(''); // Clear the OTP input
            setCountdown(600); // Reset countdown
        }
        return () => clearInterval(timer);
    }, [countdown, isOtpSent]);

    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        console.log('Email entered:', emailValue);

        // Basic email validation using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            setEmailError('Please enter a valid email address');
            console.log('Invalid email format');
        } else {
            setEmailError('');
            console.log('Valid email');
        }
    };

    const handleOtpChange = (e) => {
        const otpValue = e.target.value;
        console.log('OTP entered:', otpValue);

        if (otpValue.length <= 6) {
            setPassword(otpValue); // OTP is stored in password state
            setError(''); // Clear the error when input is valid
        } else {
            setError('OTP must be 6 digits long.');
            console.log('Invalid OTP length');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login initiated');
        
        if (emailError) {
            setError('Please correct the errors before submitting');
            console.log('Email validation error:', emailError);
            return;
        }

        const loginUrl = `${apiUrl}/resellerLogin`;

        try {
            setIsLoading(true); // Start loading
            console.log('Sending OTP request to:', loginUrl);
            const response = await axios.post(loginUrl, { email });
            console.log('OTP response:', response);

            if (response.data.Status === "Success") {
                setIsOtpSent(true);
                setCountdown(600); // Start 5-minute countdown
                setError('');
                toast.success('OTP sent successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    transition: Slide,
                });
                console.log('OTP sent successfully');
            } else {
                setError(response.data.Message || 'Failed to send OTP');
                console.log('OTP failed to send:', response.data.Message);
                toast.error(response.data.Message || 'Failed to send OTP', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    transition: Slide,
                });
            }
        } catch (error) {
            setError('Reseller with this email ID does not exist..!');
            console.error('Error during login:', error);
            toast.error('Reseller with this email ID does not exist..!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Slide,
            });
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        console.log('OTP verification initiated');

        if (error) {
            setError('Please correct the errors before submitting');
            console.log('Error:', error);
            return;
        }

        const verifyOtpUrl = `${apiUrl}/resellerVerifyOTP`;

        try {
            setIsLoading(true);
            console.log('Sending OTP verification request to:', verifyOtpUrl);
            const response = await axios.post(verifyOtpUrl, { email, password });
            console.log('OTP verification response:', response);

            if (response.data && response.data.Reseller && response.data.Reseller.guid) {
                const { guid, discount_rate, postpaid_discount_rate, no_of_QR } = response.data.Reseller;
                const authToken = response.data.authToken;
                localStorage.setItem('guid', guid);
                localStorage.setItem('discountRate', discount_rate);
                localStorage.setItem('postpaidDiscountRate', postpaid_discount_rate);
                localStorage.setItem('purchaseLimit', no_of_QR);
                localStorage.setItem('authToken', authToken);
                console.log('OTP verified successfully, navigating to /neworder');

                navigate('/neworder');
                toast.success('OTP verified successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    transition: Slide,
                });
            } else {
                setError('GUID is missing in the response.');
                console.error('GUID missing in response');
                toast.error('GUID is missing in the response.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    transition: Slide,
                });
            }
        } catch (error) {
            setError('Invalid OTP..! Please Enter Valid OTP..');
            console.error('OTP verification error:', error);
            toast.error('Invalid OTP..! Please Enter Valid OTP..', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Slide,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Convert countdown seconds to MM:SS format
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="text-center mt-5">
                {/* <h2 className="logo_heading">QR Genie</h2> */}
            </div>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="text-center mb-3">
                        <img src="assests/image/login_img.svg" alt="Company Picture" className="company-pic" loading="lazy" />
                    </div>
                </div>
                <div className="col-md-6">
                    <form className="verification-form mt-5" onSubmit={isOtpSent ? handleVerifyOtp : handleLogin}>
                        <h2 className="login_heading">{isOtpSent ? 'Verify OTP' : 'Reseller Login'}</h2>

                        {!isOtpSent && (
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email Address <span className="required-asterisk">*</span></label>
            <input type="email" className="form-control" id="email" value={email} onChange={handleEmailChange}
                placeholder="Enter email address" maxLength="50" required />
                                {emailError && <div className="text-danger">{emailError}</div>}
                            </div>
                        )}
                        {isOtpSent && (
                            <div className="form-group mb-3">
                                <label htmlFor="password">OTP <span className="required-asterisk">*</span></label>
            <input type="number" className="form-control" id="password" value={password} onChange={handleOtpChange}
            placeholder="Enter OTP" maxLength="6" required />
                                <small className="text-muted">OTP expires in {formatTime(countdown)}</small>
                            </div>
                        )}

<button type="submit" className="btn btn-block mt-3" disabled={isLoading}>
                            {isLoading ? (
                                <span>
                                    <span className="loading-dots">
                                        <span>.</span><span>.</span><span>.</span>
                                    </span>
                                    {isOtpSent ? 'Verifying OTP' : 'Sending OTP'}
                                </span>
                            ) : (
                                isOtpSent ? 'Verify OTP' : 'Send OTP'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResellerLogin;
