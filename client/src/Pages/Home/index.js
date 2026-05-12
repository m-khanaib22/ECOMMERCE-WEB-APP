import Button from "@mui/material/Button";
import HomeBanner from "../../Components/HomeBanner";
import banner1 from "../../assets/images/banner1.jpg";
import banner2 from "../../assets/images/banner2.jpg";
import banner3 from "../../assets/images/banner3.png";
import banner4 from "../../assets/images/banner4.png";
import newsletterimg from "../../assets/images/newsletterimg.jpg";
import React, { use, useEffect, useState } from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import ProductItem from "../../Components/ProductItem";
import HomeCat from "../../Components/HomeCat";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { MdMailOutline } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import { MyContext } from '../../App';
import { useContext } from 'react';
import { fetchDataFromApi } from "../../utils/api";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


const Home = () => {

    const context = useContext(MyContext);

    const [electronicsData, setElectronicsData] = useState([]);
    const [selectedCat, setSelectedCat] = useState("");
    const [value, setValue] = React.useState(0);
    const [activeCat, setActiveCat] = useState('');
    const [filterData, setFilterData] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const selectCat = (cat, index) => {
        setSelectedCat(cat);
        setValue(index);
    }

    useEffect(() => {
        window.scrollTo(0, 0);

        const location = localStorage.getItem("location");
        if (location !== "" && location !== undefined && location !== null) {
        }
    }, []);

    useEffect(() => {
        if (context.categoryData?.categoryList?.length > 0) {
            setSelectedCat(context.categoryData.categoryList[0].name);
        }
    }, [context.categoryData]);

    useEffect(() => {
        let url = `/api/products?catName=${selectedCat}`;
        if (context.selectedCountry !== "All" && context.selectedCountry !== "") {
            url += `&location=${context.selectedCountry}`;
        }
        fetchDataFromApi(url).then((res) => {
            setFilterData(res.products);
        })
    }, [selectedCat, context.selectedCountry])

    return (
        <>
            <HomeBanner />
            {
                context.categoryData?.length !== 0 && <HomeCat catData={context.categoryData} />
            }


            <section className="homeProdcts">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="sticky">
                                <div className="banner">
                                    <img src={banner1} alt="" className="cursor w-100" />
                                </div>

                                <div className="banner mt-4">
                                    <img src={banner2} alt="" className="cursor w-100" />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-9 productRow">
                            <div className="d-flex align-item-center">
                                <div className="info w-75">
                                    <h3 className="mb-0 hd">POPULAR PRODUCTS</h3>
                                    <p className="text-light text-sml mb-0">Do Not Miss The Current Offer Until The End of March</p>
                                </div>

                                <div className="ml-auto">
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        className="filterTabs"
                                    >
                                        {
                                            context.categoryData?.categoryList?.map((item, index) => {
                                                return (
                                                    <Tab key={index} className="item" label={item.name} onClick={() => selectCat(item.name, index)} />
                                                )
                                            })
                                        }

                                    </Tabs>
                                </div>

                            </div>

                            <div className="product_row w-100 mt-2">
                                <Swiper
                                    slidesPerView={4}
                                    spaceBetween={10}
                                    navigation={{ clickable: true }}
                                    slidesPerGroup={3}
                                    modules={[Navigation]}
                                    className="mySwiper">

                                    {
                                        filterData?.length !== 0 && filterData?.slice(0)?.reverse()?.map((item, index) => {
                                            return (
                                                <SwiperSlide key={index}>
                                                    <ProductItem item={item} />
                                                </SwiperSlide>
                                            )
                                        })
                                    }

                                </Swiper>
                            </div>

                            <div className="d-flex align-item-center mt-4">
                                <div className="info w-75">
                                    <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                                    <p className="text-light text-sml mb-0">New Products With Updated Stock</p>
                                </div>

                            </div>

                            <div className="productRow2 w-100 mt-4">

                                {
                                    context.productsData?.products?.length !== 0 && context.productsData?.products?.map((item, index) => {
                                        return (
                                            <ProductItem key={index} item={item} />
                                        )
                                    })
                                }

                            </div>


                            <div className="d-flex mt-4 mb-5 bannerSec">
                                <div className="banner ">
                                    <img src={banner3} alt="" className="cursor w-100" />
                                </div>
                                <div className="banner ">
                                    <img src={banner4} alt="" className="cursor w-100" />
                                </div>
                            </div>

                            <div className="d-flex align-item-center mt-4">
                                <div className="info w-75">
                                    <h3 className="mb-0 hd">FEATURED PRODUCTS</h3>
                                    <p className="text-light text-sml mb-0">Do Not Miss The Current Offer Until The End of March</p>
                                </div>
                                <Button className="viewAllBtn ml-auto">
                                    View all<FaArrowRight />
                                </Button>
                            </div>

                            <div className="product_row w-100 mt-2">
                                <Swiper
                                    slidesPerView={4}
                                    spaceBetween={10}
                                    navigation={{ clickable: true }}
                                    slidesPerGroup={3}
                                    modules={[Navigation]}
                                    className="mySwiper">

                                    {
                                        context.featuredProducts?.length !== 0 && context.featuredProducts?.map((item, index) => {
                                            return (
                                                <SwiperSlide key={index}>
                                                    <ProductItem item={item} />
                                                </SwiperSlide>
                                            )
                                        })
                                    }

                                </Swiper>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="text-white mb-1">$20 discount for your first order</p>
                            <h3 className="text-white">Join our newsletter and get...</h3>
                            <p className="text-light">Join our email subscription  now to get updates on<br /> promotions and coupons.</p>

                            <form>
                                <MdMailOutline />
                                <input type="text" placeholder="Your Email Address" />
                                <button>Subscribe</button>
                            </form>

                        </div>

                        <div className="col-md-6">
                            <img src={newsletterimg} alt="" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Home;