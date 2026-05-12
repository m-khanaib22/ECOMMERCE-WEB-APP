import { Link } from "react-router-dom";
import user from "../../assets/images/user.jpg";
import logo from "../../assets/images/logo.png";
import Button from "@mui/material/Button";
import { MdMenuOpen, MdOutlineMenu } from "react-icons/md";
import { ImBrightnessContrast } from "react-icons/im";
import { TiShoppingCart } from "react-icons/ti";
import { MdOutlineEmail } from "react-icons/md";
import SearchBox from "../SearchBox";
import { useContext, useState } from "react";
import { FaRegBell } from "react-icons/fa6";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import { FaShieldAlt } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import Divider from "@mui/material/Divider";
import { MyContext } from "../../App";
import UserAvatarImg from "../userAvatarImg";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../ChangePasswordModal";
import { useEffect } from "react";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpennotificationDrop, setisOpennotificationDrop] = useState(false);
  const openMyAcc = Boolean(anchorEl);
  const openNotications = Boolean(isOpennotificationDrop);
  const [isOpenChangePasswordModal, setIsOpenChangePasswordModal] = useState(false);

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    context.fetchRecentOrders();
  }, []);

  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMyAccDrop = () => {
    setAnchorEl(null);
  };

  const handleOpennotificationsDrop = () => {
    setisOpennotificationDrop(true);
  };
  const handleClosenotificationsDrop = () => {
    setisOpennotificationDrop(false);
  };

  const logout = () => {
    localStorage.clear();

    setAnchorEl(null);

    context.setAlertBox({
      open: true,
      error: false,
      msg: "Logout successful"
    })

    setTimeout(() => {
      history("/login");
    }, 2000);

  }

  return (
    <>
      <header className=" d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center w-100 ">
            {/* logo wrapper */}
            <div className="col-sm-2 part1">
              <Link to={"/"} className="d-flex align-items-center logo">
                <img src={logo} alt="logo" />
                <span className="ml-2">HOTASH</span>
              </Link>
            </div>

            {
              context.windowWidth > 992 &&
              <div className="col-sm-3 d-flex align-items-center part2 res-hide">
                <Button className="rounded-circle mr-3" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
                  {
                    context.isToggleSidebar === false ? <MdMenuOpen /> : <MdOutlineMenu />
                  }
                </Button>
                <SearchBox />
              </div>
            }



            <div className="col-sm-7 d-flex align-items-center justify-content-end part3 pl-4">
              <Button className="rounded-circle mr-3" onClick={() => context.setThemeMode(!context.themeMode)}>
                <ImBrightnessContrast />
              </Button>


              <div className="dropdownWrapper position-relative">
                <Button
                  className="rounded-circle mr-3"
                  onClick={handleOpennotificationsDrop}
                ><FaRegBell /></Button>
                <Menu
                  anchorEl={isOpennotificationDrop}
                  className="notifications dropdown_list"
                  id="notifications"
                  open={openNotications}
                  onClose={handleClosenotificationsDrop}
                  onClick={handleClosenotificationsDrop}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <div className="head pl-3 pb-0">
                    <h4>Orders({context.recentOrders?.length || 0})</h4>
                  </div>
                  <Divider className="mb-1" />

                    <div className="scroll">
                    {
                      Array.isArray(context.recentOrders) && context.recentOrders.length > 0 && context.recentOrders.map((item, index) => {
                        return (
                          <MenuItem onClick={handleClosenotificationsDrop} key={index}>
                            <div className="d-flex">
                              <div>
                                <UserAvatarImg img={item.products[0]?.image?.startsWith("http") ? item.products[0]?.image : `${context.baseURL}/uploads/${item.products[0]?.image}`} />
                              </div>
                              <div className="dropdownInfo">
                                <h4>
                                  <span>
                                    <b>{item.name} </b>
                                    placed a new order
                                    <b> Rs {item.amount}</b>
                                  </span>
                                </h4>
                                <p className="text-sky">{new Date(item.date).toLocaleString().split(',')[0]}</p>
                              </div>
                            </div>
                          </MenuItem>
                        )
                      })
                    }
                  </div>

                  <div className="pl-3 pr-3 pt-2 pb-1 -w-100">
                    <Button className="btn-blue w-100">view all Notications</Button>
                  </div>

                </Menu>
              </div>

              {
                context.isLogin !== true ?
                  <Link to={'/login'}><Button className="btn-blue btn-lg btn-round">Sign In</Button>
                  </Link>
                  :
                  <div className="myAccWrapper">
                    <Button className="myAcc d-flex align-items-center"
                      onClick={handleOpenMyAccDrop}
                    >
                      <div className="userImg">
                        <span className="rounded-circle">{context.user?.name?.charAt(0)}</span>
                      </div>

                      <div className="userInfo res-hide">
                        <h4>{context.user?.name}</h4>
                        <p className="mb-0">{context.user?.email}</p>
                      </div>
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={openMyAcc}
                      onClose={handleCloseMyAccDrop}
                      onClick={handleCloseMyAccDrop}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem onClick={() => { handleCloseMyAccDrop(); setIsOpenChangePasswordModal(true); }}>
                        <ListItemIcon>
                          <FaShieldAlt />
                        </ListItemIcon>
                        Reset Password
                      </MenuItem>
                      <MenuItem onClick={logout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
              }



            </div>
          </div>
        </div>
      </header>
      <ChangePasswordModal open={isOpenChangePasswordModal} handleClose={() => setIsOpenChangePasswordModal(false)} />
    </>
  );
};

export default Header;
