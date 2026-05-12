import React, { useContext } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { MyContext } from "../../App";
import { Link } from "react-router-dom";

const HomeCat = () => {

    const context = useContext(MyContext);

    return (
        <section className="homeCat">
            <div className="container">
                <h3 className="mb-3 hd">Featured Categories</h3>
                <Swiper
                    slidesPerView={10}
                    spaceBetween={5}
                    navigation={true}
                    slidesPerGroup={3}
                    modules={[Navigation]}
                    className="mySwiper">

                    {
                        context.categoryData?.categoryList?.length !== 0 && context.categoryData?.categoryList?.map((cat, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <Link to={`/category/${cat?.id || cat?._id}`}>
                                        <div className="item text-center cursor" style={{ background: cat.color }}>
                                            <img src={cat.images[0]} alt={cat.name} className="w-100" />
                                            <h5>{cat.name}</h5>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            )
                        })
                    }

                </Swiper>
            </div>
        </section>
    )

}
export default HomeCat;