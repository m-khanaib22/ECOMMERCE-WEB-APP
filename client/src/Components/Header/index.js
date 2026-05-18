import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.jpg";
import Button from "@mui/material/Button";
import CountryDropdown from "../CountryDropdown";
import { FiUser } from "react-icons/fi";
import { TiShoppingCart } from "react-icons/ti";
import SearchBox from "./SearchBox";
import { FaClipboardCheck, FaUserAlt } from "react-icons/fa";
import Navigation from "./Navigation";
import { FaHeart } from "react-icons/fa";
import { useContext, useState } from "react";
import { MyContext } from "../../App";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { IoLogOut } from "react-icons/io5";

const Header = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const context = useContext(MyContext);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    setAnchorEl(null);
    localStorage.clear();
    context.setIsLogin(false)
  }

  return (
    <>
      <div className="headerWrapper">
        <div className="top-strip bg-purple">
          <div className="container">
            <p className="mb-0 mt-0 text-center">
              Due to the <b>COVID 19</b> epidemic, orders may be processed with
              a slight delay
            </p>
          </div>
        </div>
        <header className="header">
          <div className="container">
            <div className="row">
              <div className="logoWrapper d-flex align-items-center  col-sm-2">
                <Link to={"/"}>
                  <img src={logo} alt="logo" />
                </Link>
              </div>
              <div className="col-sm-10 d-flex align-items-center part2">

                {
                  context.countryList.length !== 0 && <CountryDropdown />
                }

                <SearchBox />

                <div className="part3 d-flex align-items-center ml-auto">
                  {
                    context.isLogin !== true ? <Link to="/signIn"> <Button className="btn-blue btn-round mr-3">Sign In</Button></Link> :
                      <>
                        <Button className="circle mr-3" onClick={handleClick}><FiUser /></Button>
                        <Menu
                          anchorEl={anchorEl}
                          id="accDrop"
                          open={open}
                          onClose={handleClose}
                          onClick={handleClose}
                          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >


                          <Link to="/myAccount">
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <FaUserAlt fontSize="small" />
                              </ListItemIcon>
                              My Account
                            </MenuItem>
                          </Link>
                          <Link to="/orders">
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <FaClipboardCheck fontSize="small" />
                              </ListItemIcon>
                              Orders
                            </MenuItem>
                          </Link>
                          <Link to={"/myList"}>
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <FaHeart fontSize="small" />
                              </ListItemIcon>
                              My List ({context.myListData?.length})
                            </MenuItem>
                          </Link>
                          <Link to={"/signIn"}><MenuItem onClick={logout}>
                            <ListItemIcon>
                              <IoLogOut fontSize="small" />
                            </ListItemIcon>
                            Logout
                          </MenuItem></Link>
                        </Menu>
                      </>
                  }


                  <div className="ml-auto cartTab d-flex align-items-center">
                    <span className="price">Rs. {
                      (Array.isArray(context.cartData) && context.cartData.length > 0) ?
                        context.cartData.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0) : 0
                    }</span>
                    <div className="position-relative ml-2">
                      <Link to={"/cart"}>
                        <Button className="circle ">
                          <TiShoppingCart />
                        </Button></Link>
                      <span className="count d-flex align-items-center justify-content-center">
                        {Array.isArray(context.cartData) ? context.cartData.length : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        {
          context.categoryData?.categoryList?.length !== 0 && <Navigation navData={context.categoryData?.categoryList} />
        }

      </div>
    </>
  );
};

export default Header;
