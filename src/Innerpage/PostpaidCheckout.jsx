import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../config";

function PostpaidCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];
  const rate = parseFloat(location.state?.rate) || 0;
  const [stateList, setStateList] = useState([]); // State for dropdown list
  const [error, setError] = useState("");
  const guid = location.state?.guid || "";
  const VehicleOwnerMasterId = location.state?.VehicleOwnerMasterId || "";

  // Loader state
  const [loading, setLoading] = useState(false);

  // Calculate subtotal
  const cartSubtotal = cart.reduce(
    (total, item) => total + parseFloat(item.price),
    0
  );
  const cartSubtotalInPaise = Math.round(cartSubtotal * 100);
  // Fetch states from API
  useEffect(() => {
    const fetchStateList = async () => {
      try {
        const response = await axios.post(`${apiUrl}/state_list`);
        if (response.data && response.data.status === "success") {
          setStateList(response.data.state); // Set state list
        } else {
          setError("Failed to fetch state list.");
        }
      } catch (error) {
        console.error("Error fetching state list:", error);
        setError("There was an error fetching the state list.");
      }
    };

    fetchStateList();
  }, []);

  // Initialize form data and error states
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    pincode: "",
    state: "",
    city: "",
    guid,
    VehicleOwnerMasterId,
    data: cart.map((item) => ({
      productid: item.productid, // Get productid from cart item
      productname: item.productname, // Get productname from cart item
      quantity: item.quantity || 1,
      price: item.price,
    })),
  });

  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (mobile) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(mobile);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = !validateEmail(formData.email)
      ? "Invalid email address"
      : "";
    const mobileError = !validatePhoneNumber(formData.mobile)
      ? "Phone number must be 10 digits"
      : "";

    setErrors({
      email: emailError,
      mobile: mobileError,
    });

    if (emailError || mobileError) {
      // Prevent submission if there are validation errors
      return;
    }

    try {
      console.log("Sending data:", formData);

      const response = await axios.post(
        `${apiUrl}/checkout/postpaid`,
        formData
      );
      console.log("API Response:", response.data);
      const data = response.data;

      if (data.Status === "Success") {
        const paymentOptions = {
          key: "rzp_test_ke8KVUSjDb7vmt",
          amount: cartSubtotalInPaise,
          currency: "INR",
          name: "QR Genie",
          description: "Test Transaction",
          image: "https://your-logo-url.com/logo.png",
          handler: async (paymentResponse) => {
            try {
              console.log("Payment Response:", paymentResponse);

              setLoading(true); // Start loader

              const paymentStatusResponse = await axios.post(
                `${apiUrl}/paymentstatus/postpaid`,
                {
                  razorpay_id: paymentResponse.razorpay_payment_id,
                  order_id: data.data.orderID,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_order_id: "order_OSqe0DVJGJCVzb",
                  razorpay_signature:
                    "256bbfb75cd2f60932e47e828721b73078f73c387286fb5d810ddfab13bdfebf",
                  amount: cartSubtotalInPaise,
                  currency: "INR",
                  status: "completed",
                }
              );
              console.log(
                "Payment Status Response:",
                paymentStatusResponse.data
              );

              if (paymentStatusResponse.data.Status === "Success") {
                // alert('Order placed and payment verified successfully!');
                setFormData({
                  name: "",
                  mobile: "",
                  email: "",
                  address: "",
                  pincode: "",
                  state: "",
                  city: "",
                  guid: "",
                  VehicleOwnerMasterId: "",
                  data: [],
                });

                navigate("/register", {
                  state: { guid, VehicleOwnerMasterId },
                });
              } else {
                // alert('Payment verification failed. Please try again.');
              }
            } catch (error) {
              console.error("Payment Status API Error:", error);
              // alert('Failed to verify payment status. Please try again.');
            } finally {
              setLoading(false); // Stop loader after processing
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.mobile,
          },
          notes: {
            address: formData.address,
          },
          theme: {
            color: "#F37254",
          },
          modal: {
            ondismiss: function () {
              navigate("/payment_failed");
            },
          },
        };

        const rzp = new window.Razorpay(paymentOptions);
        rzp.open();
      } else {
        // alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error("Checkout API Error:", error);
      // alert('Failed to place order. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear error messages when the user starts typing
    if (e.target.name === "email") {
      setErrors({ ...errors, email: "" });
    } else if (e.target.name === "mobile") {
      setErrors({ ...errors, mobile: "" });
    }
  };

  return (
    <div>
      <div className="untree_co-section mt-5 mb-3">
        <div className="container">
          <div
            className="breadcrumb__links"
            style={{ marginLeft: "0.5rem", marginBottom: "20px" }}
          >
            <NavLink href="/">Home</NavLink>
            <span className="breadcrumb-separator"> &gt;&gt;&gt; </span>
            <NavLink to="/productdetail">Product</NavLink>
            <span className="breadcrumb-separator"> &gt;&gt;&gt; </span>
            <NavLink to="/postpaidcheckout">Checkout</NavLink>
          </div>
          <div className="row">
            <div className="col-md-6 mb-5 mb-md-0">
              <h2
                className="h3 mb-3 text-black"
                style={{
                  borderBottom: "2px solid #ECECEC",
                  paddingBottom: "1rem",
                }}
              >
                Shipping Details
              </h2>
              <div className="p3 bg-white">
                <form onSubmit={handleSubmit}>
                  <div className="form-group row">
                    <div className="col-md-12 mb-2">
                      <label htmlFor="name" className="text-black">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        name="name"
                        maxLength="50"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-6 mb-2">
                      <label htmlFor="email" className="text-black">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        maxLength="50"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {errors.email && (
                        <div className="text-danger">{errors.email}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-2">
                      <label htmlFor="mobile" className="text-black">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="mobile"
                        placeholder="Phone"
                        value={formData.mobile}
                        onChange={handleChange}
                        maxLength="10"
                        pattern="\d{10}"
                        inputMode="numeric"
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                        required
                      />
                      {errors.mobile && (
                        <div className="text-danger">{errors.mobile}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-12 mb-2">
                      <label htmlFor="address" className="text-black">
                        Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        placeholder="Address"
                        maxLength="200"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-6 mb-2">
                      <label htmlFor="city" className="text-black">
                        City <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="City"
                        name="city"
                        maxLength="30"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <label htmlFor="state" className="text-black">
                        State <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select State</option>
                        {stateList.map((state) => (
                          <option key={state.id} value={state.state_name}>
                            {state.state_name}
                          </option> // Assuming state has 'id' and 'name'
                        ))}
                      </select>
                      {errors.state && (
                        <small className="text-danger">{errors.state}</small>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-6">
                      <label htmlFor="pincode" className="text-black">
                        Pincode <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="pincode"
                        maxLength="6"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={(e) => {
                          if (e.target.value.length <= 6) {
                            handleChange(e); // Only allow up to 6 digits
                          }
                        }}
                        required
                      />
                    </div>
                  </div>
                  {/* Hidden inputs for GUID and VehicleOwnerMasterId */}
                  <input type="hidden" name="guid" value={formData.guid} />
                  <input
                    type="hidden"
                    name="VehicleOwnerMasterId"
                    value={formData.VehicleOwnerMasterId}
                  />

                  {/* Hidden inputs for each product item */}
                  {formData.data.map((item, index) => (
                    <div key={index}>
                      <input
                        type="hidden"
                        name={`data[${index}][productid]`}
                        value={item.productid}
                      />
                      <input
                        type="hidden"
                        name={`data[${index}][quantity]`}
                        value={item.quantity}
                      />
                      <input
                        type="hidden"
                        name={`data[${index}][price]`}
                        value={item.price}
                      />
                      <input
                        type="hidden"
                        name={`data[${index}][productname]`}
                        value={item.productname}
                      />
                    </div>
                  ))}
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg py-3 btn-block"
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row mb-5">
                <div className="col-md-12">
                  <h2
                    className="h3 mb-3 text-black"
                    style={{
                      borderBottom: "1px solid #ECECEC",
                      paddingBottom: "1rem",
                    }}
                  >
                    Order Details
                  </h2>

                  <div className="p-3 p-lg-5 border bg-white">
                    <table className="table site-block-order-table mb-5">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item, index) => (
                          <tr key={index}>
                            <td className="text-black font-weight-bold">
                              <strong>{item.productname} </strong>{" "}
                              {item.quantity}
                            </td>
                            <td>₹{item.price}/-</td>
                          </tr>
                        ))}
                        <tr>
                          <td className="text-black font-weight-bold">
                            <strong>Order Subtotal</strong>
                          </td>
                          <td colSpan="3" className="text-black">
                            ₹{cartSubtotal}/-
                          </td>
                        </tr>
                        <tr>
                          <td className="text-black font-weight-bold">
                            <strong>Order Total</strong>
                          </td>
                          <td
                            colSpan="3"
                            className="text-black font-weight-bold"
                          >
                            <strong>₹{cartSubtotal}/-</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="loader-overlay">
          <div className="loader dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostpaidCheckout;
