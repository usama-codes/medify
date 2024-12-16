import React from 'react'
import './cart.css'
import { MdDelete } from "react-icons/md";

const Cart = () => {
  return (
    <div className="cart">
     
      {/* Cart items */}
      <div className="container">
        <div className="box">
          <div className="img-box">
            <img src="https://5.imimg.com/data5/SELLER/Default/2024/4/410217491/ST/DQ/NW/125278182/fever-medicine-tablet-ptech-650.jpeg" alt="Product" />
          </div>
          <div className="detail">
            <div className="info">
              <h3>Product Name</h3>
              <h4>Quantity: 20</h4>
              <h4>Category: </h4>
              <h4>Price: </h4>
              <h3>Total: Quantity * Price</h3>
            </div>

            <div className="quantity">
              <button className='btn'>+</button>
              <input type="number" value="1" />
              <button className='btn'>-</button>
            </div>
            <div className="icon">
              <li><MdDelete /></li>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;
