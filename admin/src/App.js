import "./App.css";
import "./responsive.css";
import axios from "axios";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VerifyOTP from "./pages/SignUp/VerifyOTP";
import Alert from '@mui/material/Alert';
import Products from "./pages/products";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Snackbar from '@mui/material/Snackbar';
import "bootstrap/dist/css/bootstrap.min.css";
import LoadingBar from "react-top-loading-bar";
import { fetchDataFromApi } from "./utils/api";
import ProductDetails from "./pages/productDetails";
import Category from "./pages/Category/categoryList";
import AddCategory from "./pages/Category/addcategory";
import EditProduct from "./pages/products/editproduct";
import EditCategory from "./pages/Category/editCategory";
import EditSubCategory from "./pages/Category/editSubCat";
import ProductUpload from "./pages/products/productupload";
import SubCategory from "./pages/Category/subcategoryList";
import AddSubCategory from "./pages/Category/addSubCategory";
import AddproductRAMS from "./pages/products/addproductRAMS";
import AddproductSIZE from "./pages/products/addproductSIZE";
import AddproductWEIGHT from "./pages/products/addproductWEIGHT";
import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Orders from "./pages/Orders";
import HomeBanner from "./pages/HomeBanner";
import AddHomeBannerSlider from "./pages/HomeBanner/addHomeSlider";
import ForgotPassword from "./pages/ForgotPassword";
const MyContext = createContext();

