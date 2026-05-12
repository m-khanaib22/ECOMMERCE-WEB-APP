import Button from "@mui/material/Button";
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { FaProductHunt, FaUser, FaUserCircle } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { MdMessage } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { MyContext } from "../../App";


const Sidebar = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    const context = useContext(MyContext);

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu)
    }

    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <Link to="dashboard">
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}  `} onClick={() => isOpenSubmenu(0)}>
                                <span className="icon"><MdDashboard /></span>
                                Dashboard <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? 'active' : ''}  `} onClick={() => isOpenSubmenu(1)}>
                            <span className="icon"><FaProductHunt /></span>
                            Products
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className="submenu">
                                <li><Link to="products">Product List</Link></li>
                                <li><Link to="productdetails">Product View</Link></li>
                                <li><Link to="productupload">Product Upload</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}  `} onClick={() => isOpenSubmenu(2)}>
                                <span className="icon"><TiShoppingCart /></span>
                                Orders <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}  `} onClick={() => isOpenSubmenu(3)}>
                                <span className="icon"><MdMessage /></span>
                                Messages <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}  `} onClick={() => isOpenSubmenu(4)}>
                                <span className="icon"><FaBell /></span>
                                Notifications <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}  `} onClick={() => isOpenSubmenu(5)}>
                                <span className="icon"><IoSettingsSharp /></span>
                                settings <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="login">
                            <Button className={`w-100 ${activeTab === 6 ? 'active' : ''}  `} onClick={() => isOpenSubmenu(6)}>
                                <span className="icon"><FaUser /></span>
                                LOGIN <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="signUp">
                            <Button className={`w-100 ${activeTab === 7 ? 'active' : ''}  `} onClick={() => isOpenSubmenu(7)}>
                                <span className="icon"><FaUserCircle /></span>
                                SIGN UP <span className="arrow"><FaAngleRight /></span>
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