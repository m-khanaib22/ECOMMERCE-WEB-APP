import Button from "@mui/material/Button";
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { FaProductHunt, FaUser, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { MyContext } from "../../App";
import { FaClipboardCheck } from "react-icons/fa";

const Sidebar = () => {

    const history = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    const context = useContext(MyContext);

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu)
    }
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
        }
        else {
            history("/login")
        }

    }, []);


    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}  `} onClick={() => isOpenSubmenu(0)}>
                                <span className="icon"><MdDashboard /></span>
                                Dashboard
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 6 && isToggleSubmenu === true ? 'active' : ''}  `} onClick={() => isOpenSubmenu(6)}>
                            <span className="icon"><FaProductHunt /></span>
                            Home Banner
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 6 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className="submenu">
                                <li><Link to="/homeBanner">Home Banner List</Link></li>
                                <li><Link to="/homeBanner/add">Add a Home Banner</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? 'active' : ''}  `} onClick={() => isOpenSubmenu(1)}>
                            <span className="icon"><FaProductHunt /></span>
                            Products
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className="submenu">
                                <li><Link to="/products">Product List</Link></li>
                                <li><Link to="/productdetails">Product View</Link></li>
                                <li><Link to="/productupload">ADD Product</Link></li>
                                <li><Link to="/productRAMSadd">ADD Product RAM</Link></li>
                                <li><Link to="/productSIZEadd">ADD Product Size</Link></li>
                                <li><Link to="/productWEIGHTadd">ADD Product Weight</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 2 && isToggleSubmenu === true ? 'active' : ''}  `} onClick={() => isOpenSubmenu(2)}>
                            <span className="icon"><FaProductHunt /></span>
                            Category
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className="submenu">
                                <li><Link to="/category">Category List</Link></li>
                                <li><Link to="/categoryadd">Add a Category</Link></li>
                                <li><Link to="/subCategory">Sub Category list</Link></li>
                                <li><Link to="/subcategoryadd">Sub Category add</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Link to="/orders">
                            <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}  `} onClick={() => isOpenSubmenu(5)}>
                                <span className="icon"><FaClipboardCheck /></span>
                                ORDERS
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/login">
                            <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}  `} onClick={() => isOpenSubmenu(3)}>
                                <span className="icon"><FaUser /></span>
                                LOGIN
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/signUp">
                            <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}  `} onClick={() => isOpenSubmenu(4)}>
                                <span className="icon"><FaUserCircle /></span>
                                SIGN UP
                            </Button>
                        </Link>
                    </li>


                </ul>
                <br />

                <div className="logoutWrapper">
                    <div className="logoutBox">
                        <Button variant="contained"><FiLogOut />Logout</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;