function App() {

  const history = useNavigate();
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [catdata, setCatData] = useState([]);
  const [isLogin, setIsLogin] = useState(true);
  const [themeMode, setThemeMode] = useState(true);
  const [subCatData, setSubCatData] = useState([]);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [productRAMSData, setProductRAMSData] = useState([]);
  const [productSIZEData, setProductSIZEData] = useState([]);
  const [productWEIGHTData, setProductWEIGHTData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isHideSidebarAndHeader, setIsHideSidebarAndHeader] = useState(false);
  const [countryList, setCountryList] = useState([]);
  // const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountry, setselectedCountry] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: ""
  })
  const [recentOrders, setRecentOrders] = useState([]);


  const [baseURL, setBaseURL] = useState("https://ecommerce-web-app-production-11c1.up.railway.app");
  const [progress, setProgress] = useState(0);
  const [alertBox, setAlertBox] = useState({
    msg: '',
    error: false,
    open: false
  });


  useEffect(() => {

    const theme_Mode = localStorage.getItem('themeMode');

    if (themeMode === true) {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      localStorage.setItem('themeMode', 'light');
    }
    else {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
      localStorage.setItem('themeMode', 'dark');
    }
  }, [themeMode]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true);

      const userData = JSON.parse(localStorage.getItem("user"));

      setUser(userData);

    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
  }, [])

  const getCountry = async (url) => {
    const responsive = await axios.get(url).then((res) => {
      setCountryList(res.data.data)
      console.log(res.data.data)
    })
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

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertBox({
      open: false
    });
  };

  useEffect(() => {
    setProgress(20)
    fetchCategory()
    fetchSubCategory();
    fetchProductRAMS();
    fetchProductSIZE();
    fetchProductWEIGHT();
  }, []);


  const fetchCategory = async () => {
    fetchDataFromApi('/api/category').then((res) => {
      if (res.error !== true) {
        setCatData(res);
      }
      setProgress(100);
    })
  }

  const fetchRecentOrders = async () => {
    fetchDataFromApi('/api/orders?limit=5&sort=date').then((res) => {
      if (Array.isArray(res)) {
        setRecentOrders(res);
      }
    })
  }

  const fetchSubCategory = async () => {
    fetchDataFromApi('/api/subCat').then((res) => {
      if (res.error !== true) {
        setSubCatData(res);
      }
      setProgress(100);
    })
  }

  const fetchProductRAMS = async () => {
    fetchDataFromApi('/api/productRAMS').then((res) => {
      if (res.error !== true) {
        setProductRAMSData(res);
      }
      setProgress(100);
    })
  }

  const fetchProductSIZE = async () => {
    fetchDataFromApi('/api/productSIZE').then((res) => {
      if (res.error !== true) {
        setProductSIZEData(res);
      }
      setProgress(100);
    })
  }

  const fetchProductWEIGHT = async () => {
    fetchDataFromApi('/api/productWEIGHT').then((res) => {
      if (res.error !== true) {
        setProductWEIGHTData(res);
      }
      setProgress(100);
    })
  }


  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const openNav = () => {
    setIsOpenNav(true);
  }

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setIsHideSidebarAndHeader,
    themeMode,
    setThemeMode,
    windowWidth,
    setWindowWidth,
    openNav,
    isOpenNav,
    setIsOpenNav,
    alertBox,
    setAlertBox,
    progress,
    setProgress,
    baseURL,
    setBaseURL,
    catdata,
    setCatData,
    fetchCategory,
    fetchSubCategory,
    subCatData,
    setSubCatData,
    productRAMSData,
    setProductRAMSData,
    productSIZEData,
    setProductSIZEData,
    productWEIGHTData,
    setProductWEIGHTData,
    fetchProductRAMS,
    fetchProductSIZE,
    fetchProductWEIGHT,
    user,
    setUser,
    countryList,
    setCountryList,
    selectedCountry,
    setselectedCountry,
    recentOrders,
    setRecentOrders,
    fetchRecentOrders
  }

  return (
    <MyContext.Provider value={values}>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="topLoadingBar"
      />
      <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertBox.error === false ? "success" : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertBox.msg}
        </Alert>
      </Snackbar>

      {
        isHideSidebarAndHeader !== true &&
        <Header />
      }
      <div className="main d-flex">
        {
          isHideSidebarAndHeader !== true &&
          <>
            <div className={`sidebarOverlay d-none ${isOpenNav === true && 'show'}`} onClick={() => setIsOpenNav(false)}></div>
            <div className={`sidebarWrapper ${isToggleSidebar === true ? 'toggle' : ''} ${isOpenNav === true ? 'open' : ''} `}>
              <Sidebar />
            </div>
          </>
        }


        <div className={`content ${isHideSidebarAndHeader === true && 'full'} ${isToggleSidebar === true ? 'toggle' : ''}`}>
          <Routes>
            <Route path="/" exact={true} element={<Dashboard />} />
            <Route path="/dashboard" exact={true} element={<Dashboard />} />
            <Route path="/login" exact={true} element={<Login />} />
            <Route path="/signUp" exact={true} element={<SignUp />} />
            <Route path="/forgot-password" exact={true} element={<ForgotPassword />} />
            <Route path="/verify-otp" exact={true} element={<VerifyOTP />} />
            <Route path="/products" exact={true} element={<Products />} />
            <Route path="/productdetails/:id" exact={true} element={<ProductDetails />} />
            <Route path="/productupload" exact={true} element={<ProductUpload />} />
            <Route path="/product/edit/:id" exact={true} element={<EditProduct />} />
            <Route path="/category" exact={true} element={<Category />} />
            <Route path="/categoryadd" exact={true} element={<AddCategory />} />
            <Route path="/subcategoryadd" exact={true} element={<AddSubCategory />} />
            <Route path="/subCategory" exact={true} element={<SubCategory />} />
            <Route path="/category/edit/:id" exact={true} element={<EditCategory />} />
            <Route path="/subCategory/edit/:id" exact={true} element={<EditSubCategory />} />
            <Route path="/productRAMSadd" exact={true} element={<AddproductRAMS />} />
            <Route path="/productWEIGHTadd" exact={true} element={<AddproductWEIGHT />} />
            <Route path="/productSIZEadd" exact={true} element={<AddproductSIZE />} />
            <Route path="/orders" exact={true} element={<Orders />} />
            <Route path="/homeBanner" exact={true} element={<HomeBanner />} />
            <Route path="/homeBanner/add" exact={true} element={<AddHomeBannerSlider />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </MyContext.Provider>
  );
}

export default App;
export { MyContext };