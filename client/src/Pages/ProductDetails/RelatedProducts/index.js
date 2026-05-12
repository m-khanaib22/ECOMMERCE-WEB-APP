import React from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductItem from "../../../Components/ProductItem";

const RelatedProducts = (props) => {
    return (
        <>
            <div className="d-flex align-item-center mt-3">
                <div className="info w-75">
                    <h3 className="mb-0 hd">{props.title}</h3>
                </div>

            </div>

            <div className="product_row w-100 mt-0">
                <Swiper
                    slidesPerView={5}
                    spaceBetween={0}
                    navigation={{ clickable: true }}
                    slidesPerGroup={3}
                    modules={[Navigation]}
                    className="mySwiper">

                    {
                        props?.data?.length !== 0 && props?.data?.map((item, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <ProductItem item={item} />
                                </SwiperSlide>
                            )
                        })
                    }



                </Swiper>
            </div>
        </>
    );
}

export default RelatedProducts;