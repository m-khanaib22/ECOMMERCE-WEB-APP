import { Link } from "react-router-dom";
import Rating from '@mui/material/Rating';
import QuantityBox from "../../Components/QuantityBox";
import { IoIosClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import emptyCart from "../../assets/images/empty-cart.png";
import { IoBagCheckOutline } from "react-icons/io5";

const Cart = () => {

    const [cartData, setCartData] = useState([]);
    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        // window.scrollTo(0, 0);
        setCartData(context.cartData);
    }, [context.cartData]);


    const removeItem = (id) => {
        context.removeCartItem(id);
    }

    const updateCart = (val, item) => {
        const cartFields = {
            productTitle: item?.productTitle,
            image: item?.image,
            rating: item?.rating,
            price: item?.price,
            quantity: val,
            subTotal: parseInt(item?.price * val),
            productId: item?.productId,
            userId: item?.userId
        };

        context.updateCartItem(item?._id, cartFields);
    }


    return (
        <>
            <section className="section cartPage">
                <div className="container">
                    <h2 className="hd mb-1">Your Cart</h2>
                    <p>There are <b className="text-red">{Array.isArray(cartData) ? cartData.length : 0}</b> products in your cart</p>

                    {
                        (Array.isArray(cartData) && cartData.length > 0) ?
                            <div className="row">
                                <div className="col-md-9 pr-5">

                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th width="35%">Product</th>
                                                    <th width="15%">Unit Price</th>
                                                    <th width="25%">Quantity</th>
                                                    <th width="15%">Subtotal</th>
                                                    <th width="10%">Remove</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    (Array.isArray(cartData) && cartData.length > 0) && cartData.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td width="35%">
                                                                    <Link to={`/product/${item?.productId}`}>
                                                                        <div className="d-flex align-items-center cartItemimgWrapper">
                                                                            <div className="imgWrapper">
                                                                                <img src={item?.image?.startsWith("http") ? item?.image : `${context.baseURL}/uploads/${item?.image}`}
                                                                                    className="w-100" />
                                                                            </div>

                                                                            <div className="info px-3">
                                                                                <h6>{item?.productTitle?.substr(0, 30) + '...'}</h6>
                                                                                <Rating name="read-only" value={item?.rating} readOnly size="small" />
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </td>
                                                                <td width="15%">Rs {item?.price}</td>
                                                                <td width="25%">
                                                                    <QuantityBox quantity={updateCart} item={item} value={item?.quantity} selectedItem={updateCart} />
                                                                </td>
                                                                <td width="15%">Rs {item?.subTotal}</td>
                                                                <td width="10%"><span className="remove" onClick={() => removeItem(item?._id)}><IoIosClose /></span></td>
                                                            </tr>
                                                        )
                                                    })
                                                }


                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="card shadow p-3 cartDetails">
                                        <h4>CART TOTALS</h4>

                                        <div className="d-flex align-items-center mb-3">
                                            <span>Subtotal</span>
                                            <span className="ml-auto text-red font-weight-bold">
                                                Rs {
                                                    (Array.isArray(cartData) && cartData.length > 0) ?
                                                        cartData.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0) : 0
                                                }
                                            </span>
                                        </div>

                                        <div className="d-flex align-items-center mb-3">
                                            <span>Shipping</span>
                                            <span className="ml-auto"><b>Free</b></span>
                                        </div>

                                        <div className="d-flex align-items-center mb-3">
                                            <span>Estimate for</span>
                                            <span className="ml-auto"><b>United Kingdom</b></span>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <span>Total</span>
                                            <span className="ml-auto text-red font-weight-bold">
                                                Rs {
                                                    (Array.isArray(cartData) && cartData.length > 0) ?
                                                        cartData.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0) : 0
                                                }
                                            </span>
                                        </div>

                                        <br />
                                        <Link to='/checkout'>
                                        <Button className='btn-blue bg-red btn-lg btn-big w-100 mt-3'><IoBagCheckOutline /> &nbsp; Checkout</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="empty d-flex align-items-center justify-content-center flex-column">
                                <img src={emptyCart} width="250" />
                                <h3>Your Cart is currently empty</h3>
                                <br />
                                <Link to="/"> <Button className='btn-blue bg-red btn-lg btn-big w-100'><FaArrowLeft /> &nbsp; Continue Shopping</Button></Link>
                            </div>
                    }

                </div>
            </section>
        </>
    )
}

export default Cart;