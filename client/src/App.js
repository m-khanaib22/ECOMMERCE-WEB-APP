import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Header from "./Components/Header";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Footer from "./Components/Footer";
import Listing from "./Pages/Listing";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import VerifyOTP from "./Pages/SignUp/VerifyOTP";
import ForgotPassword from "./Pages/ForgotPassword";
import { fetchDataFromApi, postData, deleteData, editData } from "./utils/api";
import ProductModal from "./Components/ProductModal";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MyList from "./Pages/MyList";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import SearchPage from "./Pages/Search";
import MyAccount from "./Pages/MyAccount";


const MyContext = createContext();

function App() {

  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isOpenProductModal, setisOpenProductModal] = useState(false)
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [addingInCart, setAddingInCart] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [activeCat, setActiveCat] = useState('');
  const [cartData, setCartData] = useState([]);
  const [myListData, setmyListData] = useState([]);
  const [alertBox, setAlertBox] = useState({
    msg: '',
    error: false,
    open: false
  });
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: ""
  })

  const [cartFields, setCartFields] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true);

      const userData = JSON.parse(localStorage.getItem("user"));

      setUser(userData);

    } else {
      setIsLogin(false);
    }
  }, [isLogin])

  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
    fetchCategory();
    fetchSubCategory();
    fetchFeaturedProducts();
    fetchProducts();
    openProductDetailsModal();
    const location = localStorage.getItem("location");
    if (location !== "" && location !== undefined && location !== null) {
      setSelectedCountry(location);
    }
  }, []);

  useEffect(() => {
    fetchProducts(selectedCountry);
    fetchFeaturedProducts(selectedCountry);
  }, [selectedCountry]);

  useEffect(() => {
    if (isLogin === true && user.userId !== "") {
      getCartData();
      getMyListData();
    }
  }, [isLogin, user.userId]);

  const getCartData = () => {
    fetchDataFromApi(`/api/cart?userId=${user.userId}`).then((res) => {
      setCartData(res);
    });
  }

  const getMyListData = () => {
    fetchDataFromApi(`/api/myList?userId=${user.userId}`).then((res) => {
      setmyListData(res);
    });
  }

  const openProductDetailsModal = (id, status) => {
    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      setProductsData(res);
      setisOpenProductModal(status);
    })
  }

  const fetchCategory = () => {
    axios.get("https://ecommerce-web-app-production-11c1.up.railway.app/api/category").then((res) => {
      setCategoryData(res.data);
      setActiveCat(res.data.categoryList[0].name)
    })
  }

  const fetchSubCategory = () => {
    axios.get("https://ecommerce-web-app-production-11c1.up.railway.app/api/subCat").then((res) => {
      setSubCategoryData(res.data);
    })
  }

  const fetchProducts = (location) => {
    let url = "https://ecommerce-web-app-production-11c1.up.railway.app/api/products?perPage=8";
    if (location && location !== "All") {
      url += `&location=${location}`;
    }
    axios.get(url).then((res) => {
      setProductsData(res.data)
    })
  }

  const fetchFeaturedProducts = (location) => {
    let url = "https://ecommerce-web-app-production-11c1.up.railway.app/api/products/featured";
    if (location && location !== "All") {
      url = `https://ecommerce-web-app-production-11c1.up.railway.app/api/products?isFeatured=true&location=${location}`;
    }
    axios.get(url).then((res) => {
      setFeaturedProducts(res.data.products ? res.data.products : res.data);
    })
  }


  const getCountry = async (url) => {
    const responsive = await axios.get(url).then((res) => {
      setCountryList(res.data.data)
      console.log(res.data.data)
    })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertBox({
      open: false
    });
  };

  const addToCart = (data) => {
    setAddingInCart(true);
    postData(`/api/cart/add`, data).then((res) => {
      if (res.status !== false && res.message !== "The user is not authorized") {
        setAlertBox({
          open: true,
          error: false,
          msg: "item is added in the cart"
        })
        setTimeout(() => {
          setAddingInCart(false);
        }, 1000);

        getCartData();
      } else {
        setAlertBox({
          open: true,
          error: true,
          msg: res.msg || res.message
        })
        setAddingInCart(false);
      }

    })
  }

  const removeCartItem = (id) => {
    deleteData(`/api/cart/${id}`).then((res) => {
      setAlertBox({
        open: true,
        error: false,
        msg: "item removed from cart"
      })
      getCartData();
    })
  }

  const updateCartItem = (id, data) => {
    editData(`/api/cart/${id}`, data).then((res) => {
      getCartData();
    })
  }

  const addToMyList = (data) => {
    postData(`/api/myList/add`, data).then((res) => {
      if (res.status !== false && res.message !== "The user is not authorized") {
        setAlertBox({
          open: true,
          error: false,
          msg: "item is added in My List"
        })
        getMyListData();
      } else {
        setAlertBox({
          open: true,
          error: true,
          msg: res.msg || res.message
        })
      }

    })
  }

  const removeMyListItem = (id) => {
    deleteData(`/api/myList/${id}`).then((res) => {
      setAlertBox({
        open: true,
        error: false,
        msg: "item removed from list"
      })
      getMyListData();
    })
  }

  const values = {
    addToCart,
    countryList,
    setSelectedCountry,
    selectedCountry,
    isHeaderFooterShow,
    setisHeaderFooterShow,
    isLogin,
    setIsLogin,
    categoryData,
    setCategoryData,
    featuredProducts,
    setFeaturedProducts,
    productsData,
    setProductsData,
    subCategoryData,
    setSubCategoryData,
    isOpenProductModal,
    setisOpenProductModal,
    baseURL: "https://ecommerce-web-app-production-11c1.up.railway.app",
    alertBox,
    setAlertBox,
    addingInCart,
    setAddingInCart,
    cartData,
    setCartData,
    getCartData,
    removeCartItem,
    updateCartItem,
    myListData,
    setmyListData,
    addToMyList,
    removeMyListItem,
    user,
    searchData,
    setSearchData
  };
  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>

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
          isHeaderFooterShow === true && <Header />
        }



        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/category/:id" exact={true} element={<Listing />} />
          <Route path="/subCat/:id" exact={true} element={<Listing />} />
          <Route path="/products" exact={true} element={<Listing />} />
          <Route exact={true} path="/product/:id" element={<ProductDetails />} />
          <Route exact={true} path="/cart" element={<Cart />} />
          <Route exact={true} path="/myList" element={<MyList />} />
          <Route exact={true} path="/signin" element={<SignIn />} />
          <Route exact={true} path="/signup" element={<SignUp />} />
          <Route exact={true} path="/forgot-password" element={<ForgotPassword />} />
          <Route exact={true} path="/verify-otp" element={<VerifyOTP />} />
          <Route exact={true} path="/checkout" element={<Checkout />} />
          <Route exact={true} path="/orders" element={<Orders />} />
          <Route exact={true} path="/search" element={<SearchPage />} />
          <Route exact={true} path="/myAccount" element={<MyAccount />} />
        </Routes>
        {
          isHeaderFooterShow === true && <Footer />
        }

        {
          isOpenProductModal === true && <ProductModal data={productsData} />
        }



      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };
