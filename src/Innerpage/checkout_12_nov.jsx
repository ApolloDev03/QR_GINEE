import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const cartFromState = location.state?.cart || [];
  const totalPrice = location.state?.totalPrice || 0;

  const [cart, setCart] = useState(cartFromState);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stateList, setStateList] = useState([]); // State for dropdown list
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    pincode: "",
    state: "",
    city: "",
    discount: 0,
    data: cart.map((item) => ({
      productid: item.name.toLowerCase().includes("car") ? 1 : 2,
      quantity: item.quantity,
      price: item.price,
    })),
  });
  const [errors, setErrors] = useState({});
  const [cartSubtotal, setCartSubtotal] = useState(
    cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      return total + price * quantity;
    }, 0)
  );
  const [totalAmount, setTotalAmount] = useState(cartSubtotal - discount);
  // Fetch states from API
  useEffect(() => {
    const fetchStateList = async () => {
      try {
        const response = await axios.post(
          "https://apolloinfotech.in/QR_Genie/api/state_list"
        );
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

  useEffect(() => {
    const updatedSubtotal = cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      return total + price * quantity;
    }, 0);

    setCartSubtotal(updatedSubtotal);
    setTotalAmount(updatedSubtotal - discount);
    setFormData((prevFormData) => ({
      ...prevFormData,
      data: cart.map((item) => ({
        productid: item.name.toLowerCase().includes("car") ? 1 : 2,
        quantity: item.quantity,
        price: item.price,
      })),
    }));
  }, [cart, discount]);

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name.trim()) formErrors.name = "Name is required";
    if (!formData.email.trim()) formErrors.email = "Email is required";
    if (!formData.mobile.trim())
      formErrors.mobile = "Mobile number is required";
    if (!formData.address.trim()) formErrors.address = "Address is required";
    if (!formData.city.trim()) formErrors.city = "City is required";
    if (!formData.pincode.trim() || formData.pincode.length !== 6)
      formErrors.pincode = "Pincode must be exactly 6 digits";
    if (!formData.state.trim()) formErrors.state = "State is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const applyPromoCode = async () => {
    setLoading(true);

    // Check if cart is empty or all items have a quantity of zero
    const isCartEmpty = cart.every((item) => item.quantity <= 0);
    if (isCartEmpty) {
      toast.error(
        "Please add at least one item to the cart before applying a promo code.",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Slide,
        }
      );
      setLoading(false);
      return; // Prevent promo code application
    }

    try {
      const response = await axios.post(
        "https://apolloinfotech.in/QR_Genie/api/promocode",
        {
          totalAmount: cartSubtotal,
          coupon: promoCode,
        }
      );
      const { Status, amount, Message } = response.data;
      if (Status === "Success") {
        setDiscount(amount);
        setPromoApplied(true);
        setFormData((prevFormData) => ({
          ...prevFormData,
          discount: amount,
        }));
        toast.success(`Promo Code Applied: ${promoCode}`, {
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
        toast.error("Failed to apply promo code.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Slide,
        });
        setPromoApplied(false);
      }
    } catch (error) {
      console.error("Promo Code API Error:", error);
      toast.error("An error occurred while applying the promo code.", {
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
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isCartEmpty = cart.every((item) => item.quantity <= 0);
    if (isCartEmpty) {
      toast.error(
        "Please add at least one item to the cart before placing an order.",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Slide,
        }
      );
      return;
    }

    if (!validateForm()) {
      console.log("Validation failed");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        "https://apolloinfotech.in/QR_Genie/api/checkout",
        formData
      );
      const data = response.data;

      if (data.Status === "Success") {
        const paymentOptions = {
          key: "rzp_test_2RwPgdzjFdXB0m",
          amount: Math.round(totalAmount * 100),
          currency: "INR",
          name: "QR Genie",
          description: "Test Transaction",

          handler: async (paymentResponse) => {
            console.log("Payment response received:", paymentResponse);

            // Extract necessary details from the paymentResponse object
            const razorpayPaymentId =
              paymentResponse.razorpay_payment_id || null;
            const razorpayOrderId = paymentResponse.razorpay_order_id || null;
            const razorpaySignature =
              paymentResponse.razorpay_signature || null;
            const status = razorpayPaymentId ? "Success" : "Failed";
            const failureReason =
              paymentResponse.error_description || "Unknown";

            try {
              setLoading(true);

              // Log payment status to backend
              const logPaymentStatus = async () => {
                try {
                  const response = await axios.post(
                    "https://apolloinfotech.in/QR_Genie/api/paymentstatus",
                    {
                      razorpay_id: razorpayPaymentId,
                      order_id: data.data.orderID,
                      razorpay_order_id: razorpayOrderId,
                      razorpay_signature: razorpaySignature,
                      amount: Math.round(totalAmount * 100),
                      currency: "INR",
                      status: status,
                      failure_reason:
                        status === "Failed" ? failureReason : null,
                    }
                  );
                  console.log(
                    "Payment status logged successfully:",
                    response.data
                  );
                } catch (error) {
                  console.error("Failed to log payment status:", error);
                }
              };

              await logPaymentStatus();

              if (status === "Success") {
                // Clear form data on success
                setFormData({
                  name: "",
                  mobile: "",
                  email: "",
                  address: "",
                  pincode: "",
                  state: "",
                  city: "",
                  data: [],
                });

                setTimeout(() => {
                  navigate("/thank-you-checkout", {
                    state: { orderID: data.data.orderID },
                  });
                }, 2000);
              } else {
                setTimeout(() => {
                  navigate("/failed");
                }, 2000);
              }
            } catch (error) {
              console.error("Payment Status API Error:", error);
            } finally {
              setLoading(false);
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
            ondismiss: async () => {
              console.log("Payment dismissed by user");

              // Log the dismissed payment attempt as failed
              try {
                await axios.post(
                  "https://apolloinfotech.in/QR_Genie/api/paymentstatus",
                  {
                    razorpay_id: null,
                    order_id: data.data.orderID,
                    amount: Math.round(totalAmount * 100),
                    currency: "INR",
                    status: "Failed",
                    failure_reason: "Payment dismissed by user",
                  }
                );
                console.log("Dismissed payment logged as failed");
              } catch (error) {
                console.error(
                  "Failed to log dismissed payment as failed:",
                  error
                );
              }

              navigate("/payment_failed");
            },
          },
        };

        const rzp = new window.Razorpay(paymentOptions);
        rzp.open(); // Open Razorpay payment window
      } else {
        toast.error("Checkout failed.", {
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
      console.error("Checkout API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (index, increment) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const item = updatedCart[index];
      const newQuantity = Math.max(0, item.quantity + increment);
      updatedCart[index] = { ...item, quantity: newQuantity };
      const updatedSubtotal = updatedCart.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity, 10) || 0;
        return total + price * quantity;
      }, 0);
      setCartSubtotal(updatedSubtotal);
      setTotalAmount(updatedSubtotal - discount);
      return updatedCart;
    });
  };

  const renderIcon = (productName) => {
    if (productName.toLowerCase().includes("car")) {
      return <i className="fas fa-car" style={{ marginRight: "8px" }}></i>;
    }
    if (productName.toLowerCase().includes("bike")) {
      return <i className="fas fa-bicycle" style={{ marginRight: "8px" }}></i>;
    }
    return null;
  };

  return (
    <div className="checkout-container">
      <ToastContainer />
      <div className="untree_co-section mt-5">
        <div className="container">
          <div className="breadcrumb__links" style={{ marginBottom: "40px" }}>
            <NavLink to="/">Home</NavLink>
            <span className="breadcrumb-separator"> &gt;&gt;&gt; </span>
            <NavLink to="/productdetail">Product</NavLink>
            <span className="breadcrumb-separator"> &gt;&gt;&gt; </span>
            <NavLink to="/checkout">Checkout</NavLink>
          </div>
        </div>
        <div className="container">
          <div className="row sm-flex-dcol">
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
                  {/* Form fields */}
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
                      {errors.name && (
                        <small className="text-danger">{errors.name}</small>
                      )}
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
                        <small className="text-danger">{errors.email}</small>
                      )}
                    </div>
                    <div className="col-md-6 mb-2">
                      <label htmlFor="mobile" className="text-black">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
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
                        <small className="text-danger">{errors.mobile}</small>
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
                      {errors.address && (
                        <small className="text-danger">{errors.address}</small>
                      )}
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
                      {errors.city && (
                        <small className="text-danger">{errors.city}</small>
                      )}
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
                    <div className="col-md-6 mb-2">
                      <label htmlFor="pincode" className="text-black">
                        Pincode <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="pincode"
                        placeholder="Pincode"
                        value={formData.pincode}
                        maxLength="6"
                        pattern="\d{6}"
                        onChange={(e) => {
                          if (e.target.value.length <= 6) {
                            handleChange(e); // Only allow up to 6 digits
                          }
                        }}
                        required
                      />
                      {errors.pincode && (
                        <small className="text-danger">{errors.pincode}</small>
                      )}
                    </div>
                  </div>
                  <button type="submit" className="btn btn-lg py-3 btn-block">
                    Place Order
                  </button>
                </form>
              </div>
            </div>
            <div className="col-md-6 mb-5">
              <h2
                className="h3 mb-3 text-black"
                style={{
                  borderBottom: "2px solid #ECECEC",
                  paddingBottom: "1rem",
                }}
              >
                Order Details
              </h2>
              <div className="border" style={{ padding: "1rem 2rem" }}>
                {" "}
                {/* Add padding here */}
                <h5 style={{ margin: "1rem 0" }}>Vehicle Stickers</h5>
                <table
                  className="table mb-5 bg-white"
                  style={{ borderTop: "2px solid #ECECEC", margin: "0" }}
                >
                  <tbody>
                    {cart.map((item, index) => (
                      <tr key={index}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <h5
                            style={{
                              color: "#666666",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {renderIcon(item.name)} {item.name}
                          </h5>
                          <div>
                            <div
                              className="quantity"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <button
                                  className="value-button decrease-button minus"
                                  onClick={() =>
                                    handleQuantityChange(index, -1)
                                  }
                                  disabled={item.quantity <= 0}
                                  title="Decrease"
                                >
                                  -
                                </button>
                                <span
                                  className="number"
                                  style={{ width: "50px", textAlign: "center" }}
                                >
                                  {item.quantity}
                                </span>
                                <button
                                  className="value-button increase-button minus"
                                  onClick={() => handleQuantityChange(index, 1)}
                                  title="Increase"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {item.strikedPrice && (
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "#999999",
                                    fontWeight: "500",
                                    marginRight: "8px",
                                  }}
                                >
                                  {(item.strikedPrice * item.quantity).toFixed(
                                    2
                                  )}{" "}
                                  {/* Total striked price */}
                                </span>
                              )}
                              <div
                                style={{ color: "#EF4F5F", fontWeight: "500" }}
                              >
                                ₹{(item.price * item.quantity).toFixed(2)}{" "}
                                {/* Total current price */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </tr>
                    ))}
                  </tbody>
                  {/* Border below the cart items */}
                  <div
                    style={{
                      borderBottom: "2px solid #ECECEC",
                      marginTop: "10px",
                    }}
                  ></div>

                  <div className="subtotal-section">
                    <div className="d-flex justify-content-between">
                      <span style={{ color: "#333333", fontWeight: "600" }}>
                        Sub Total
                      </span>
                      <strong>₹ {cartSubtotal}</strong>
                    </div>

                    <div className="promo-section mt-3">
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Have a promo code?"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={promoApplied}
                          style={{ paddingRight: "60px" }}
                        />
                        {!promoApplied && (
                          <span
                            onClick={applyPromoCode}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#EF4F5F",
                              cursor: "pointer",
                              fontWeight: "600",
                              paddingRight: "20px",
                            }}
                          >
                            Apply
                          </span>
                        )}
                        {promoApplied && (
                          <span
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#EF4F5F",
                              fontWeight: "600",
                              paddingRight: "20px",
                            }}
                          >
                            Applied
                          </span>
                        )}
                      </div>
                    </div>

                    {promoApplied && (
                      <div className="promo-discount mt-3">
                        <span>
                          Promo Code Discount -{" "}
                          <span
                            style={{
                              color: "white",
                              backgroundColor: "#EF4F5F",
                              fontWeight: "600",
                              padding: "3px",
                              borderRadius: "5px",
                            }}
                          >
                            {promoCode}
                          </span>
                        </span>
                        <span className="float-end">
                          ₹<strong>{discount.toFixed(2)}</strong>
                        </span>
                      </div>
                    )}

                    {/* Tax Section */}
                    <div className="tax-section mt-3">
                      <div className="d-flex justify-content-between">
                        <span style={{ color: "#333333", fontWeight: "600" }}>
                          Tax
                        </span>
                        <strong>₹0.00</strong>
                      </div>
                    </div>

                    {/* Border below tax section */}
                    <div
                      style={{
                        borderBottom: "2px solid #ECECEC",
                        marginTop: "10px",
                      }}
                    ></div>

                    <div className="d-flex justify-content-between mt-3">
                      <strong>Total</strong>
                      <strong>₹{totalAmount.toFixed(2)}</strong>
                    </div>
                  </div>
                </table>
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

export default Checkout;
