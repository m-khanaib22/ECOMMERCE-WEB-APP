import { Link } from "react-router-dom";
import Rating from '@mui/material/Rating';
import QuantityBox from "../../Components/QuantityBox";
import { IoIosClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import wishlist from "../../assets/images/wishlist.png";
import { deleteData, fetchDataFromApi } from "../../utils/api";

const MyList = () => {

    const context = useContext(MyContext);
    const [isLogin, setIsLogin] = useState(false);
    const history = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
        } else {
            history("/login");
        }
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/myList?userId=${user.userId}`).then((res) => {
            if (res && Array.isArray(res)) {
                context.setmyListData(res);
            } else {
                context.setmyListData([]);
            }
        })
    }, []);


    const removeItem = (id) => {
        context.removeMyListItem(id);
    }

    return (
        <>
            <section className="section cartPage">
                <div className="container">

                    <div className="myListTableWrapper">
                        <h2 className="hd mb-1">My List</h2>
                        <p>There are <b className="text-red">{Array.isArray(context.myListData) ? context.myListData.length : 0}</b> products in my list</p>

                        {
                            (Array.isArray(context.myListData) && context.myListData.length > 0) ?
                                <div className="row">
                                    <div className="col-md-12 pr-5">

                                        <div className="table-responsive myListTable">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th width="50%">Product</th>
                                                        <th width="15%">Unit Price</th>
                                                        <th width="10%">Remove</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        (Array.isArray(context.myListData) && context.myListData.length > 0) && context.myListData.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td width="50%">
                                                                        <Link to={`/product/${item?.productId}`}>
                                                                            <div className="d-flex align-items-center cartItemimgWrapper">
                                                                                <div className="imgWrapper">
                                                                                    <img src={item?.image?.startsWith("http") ? item?.image : `${context.baseURL}/uploads/${item?.image}`}
                                                                                        className="w-100" />
                                                                                </div>

                                                                                <div className="info px-3">
                                                                                    <h6>{item?.productTitle}</h6>
                                                                                    <Rating name="read-only" value={item?.rating} readOnly size="small" />
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    </td>
                                                                    <td width="15%">Rs {item?.price}</td>
                                                                    <td width="10%"><span className="remove" onClick={() => removeItem(item?._id)}><IoIosClose /></span></td>
                                                                </tr>
                                                            )
                                                        })
                                                    }


                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                                :
                                <div className="empty d-flex align-items-center justify-content-center flex-column">
                                    <img src={wishlist} width="250" />
                                    <h3>My List is currently empty</h3>
                                    <br />
                                    <Link to="/"> <Button className='btn-blue bg-red btn-lg btn-big w-100'><FaArrowLeft /> &nbsp; Continue Adding</Button></Link>
                                </div>
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default MyList;