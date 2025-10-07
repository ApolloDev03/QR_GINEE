import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { apiUrl } from "../config";

function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const guid = localStorage.getItem("guid");
      if (!guid) {
        setError("GUID is missing. Please log in again.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post(`${apiUrl}/order_list`, { guid });

        if (response.data.status === "success") {
          setOrders(response.data.order_list);
        } else {
          setError("Sorry..!! There is no orders..");
        }
      } catch (err) {
        setError("There is no order yet. Please Place your order..!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleModeChange = (event, orderId) => {
    console.log(`Order ID ${orderId} mode changed to ${event.target.value}`);
  };

  const handleViewClick = async (order) => {
    const guid = localStorage.getItem("guid");
    if (!guid) {
      setError("GUID is missing.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/order_details`, {
        guid,
        order_id: order.order_id, // Using order.order_id here
      });

      if (response.data.status === "success") {
        // Extracting the first item from the "Order details" array
        const orderDetails = response.data["Order details"][0];
        console.log(orderDetails);
        setSelectedOrder(orderDetails);
        setShowModal(true);
      } else {
        setError("Failed to fetch order details.");
      }
    } catch (err) {
      setError("An error occurred while fetching order details.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    setSelectedOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loader">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="table-responsive mt-4">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Order No</th>
              <th>Order Date</th>
              <th>Net Amount</th>
              <th>Mode</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Dispatch Date</th>
              <th>Courier</th>
              <th>Docket No</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.order_date}</td>
                <td>{order.NetAmount}</td>
                <td>{order.mode}</td>
                <td className="text-center">{order.payment_status}</td>
                <td className="text-center">{order.order_status}</td>
                <td>{order.dispatch_date}</td>
                <td>{order.courier_name}</td>
                <td>{order.docket_number}</td>
                <td
                  className="text-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleViewClick(order)}
                >
                  <i className="fa fa-eye"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="fw-bold">Order No:</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedOrder.order_No}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label className="fw-bold">Order Date:</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedOrder.order_Date}
                  readOnly
                />
              </div>

              <div className="col-md-4">
                <label className="fw-bold">Order Status:</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedOrder.order_status}
                  readOnly
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="fw-bold">Payment Status:</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedOrder.payment_status}
                  readOnly
                />
              </div>
              {/* <div className="col-md-4">
                <label className='fw-bold'>Amount:</label>
                <input type="text" className="form-control" value={selectedOrder['Total Amount']} readOnly />
              </div> */}
            </div>

            <div className="mt-3">
              <h5>Product Details:</h5>
              {selectedOrder.Products &&
                selectedOrder.Products.map((product, index) => (
                  <div key={index} className="row mb-3">
                    <div className="col-md-4">
                      <label className="fw-bold">Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product["Product Name"]}
                        readOnly
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="fw-bold">Qty:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={product.Quantity}
                        readOnly
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="fw-bold">Rate:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={product.Rate}
                        readOnly
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="fw-bold">Amount:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.Quantity * product.Rate}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
            </div>
            <div className="row mt-3">
              <div className="col-md-4">
                <label className="fw-bold">Total Amount:</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedOrder["Total Amount"] || ""}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label className="fw-bold">GST(18%)</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedOrder["gst"] || ""}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label className="fw-bold">Net Amount</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedOrder["NetAmount"] || ""}
                  readOnly
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-block" onClick={handleCloseModal}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default MyOrder;
