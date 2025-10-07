import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify"; // Import Slide for transition
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "../config";

const NewOrder = () => {
  const [orders, setOrders] = useState([
    {
      payType: "",
      qty: 1,
      rate: 0,
      discountedRate: 0,
      carStickersQty: 0,
      carStickersAmount: 0,
      bikeStickersQty: 0,
      bikeStickersAmount: 0,
    },
  ]);
  const [responseData, setResponseData] = useState(null);
  const [guid, setGuid] = useState(null);
  const [discountRate, setDiscountRate] = useState(0); // Prepaid discount rate
  const [postpaidDiscountRate, setPostpaidDiscountRate] = useState(0); // Postpaid discount rate
  const [purchaseLimit, setPurchaseLimit] = useState(0); // State for purchase limit

  const navigate = useNavigate();

  const storedGuid = localStorage.getItem("guid");
  const storedDiscountRate =
    parseFloat(localStorage.getItem("discountRate")) || 0;
  const storedPostpaidDiscountRate =
    parseFloat(localStorage.getItem("postpaidDiscountRate")) || 0;
  const storedPurchaseLimit =
    parseInt(localStorage.getItem("purchaseLimit")) || 0;

  useEffect(() => {
    if (storedGuid) {
      setGuid(storedGuid);
    } else {
      console.error("GUID not found in localStorage.");
      console.error("purchase not found in localStorage.");
      navigate("/login");
    }

    setDiscountRate(storedDiscountRate);
    setPostpaidDiscountRate(storedPostpaidDiscountRate);
    setPurchaseLimit(storedPurchaseLimit); // Set purchase limit
    // Log purchase limit to the console

    console.log("Purchase Limit:", storedPurchaseLimit);
  }, [
    navigate,
    storedGuid,
    storedDiscountRate,
    storedPostpaidDiscountRate,
    storedPurchaseLimit,
  ]);

  useEffect(() => {
    if (guid) {
      fetchProductPrice();
    }
  }, [guid]);

  const fetchProductPrice = async (retries = 3, delay = 2000) => {
    if (!guid) return;

    const productId = 1; // Replace with actual productId if available
    const quantity = orders.reduce((sum, order) => sum + order.qty, 0);

    try {
      const response = await axios.post(`${apiUrl}/product_price`, {
        productId,
        guid,
        quantity,
      });

      if (
        response.data.status === "success" &&
        response.data.Product_Price.length > 0
      ) {
        const productDetails = response.data.Product_Price[0];
        const updatedOrders = orders.map((order) => ({
          ...order,
          rate: productDetails.price,
          discountedRate: applyDiscount(order.payType, productDetails.price),
        }));
        setOrders(updatedOrders);
      } else {
        console.error(
          "Failed to fetch product price. Response:",
          response.data
        );
      }
    } catch (error) {
      if (retries > 0 && error.response && error.response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        fetchProductPrice(retries - 1, delay * 2);
      } else {
        console.error("Failed after retries:", error);
      }
    }
  };

  const applyDiscount = (payType, price) => {
    if (payType === "postpaid") {
      return price - (price * postpaidDiscountRate) / 100;
    } else if (payType === "prepaid") {
      return price - (price * discountRate) / 100;
    }
    return price;
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newOrders = [...orders];
    newOrders[index][name] = value;

    // Check if the payType has changed to postpaid or prepaid
    if (name === "payType") {
      newOrders[index].discountedRate = applyDiscount(
        value,
        newOrders[index].rate
      );
    }

    if (
      name === "carStickersQty" ||
      name === "bikeStickersQty" ||
      name === "discountedRate"
    ) {
      const totalQtyPostpaid = orders.reduce(
        (total, order) =>
          order.payType === "postpaid"
            ? total +
              (parseInt(order.carStickersQty) || 0) +
              (parseInt(order.bikeStickersQty) || 0)
            : total,
        0
      );
      // Check if total postpaid quantity exceeds purchase limit
      if (
        newOrders[index].payType === "postpaid" &&
        totalQtyPostpaid > purchaseLimit
      ) {
        toast.error(
          `Purchase limit of ${purchaseLimit} exceeded for postpaid orders.`,
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
        // Reset the added quantity to the previous value if limit exceeded
        newOrders[index][name] = orders[index][name];
      } else {
        newOrders[index].carStickersAmount =
          newOrders[index].carStickersQty * newOrders[index].discountedRate;
        newOrders[index].bikeStickersAmount =
          newOrders[index].bikeStickersQty * newOrders[index].discountedRate;
      }
    }
    setOrders(newOrders);
  };

  const calculateTotalPrice = () => {
    return orders.reduce((total, order) => {
      return total + order.carStickersAmount + order.bikeStickersAmount;
    }, 0);
  };

  const calculateGST = () => {
    return calculateTotalPrice() * 0.18; // 18% GST
  };

  const calculateNetAmount = () => {
    return calculateTotalPrice() + calculateGST(); // Total + GST
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation: Check if any order has zero quantity
    const hasZeroQuantity = orders.some(
      (order) => order.carStickersQty <= 0 && order.bikeStickersQty <= 0
    );
    if (hasZeroQuantity) {
      toast.error(
        "Please add quantities for car or bike stickers before submitting.",
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

    // Purchase Limit Check for Postpaid Orders
    const totalQtyPostpaid = orders.reduce(
      (total, order) =>
        order.payType === "postpaid"
          ? total +
            (parseInt(order.carStickersQty) || 0) +
            (parseInt(order.bikeStickersQty) || 0)
          : total,
      0
    );
    if (totalQtyPostpaid > purchaseLimit) {
      toast.error(
        `Sorry you cannot order more than "${purchaseLimit}" Quantity for postpaid order`,
        {
          position: "top-center",
          autoClose: 5000,
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

    const postpaidOrders = orders.filter(
      (order) => order.payType === "postpaid"
    );
    const prepaidOrders = orders.filter((order) => order.payType === "prepaid");
    // Process postpaid orders

    if (postpaidOrders.length > 0 && guid) {
      const requestData = {
        guid: guid,
        payment_mode: "postpaid",
        discount_rate: discountRate,
        data: postpaidOrders
          .map((order) => [
            {
              productid: 1,
              quantity: order.carStickersQty,
              price: parseInt(order.discountedRate),
            },
            {
              productid: 2,
              quantity: order.bikeStickersQty,
              price: parseInt(order.discountedRate),
            },
          ])
          .flat(),
      };

      try {
        const response = await axios.post(
          `${apiUrl}/create_order_postpaid`,
          requestData
        );
        if (response.data.ErrorCode === "0") {
          setResponseData(response.data);
        } else {
          console.error("Error creating order:", response.data.Message);
        }
      } catch (error) {
        console.error("API request failed:", error);
      }
    }

    if (prepaidOrders.length > 0) {
      const requestData = {
        guid: guid,
        discount_rate: discountRate,
        data: prepaidOrders
          .map((order) => [
            {
              productid: 1,
              quantity: order.carStickersQty,
              price: order.discountedRate,
            },
            {
              productid: 2,
              quantity: order.bikeStickersQty,
              price: order.discountedRate,
            },
          ])
          .flat(),
      };

      try {
        const response = await axios.post(
          `${apiUrl}/create_order`,
          requestData
        );

        if (response.data.ErrorCode === "0") {
          const razorpayResponce = response.data.razorpayResponce.order_id;
          const razorpayOid = response.data.data.orderID;
          console.log(razorpayResponce, "order_id_razorpay");
          console.log(razorpayOid, "ORDER_ID");
          setResponseData(response.data);
          handlePayment(
            razorpayOid,
            response.data.data.amount,
            razorpayResponce
          );
        } else {
          console.error("Error creating order:", response.data.Message);
        }
      } catch (error) {
        console.error("API request failed:", error);
      }
    } else {
      console.error("No orders to submit.");
    }
  };

  const handlePayment = async (orderId, amount, razorpayOrderId) => {
    const totalAmount = calculateNetAmount(); // Use calculateTotalPrice to ensure consistency
    const paymentOptions = {
      key: "rzp_live_ZXIWFlbRMILH8q",
      amount: totalAmount * 100, // Convert to paise (smallest unit of INR)
      currency: "INR",
      name: "QR Genie",
      description: "Test Transaction",
      capture_mode: 1,
      order_id: razorpayOrderId, // Pass the Razorpay order ID
      handler: async (paymentResponse) => {
        try {
          const paymentStatusResponse = await axios.post(
            `${apiUrl}/reseller_payment_status`,
            {
              order_id: orderId,
              razorpay_id: paymentResponse.razorpay_payment_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              amount: totalAmount * 100,
              currency: "INR",
              status: "Success",
            }
          );
          if (paymentStatusResponse.data.ErrorCode === "0") {
            navigate("/thank-you-reseller", { state: { orderID: orderId } }); // Pass the orderId to ThankuCheckout
          } else {
            navigate("/failed");
          }
        } catch (error) {
          console.error("Payment Status API Error:", error);
          navigate("/failed");
        }
      },
      prefill: {
        contact: "", // Include mobile number if available
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
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="">
          {orders.map((order, index) => (
            <div key={index} className="row mb-3 order-gap">
              {/* Pay Type and Rate */}
              <div className="col-lg-4">
                <label className="fw-bold">Pay Type:</label>
                <select
                  name="payType"
                  className="form-control"
                  value={order.payType}
                  onChange={(event) => handleInputChange(index, event)}
                  required
                >
                  <option value="" disabled>
                    Select Pay Type
                  </option>
                  <option value="postpaid">Postpaid</option>
                  <option value="prepaid">Prepaid</option>
                </select>
              </div>
              <div className="col-lg-4">
                <label className="fw-bold">Rate:</label>
                <input
                  type="number"
                  name="rate"
                  className="form-control"
                  value={order.rate}
                  onChange={(event) => handleInputChange(index, event)}
                  min="0"
                  required
                  readOnly
                />
              </div>
              <div className="col-lg-4">
                <label className="fw-bold">Discounted Rate:</label>
                <input
                  type="number"
                  name="discountedRate"
                  className="form-control"
                  value={order.discountedRate}
                  readOnly
                />
              </div>

              {/* Car Stickers */}
              {/* <div className="row mt-3"> */}
              <div className="col-lg-4">
                <label className="fw-bold">Sr No 1:</label>
                <input
                  type="text"
                  name="product"
                  className="form-control"
                  value="Car Stickers"
                  readOnly
                />
              </div>
              <div className="col-lg-4">
                <label className="fw-bold">Qty:</label>
                <input
                  type="number"
                  name="carStickersQty"
                  className="form-control"
                  value={order.carStickersQty}
                  onChange={(event) => handleInputChange(index, event)}
                  min="0"
                  maxLength="999"
                />
              </div>
              <div className="col-lg-4">
                <label className="fw-bold">Amount:</label>
                <input
                  type="number"
                  name="carStickersAmount"
                  className="form-control"
                  value={order.carStickersAmount}
                  onChange={(event) => handleInputChange(index, event)}
                  min="0"
                  readOnly
                />
              </div>
              {/* </div> */}

              {/* Bike Stickers Row */}

              <div className="col-lg-4">
                <label className="fw-bold">Sr No 2:</label>
                <input
                  type="text"
                  name="product"
                  className="form-control"
                  value="Bike Stickers"
                  readOnly
                />
              </div>
              <div className="col-lg-4">
                <label className="fw-bold">Qty:</label>
                <input
                  type="number"
                  name="bikeStickersQty"
                  className="form-control"
                  value={order.bikeStickersQty}
                  onChange={(event) => handleInputChange(index, event)}
                  min="0"
                />
              </div>
              <div className="col-lg-4">
                <label className="fw-bold">Amount:</label>
                <input
                  type="number"
                  name="bikeStickersAmount"
                  className="form-control"
                  value={order.bikeStickersAmount}
                  onChange={(event) => handleInputChange(index, event)}
                  min="1"
                  readOnly
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total Price */}
        <div className="row mb-3 justify-content-end mar-3">
          <div className="col-lg-4">
            <label className="fw-bold">Total Amount:</label>
            <input
              type="number"
              name="totalPrice"
              className="form-control"
              value={calculateTotalPrice()}
              readOnly
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-end">
          <div className="col-lg-4">
            <label className="fw-bold" style={{ color: "blue" }}>
              GST (18%):
            </label>
            <input
              type="number"
              className="form-control"
              value={calculateGST()}
              readOnly
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-end">
          <div className="col-lg-4">
            <label className="fw-bold" style={{ color: "green" }}>
              Net Amount:
            </label>
            <input
              type="number"
              className="form-control"
              value={calculateNetAmount()}
              readOnly
            />
          </div>
        </div>
        <button type="submit" className="btn btn-block mb-3">
          Submit
        </button>
      </form>
      {responseData && (
        <div className="alert alert-success mt-4">
          Order created successfully! Order ID: {responseData.data.orderID}
        </div>
      )}
      <ToastContainer />{" "}
      {/* Add ToastContainer to render toast notifications */}
    </div>
  );
};

export default NewOrder;
