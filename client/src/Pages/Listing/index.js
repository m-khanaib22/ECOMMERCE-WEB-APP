import Sidebar from "../../Components/Sidebar";
import Button from '@mui/material/Button';
import { IoIosMenu } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { FaAngleDown } from "react-icons/fa6";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState, useContext } from "react";
import ProductItem from "../../Components/ProductItem";
import Pagination from '@mui/material/Pagination';
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";

const Listing = () => {
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [productView, setproductView] = useState('four');
    const [productData, setProductData] = useState([]);
    const openDropdown = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { id } = useParams();
    const context = useContext(MyContext);

    useEffect(() => {

        window.scrollTo(0,0);

    let url=window.location.href;
    let apiEndPoint="";

    if (url.includes('category')){
        apiEndPoint=`/api/products?category=${id}&location=${context.selectedCountry}`
    }
    if (url.includes('subCat')){
        apiEndPoint=`/api/products?subCatId=${id}&location=${context.selectedCountry}`
    }

    console.log(window.location.href)
    

        fetchDataFromApi(`${apiEndPoint}`).then((res) => {
            console.log(res.products);
            setProductData(res.products);
        })
    }, [id, context.selectedCountry]);

    const filterData = (subCatId) => {
        fetchDataFromApi(`/api/products?subCatId=${subCatId}`).then((res) => {
            setProductData(res.products);
        })
    }

    const filterByPrice = (price, subCatId) => {
        fetchDataFromApi(`/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&subCatId=${subCatId}`).then((res) => {
            setProductData(res.products)
        })
    }

    const filterByRating = (rating, subCatId) => {
        fetchDataFromApi(`/api/products?rating=${rating}&subCatId=${subCatId}`).then((res) => {
            setProductData(res.products)
        })
    }

    return (
        <>

            <section className="product_Listing_Page">
                <div className="container">
                    <div className="productListing d-flex">
                        <Sidebar filterData={filterData} filterByPrice={filterByPrice} filterByRating={filterByRating} />

                        <div className="content_right">
                            <img src="https://klbtheme.com/bacola/wp-content/uploads/2021/08/bacola-banner-18.jpg" style={{ borderRadius: '8px' }} alt="" className="w-100" />


                            <div className="showBy mt-3 mb-3 d-flex align-items-center">
                                <div className="d-flex align-items-center btnWrapper">
                                    <Button className={productView === 'one' && 'act'} onClick={() => setproductView('one')}><IoIosMenu /></Button>
                                    <Button className={productView === 'three' && 'act'} onClick={() => setproductView('three')}><CgMenuGridR /></Button>
                                    <Button className={productView === 'four' && 'act'} onClick={() => setproductView('four')}><TfiLayoutGrid4Alt /></Button>
                                </div>

                                <div className="ml-auto showByFilter">
                                    <Button onClick={handleClick}> Show 9<FaAngleDown /></Button>
                                    <Menu
                                        className="w-100 showPerPageDropdown"
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={openDropdown}
                                        onClose={handleClose}
                                        slotProps={{
                                            list: {
                                                'aria-labelledby': 'basic-button',
                                            },
                                        }}
                                    >

                                        <MenuItem onClick={handleClose}>10</MenuItem>
                                        <MenuItem onClick={handleClose}>20</MenuItem>
                                        <MenuItem onClick={handleClose}>30</MenuItem>
                                        <MenuItem onClick={handleClose}>40</MenuItem>
                                        <MenuItem onClick={handleClose}>50</MenuItem>
                                        <MenuItem onClick={handleClose}>60</MenuItem>
                                    </Menu>
                                </div>

                            </div>

                            <div className="productListing">
                                {
                                    productData?.map((item, index) => {
                                        return (
                                            <ProductItem key={index} itemView={productView} item={item} />
                                        )
                                    })
                                }

                            </div>

                            <div className="d-flex align-items-center justify-content-center mt-5">
                                <Pagination count={10} color="primary" size="large" />
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Listing;