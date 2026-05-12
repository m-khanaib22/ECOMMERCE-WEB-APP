import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { fetchDataFromApi } from "../../utils/api";

const HomeBanner = () => {

    const [homeBannerData, setHomeBannerData] = useState([]);

    useEffect(() => {
        fetchDataFromApi('/api/homeBanner').then((res) => {
            if (Array.isArray(res)) {
                setHomeBannerData(res);
            } else {
                console.error("HomeBanner data is not an array:", res);
                setHomeBannerData([]);
            }
        }).catch(err => {
            console.error("Error fetching homeBanner data:", err);
            setHomeBannerData([]);
        })
    }, []);

    var settings = {
        dots: false,
        infinite: homeBannerData.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true
    };

    return (
        <>
            <div className="container mt-3">
                <div className="homeBannerSection">
                    <Slider {...settings}>
                        {
                            homeBannerData?.length !== 0 && homeBannerData?.map((item, index) => {
                                return (
                                    <div className="item" key={index}>
                                        <img src={item.image} alt="banner" className="w-100" />
                                    </div>
                                )
                            })
                        }
                    </Slider>

                </div>
            </div>
        </>
    )
}
export default HomeBanner;
