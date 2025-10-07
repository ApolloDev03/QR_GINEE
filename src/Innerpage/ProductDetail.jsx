import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { apiUrl } from "../config";

function ProductDetail() {
  const [carQuantity, setCarQuantity] = useState(1);
  const [bikeQuantity, setBikeQuantity] = useState(1);
  const [carProduct, setCarProduct] = useState(null);
  const [bikeProduct, setBikeProduct] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch car and bike product details
    const fetchProductDetails = async () => {
      try {
        const [carResponse, bikeResponse] = await Promise.all([
          axios.post(`${apiUrl}/product_detail`, {
            product_id: 1,
          }),
          axios.post(`${apiUrl}/product_detail`, {
            product_id: 2,
          }),
        ]);

        if (carResponse.data.status === "success") {
          setCarProduct(carResponse.data.Product[0]);
        }
        if (bikeResponse.data.status === "success") {
          setBikeProduct(bikeResponse.data.Product[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  useEffect(() => {
    if (carProduct && bikeProduct) {
      const carTotal = carProduct.price * carQuantity;
      const bikeTotal = bikeProduct.price * bikeQuantity;
      setTotalPrice(carTotal + bikeTotal);
    }
  }, [carQuantity, bikeQuantity, carProduct, bikeProduct]);

  const increaseCarQuantity = () => setCarQuantity(carQuantity + 1);
  const decreaseCarQuantity = () =>
    carQuantity > 0 && setCarQuantity(carQuantity - 1);
  const increaseBikeQuantity = () => setBikeQuantity(bikeQuantity + 1);
  const decreaseBikeQuantity = () =>
    bikeQuantity > 0 && setBikeQuantity(bikeQuantity - 1);

  const handleBuyNow = () => {
    if (carProduct && bikeProduct) {
      const cartItem = [
        {
          name: carProduct.product_name,
          price: carProduct.price,
          strikedPrice: carProduct.striked_price, // Add striked price
          quantity: carQuantity,
        },
        {
          name: bikeProduct.product_name,
          price: bikeProduct.price,
          strikedPrice: bikeProduct.striked_price, // Add striked price
          quantity: bikeQuantity,
        },
      ];
      navigate("/checkout", { state: { cart: cartItem, totalPrice } });
    }
  };

  // Function to calculate discount percentage
  const calculateDiscount = (price, strikedPrice) => {
    if (strikedPrice && strikedPrice > 0) {
      const discount = ((strikedPrice - price) / strikedPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  return (
    <>
      <div>
        {loading && <Loader />} {/* Show loader while loading */}
        <div className="container mt-5">
          <div className="breadcrumb__links mb-5">
            <NavLink to="/">Home</NavLink>
            <span className="breadcrumb-separator"> &gt;&gt;&gt; </span>
            <a href="#">Product</a>
          </div>
          <div className="row mt-4 justify-content-center">
            <div className="col-lg-6 mb-4 mb-md-0">
              <div className="main d-flex justify-content-center">
                {carProduct && (
                  <div className="product-detail-background d-flex justify-content-center">
                    <div className="product-img px-3" style={{}}>
                      <img
                        src={carProduct.productImg[0]?.product_photo}
                        alt="car-product-img"
                        style={{ maxWidth: "100%", borderRadius: "2px" }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
                {bikeProduct && (
                  <div className="product-img mt-4" style={{}}>
                    {/* <img src={bikeProduct.productImg[0]?.product_photo} alt="bike-product-img" style={{ maxWidth: '100%', borderRadius: '8px' }} /> */}
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              {carProduct && bikeProduct && (
                <>
                  <div className="product-link">
                    <span>
                      Sale{" "}
                      {calculateDiscount(
                        carProduct.price,
                        carProduct.striked_price
                      )}
                      % Off
                    </span>
                  </div>
                  <div className="product__details__text">
                    <h3>Vehicle Stickers</h3>
                    <div className="rating">
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star-half" />
                      <span>4.5 rating (50 Customers reviews)</span>
                    </div>
                    <div>
                      <p>
                        Your vehicle's safety is now in your control with QR
                        Genie. Get two lifetime-use QR stickers that provide
                        seamless, anonymous communication in emergencies.
                        Whether it's a forgotten light, an accident, or an open
                        window, any passerby can help without revealing their
                        identity.
                      </p>
                    </div>
                    <div>
                      <p className="text-black">
                        <strong className="text-black">
                          {" "}
                          Delivery in 3-5 business days
                        </strong>
                      </p>
                    </div>
                    <h5
                      style={{
                        color: "#666666",
                        fontSize: "16px",
                        fontWeight: "Normal",
                        marginBottom: "2px",
                      }}
                    >
                      Price:
                    </h5>
                    <div
                      className="product__details__price"
                      style={{ fontSize: "18px", marginRight: "20px" }}
                    >
                      {carProduct.striked_price && (
                        <>
                          <span className="strike_price">
                            ₹{carProduct.striked_price}
                          </span>
                        </>
                      )}
                      ₹{carProduct.price}
                    </div>
                    <div className="product__details__button d-flex mb-0">
                      <div className="quantity-section ">
                        <h5 style={{ color: "#666666" }}>
                          <i className="fa fa-car" /> Car Stickers Qty:
                        </h5>
                        <div className="quantity">
                          <button
                            className="value-button decrease-button minus"
                            onClick={decreaseCarQuantity}
                            title="Decrease"
                          >
                            -
                          </button>
                          <div
                            className="number"
                            style={{ width: "100px", textAlign: "center" }}
                          >
                            {carQuantity}
                          </div>
                          <button
                            className="value-button increase-button minus"
                            onClick={increaseCarQuantity}
                            title="Increase"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div
                        className="quantity-section"
                        style={{ marginLeft: "15px" }}
                      >
                        <h5 style={{ color: "#666666" }}>
                          <i className="fa fa-motorcycle" /> Bike Stickers Qty:
                        </h5>
                        <div className="quantity">
                          <button
                            className="value-button decrease-button minus"
                            onClick={decreaseBikeQuantity}
                            title="Decrease"
                          >
                            -
                          </button>
                          <div
                            className="number"
                            style={{ width: "100px", textAlign: "center" }}
                          >
                            {bikeQuantity}
                          </div>
                          <button
                            className="value-button increase-button minus"
                            onClick={increaseBikeQuantity}
                            title="Increase"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <strong className="text-danger">
                        Note:- No refunds or replacement
                      </strong>
                    </div>
                    <div className="btn-mb50">
                      <button className=" btn cart-btn" onClick={handleBuyNow}>
                        <span className="icon_bag_alt" /> Buy Now
                      </button>
                    </div>
                  </div>

                  {/* <p dangerouslySetInnerHTML={{ __html: carProduct.description }} /> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 ps-rel">
        <div className="Header_homepage mb-5">
          <h1>
            Product <span>Features</span>
          </h1>
        </div>
        <img className="ab-dot-n" src="assests/image/product-details-dot.png" alt="" />
        <div className="container">
          <div className="row justify-content-center">
           
            <div className="col-12 col-md-6 col-lg-4">
              <div className="ip-features-item db-shadow">
                <div className="image sm-w40">
                  <img
                    className="pf-a"
                    src="assests/image/feature/feature_01.svg"
                    alt="feature_1"
                    loading="lazy"
                  />
                  <br />
                  <h3 className="mt-2 ms-0">
                    Vehicle <br />
                    Identification Number
                  </h3>
                </div>
                <div className="text">
                  <p>
                    The sticker is linked to your unique vehicle identification
                    number (VIN), ensuring the right vehicle is identified
                    during emergencies or alerts.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="ip-features-item-right db-shadow">
                <div className="image sm-w40">
                  <img
                    className="pf-a"
                    src="assests/image/feature/feature_04.svg"
                    alt="feature_4"
                    loading="lazy"
                  />
                  <h3 className="mt-2 ms-0 pt-20">
                    Call Owner with
                    <br /> Complete Anonymity
                  </h3>
                </div>
                <div className="text">
                  <p>
                    All calls are rerouted through a virtual number, meaning the
                    caller's identity remains fully anonymous while still
                    helping the vehicle owner.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="ip-features-item-right db-shadow">
                <div className="image sm-w40">
                  <img
                    className="pf-a"
                    src="assests/image/feature/feature_5.svg"
                    alt="feature_5"
                    loading="lazy"
                  />
                  <h3 className="mt-2 ms-0 pt-20">
                    Reach <br />
                    Emergency Contacts
                  </h3>
                </div>
                <div className="text">
                  <p>
                    Should the owner be unreachable, emergency contacts can be
                    notified without exposing the caller's personal information.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="ip-features-item db-shadow">
                <div className="image sm-w40">
                  <img
                    className="pf-a"
                    src="assests/image/feature/feature_2.svg"
                    alt="feature_2"
                    loading="lazy"
                  />
                  <h3 className="mt-2 ms-0 pt-20">
                    Blood Group
                    <br /> of Vehicle Owner
                  </h3>
                </div>
                <div className="text">
                  <p>
                    Should the owner be unreachable, emergency contacts can be
                    notified without exposing the caller's personal information.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="ip-features-item db-shadow">
                <div className="image sm-w40">
                  <img
                    className="pf-a"
                    src="assests/image/feature/feature_3.svg"
                    alt="feature_3"
                    loading="lazy"
                  />
                  <h3 className="mt-2 ms-0 pt-20">
                    Send Predefined <br />
                    SMS to Vehicle Owner
                  </h3>
                </div>
                <div className="text">
                  <p>
                    Upon scanning the QR code, the user can send a pre-set SMS
                    directly to the vehicle owner, notifying them of any issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
