import React, { useEffect, useRef, useState } from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import Chip from "@mui/material/Chip";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Rating from "@mui/material/Rating";
import { MdBrandingWatermark } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { MdRateReview } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import UserAvatarImg from "../../components/userAvatarImg";
import user from "../../assets/images/user.jpg";
import Button from "@mui/material/Button";
import { MdOutlineReply } from "react-icons/md";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import ProductZoom from "../../components/ProductZoom";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor = theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &: focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        }
    };
});





const ProductDetails = () => {


    const [reviewsData, setReviewsData] = useState([]);
    const [productData, setProductData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi(`/api/products/${id}`).then((res) => {
            setProductData(res);
        })

        fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
            setReviewsData(res);
        })



    }, [id]);



    return (
        <>
            <div className="right-content w-100 productDetails">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Product View</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="/"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            label="Products"
                            component="a"
                            href="products"
                        />
                        <StyledBreadcrumb
                            label="Product View"
                        />
                    </Breadcrumbs>
                </div>

                <div className="card productDetailsSection">
                    <div className="row">
                        <div className="col-md-5">
                            <div className="SliderWrapper pt-3 pb-3 pl-4 pr-4">
                                <h6 className="mb-4">Product Gallery</h6>
                                <ProductZoom images={productData?.images} discount={productData?.discount} />
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="pt-3 pb-3 pl-4 pr-4">
                                <h6 className="mb-4">Product Details</h6>
                                <h4>{productData?.name}</h4>

                                <div className="productInfo mt-4">
                                    <div className="row mb-2">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon "><MdBrandingWatermark /></span>
                                            <span className="name">Brand</span>
                                        </div>
                                        <div className="col-sm-7">
                                            :   <span>{productData?.brand}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon "><BiCategoryAlt /></span>
                                            <span className="name">Category</span>
                                        </div>
                                        <div className="col-sm-7">
                                            :   <span>{productData?.category?.name}</span>
                                        </div>
                                    </div>

                                    {productData?.productRAMS?.length !== 0 && <div className="row mb-2">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon "><MdRateReview /></span>
                                            <span className="name">Ram</span>
                                        </div>
                                        <div className="col-sm-7">
                                            :   <span>
                                                <div className="row">
                                                    <ul className="list list-inline sml">
                                                        {
                                                            productData?.productRAMS?.map((item, index) => {
                                                                return (
                                                                    <li className="list-inline-item" key={index}>
                                                                        <span>{item.productRAM}</span>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    }

                                    {productData?.productSIZE?.length !== 0 && <div className="row mb-2">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon "><MdRateReview /></span>
                                            <span className="name">Size</span>
                                        </div>
                                        <div className="col-sm-7">
                                            :   <span>
                                                <div className="row">
                                                    <ul className="list list-inline sml">
                                                        {
                                                            productData?.productSIZE?.map((item, index) => {
                                                                return (
                                                                    <li className="list-inline-item" key={index}>
                                                                        <span>{item.productSIZE}</span>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    }

                                    {productData?.productWEIGHT?.length !== 0 && <div className="row mb-2">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon "><MdRateReview /></span>
                                            <span className="name">Weight</span>
                                        </div>
                                        <div className="col-sm-7">
                                            :   <span>
                                                <div className="row">
                                                    <ul className="list list-inline sml">
                                                        {
                                                            productData?.productWEIGHT?.map((item, index) => {
                                                                return (
                                                                    <li className="list-inline-item" key={index}>
                                                                        <span>{item.productWEIGHT}</span>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    }

                                    <div className="row mb-2">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon "><MdRateReview /></span>
                                            <span className="name">Review</span>
                                        </div>
                                        <div className="col-sm-7">
                                            :   <span>({reviewsData?.length})</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon "><RiVerifiedBadgeFill /></span>
                                            <span className="name">Published</span>
                                        </div>
                                        <div className="col-sm-7">
                                            :   <span>{productData?.dateCreated?.split('T')[0]}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        <h6 className="mt-4 mb-3">Product Description</h6>
                        <p>{productData?.description}</p>


                        {
                            /**  <h6 className="mt-4 mb-4">Rating Analytics</h6>
                       <div className="ratingSection">
                           <div className="ratingrow d-flex align-items-center">
                               <span className="col1">
                                   4 star
                               </span>
                               <div className="col2">
                                   <div className="progress">
                                       <div className="progress-bar" style={{ width: '50%' }}></div>
                                   </div>
                               </div>
                               <span className="col3">
                                   (22)
                               </span>
                           </div>
                           <div className="ratingrow d-flex align-items-center">
                               <span className="col1">
                                   3 star
                               </span>
                               <div className="col2">
                                   <div className="progress">
                                       <div className="progress-bar" style={{ width: '30%' }}></div>
                                   </div>
                               </div>
                               <span className="col3">
                                   (22)
                               </span>
                           </div>
                           <div className="ratingrow d-flex align-items-center">
                               <span className="col1">
                                   2 star
                               </span>
                               <div className="col2">
                                   <div className="progress">
                                       <div className="progress-bar" style={{ width: '20%' }}></div>
                                   </div>
                               </div>
                               <span className="col3">
                                   (22)
                               </span>
                           </div>
                           <div className="ratingrow d-flex align-items-center">
                               <span className="col1">
                                   1 star
                               </span>
                               <div className="col2">
                                   <div className="progress">
                                       <div className="progress-bar" style={{ width: '10%' }}></div>
                                   </div>
                               </div>
                               <span className="col3">
                                   (22)
                               </span>
                           </div>
                       </div> */
                        }

                        {
                            reviewsData?.length !== 0 &&
                            <>
                                <h5 className="mt-4 mb-4">Customer Reviews</h5>
                                <div className="reviewSection">
                                    {
                                        reviewsData?.length !== 0 && reviewsData?.map((review, index) => {
                                            return (
                                                <div className="reviewsRow">
                                                    <div className="row">
                                                        <div className="col-sm-7 d-flex">
                                                            <div className="d-flex flex-column">
                                                                <div className="userInfo d-flex align-items-center mb-3">
                                                                    <UserAvatarImg img={user} lg={true} />
                                                                    <div className="info pl-3">
                                                                        <h6>{review?.customerName}</h6>
                                                                        <span>{review?.dateCreated?.split('T')[0]}</span>
                                                                    </div>
                                                                </div>
                                                                <Rating name="read-only" value={review?.customerRating} readOnly />
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-md-5 d-flex align-items-center">
                                        <div className="ml-auto"><Button className="btn-blue btn-lg ml-auto btn-big"><MdOutlineReply /> Reply</Button></div>
                                    </div> */}
                                                        <p className="mt-3">{review?.review}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>
                        }




                    </div>

                </div>


            </div>



        </>
    )
}

export default ProductDetails;