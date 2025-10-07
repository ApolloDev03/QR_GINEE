import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Addtoproduct({ addToCart }) {
  const [quantity, setQuantity] = useState(1);
  const pricePerItem = 500;
  const productId = 'your_product_id'; // Replace 'your_product_id' with the actual product ID

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    const product = {
      productId, // Include productId here
      name: 'QR Product',
      quantity,
      price: pricePerItem * quantity,
    };
    addToCart(product);
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 text-center">
            <img src="assests/image/product_img.png" className="product_img" alt="Product Image" />
          </div>
          <div className="col-md-6">
            <div className="card mx-3">
              <div className="card-body mx-3">
                <h5 className="card-title">QR Product</h5>
                <p className="card-text">₹: {pricePerItem * quantity}/-</p>
                <p className="card-text">
                  Rating: <span className="text-warning">★ ★ ★ ★ ☆</span> (4/5)
                </p>
                <div className="d-flex align-items-center">
                  <div className="input-group mr-2" style={{ width: 120 }}>
                    <div className="input-group-prepend">
                      <button className="btn btn-outline-secondary" type="button" onClick={decrementQuantity}>
                        -
                      </button>
                    </div>
                    <input
                      type="number"
                      className="form-control text-center"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      id="quantityInput"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-outline-secondary" type="button" onClick={incrementQuantity}>
                        +
                      </button>
                    </div>
                  </div>
                  <button className="btn btn-outline-primary mx-3" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                </div>
                <div className="buy_btn mt-3">
                  <NavLink to="/checkout" className="btn btn-outline-success" onClick={handleAddToCart}>
                    Buy now
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Addtoproduct;
