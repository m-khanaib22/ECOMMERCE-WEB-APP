import Rating from "@mui/material/Rating";
import ProductZoom from "../../Components/ProductZoom";
import QuantityBox from "../../Components/QuantityBox";
import Button from "@mui/material/Button";
import { TiShoppingCart } from "react-icons/ti"
import { MdCompareArrows } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import RelatedProducts from "./RelatedProducts";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaHeart } from "react-icons/fa";


const ProductDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const [reviewsData, setReviewsData] = useState([]);
  const [activeSize, setActiveSize] = useState(null);
  const [activeTabs, setActiveTabs] = useState(0);
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedProductData, setRelatedProductData] = useState([]);
  let [cartFields, setCartFields] = useState({});
  let [productQuantity, setProductQuantity] = useState();
  const [tabError, setTabError] = useState(false);

  const [recentlyViewedproducts, setRecentlyViewedproducts] = useState([]);
  const isActive = (index) => {
    setActiveSize(index);
    setTabError(false);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      setProductData(res);

      fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
        if (Array.isArray(res)) {
          setReviewsData(res);
        } else {
          setReviewsData([]);
        }
      })

      if (res) {
        // Fetch related products
        fetchDataFromApi(`/api/products?subCatId=${res?.subCatId}`).then((resRelated) => {
          setRelatedProductData(resRelated?.products?.filter(item => item.id !== id));
        });

        // Manage recently viewed history
        let history = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
        history = [res, ...history.filter(item => item.id !== res.id && item._id !== res._id)];
        const limitedHistory = history.slice(0, 5);

        localStorage.setItem("recentlyViewed", JSON.stringify(limitedHistory));
        setRecentlyViewedproducts(limitedHistory);
      }
    });

    if (productData?.productRAM === undefined && productData?.productWEIGHT === undefined && productData?.productSIZE === undefined) {
      setActiveSize(1);
    }

  }, [id]);

  const [rating, setRating] = useState(1);
  const [reviews, setReviews] = useState({
    productId: "",
    customerName: "",
    customerId: "",
    review: "",
    customerRating: 1
  });

  const onChangeInput = (e) => {
    setReviews(() => ({
      ...reviews,
      [e.target.name]: e.target.value
    }))
  }

  const changeRating = (e) => {
    setRating(e.target.value)
    reviews.customerRating = e.target.value
  }

  const addReview = (e) => {
    e.preventDefault()

    const user = JSON.parse(localStorage.getItem("user"));
    if (user !== "" && user !== undefined && user !== null) {
      reviews.customerName = user?.name;
      reviews.customerId = user?.userId;
      reviews.productId = id;

      setIsLoading(true);

      postData(`/api/productReviews/add`, reviews).then((res) => {
        setIsLoading(false);
        setReviews({
          review: "",
          customerRating: 1
        })
        fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
          if (Array.isArray(res)) {
            setReviewsData(res);
          } else {
            setReviewsData([]);
          }
        })
      })
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please login to submit a review"
      });
      navigate("/signin");
    }
  }

  const quantity = (val) => {
    setProductQuantity(val)
  }

  const addtoCart = () => {

    if (activeSize !== null) {
      const user = JSON.parse(localStorage.getItem("user"));



      if (user !== undefined && user !== null && user !== "") {
        const cartFields = {
          productTitle: productData?.name,
          image: productData?.images[0],
          rating: productData?.rating,
          price: productData?.price,
          quantity: productQuantity,
          subTotal: parseInt(productData?.price * productQuantity),
          productId: productData?.id,
          userId: user?.userId
        }

        context.addToCart(cartFields)
      } else {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Please login to add to cart"
        })
      }

    } else {
      setTabError(true);
    }
  }

  const isItemInMyList = (id) => {
    const status = context.myListData?.some(item => item.productId === id);
    return status;
  }

  const addToMyList = (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user !== undefined && user !== null && user !== "") {
      if (isItemInMyList(id)) {
        const item = context.myListData?.find(item => item.productId === id);
        context.removeMyListItem(item?._id);
      } else {
        const data = {
          productTitle: productData?.name,
          image: productData?.images[0],
          rating: productData?.rating,
          price: productData?.price,
          productId: id,
          userId: user?.userId
        }
        context.addToMyList(data);
      }
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please Login to continue"
      })
    }

  }

  return (
    <>
      <section className="productDetails section">
        <div className="container">
          <div className="row">
            <div className="col-md-4 pl-5">
              <ProductZoom images={productData?.images} discount={productData?.discount} />
            </div>
            <div className="col-md-7 pl-5 pr-5">
              <h2 className="hd text-capitalize">{productData?.name}</h2>
              <ul className="list list-inline d-flex align-items-center">
                <li className="list-inline-item">
                  <div className="d-flex align-items-center">
                    <span className="text-light mr-2">Brands : </span>
                    <span>{productData?.brand}</span>
                  </div>
                </li>
                <li className="list-inline-item ">
                  <div className="d-flex align-items-center mt-3">
                    <Rating
                      name="read-only"
                      value={parseInt(productData?.rating)}
                      readOnly
                      size="small"
                      precision={1}
                    />
                    <span className="text-light cursor ml-2">{(Array.isArray(reviewsData) && reviewsData?.length) || 0} Review</span>
                  </div>
                </li>
              </ul>

              <div className="d-flex info mb-3">
                <span className="oldPrice">${productData?.oldPrice}</span>
                <span className="netPrice text-danger ml-2">${productData?.price}</span>
              </div>

              <span className="badge badge-success">IN STOCK</span>

              <p className="mt-3">{productData?.description}</p>

              {
                productData?.productRAMS?.length !== 0 &&
                <div className="productSize d-flex align-items-center">
                  <span>RAM:</span>
                  <ul className={`list list-inline mb-0 pl-4 ${tabError === true && 'error'}`}>
                    {
                      productData?.productRAMS?.map((item, index) => {
                        return (
                          <li className='list-inline-item'><a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item?.productRAM}</a></li>
                        )
                      })
                    }
                  </ul>
                </div>
              }

              {
                productData?.productSIZE?.length !== 0 &&
                <div className="productSize d-flex align-items-center">
                  <span>SIZE:</span>
                  <ul className={`list list-inline mb-0 pl-4 ${tabError === true && 'error'}`}>
                    {
                      productData?.productSIZE?.map((item, index) => {
                        return (
                          <li className='list-inline-item'><a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item?.productSIZE}</a></li>
                        )
                      })
                    }
                  </ul>
                </div>
              }

              {
                productData?.productWEIGHT?.length !== 0 &&
                <div className="productSize d-flex align-items-center">
                  <span>WEIGHT:</span>
                  <ul className={`list list-inline mb-0 pl-4 ${tabError === true && 'error'}`}>
                    {
                      productData?.productWEIGHT?.map((item, index) => {
                        return (
                          <li className='list-inline-item'><a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item.productWEIGHT}</a></li>
                        )
                      })
                    }
                  </ul>
                </div>
              }



              <div className="d-flex align-items-center mt-3">
                <QuantityBox quantity={quantity} />
                <Button className="btn-blue btn-lg btn-big btn-round" onClick={addtoCart}><TiShoppingCart /> &nbsp;
                  {
                    context.addingInCart === true ? "adding..." : "Add to cart"
                  }
                </Button>

                <Tooltip title='Add to Wishlist' placement="top">
                  <Button className={`btn-blue btn-lg btn-big btn-circle ml-4 ${isItemInMyList(id) && 'active'}`} onClick={() => addToMyList(id)}>
                    {
                      isItemInMyList(id) ?
                        <FaHeart style={{ fontSize: '20px', color: '#ff4d4d' }} />
                        :
                        <IoMdHeartEmpty style={{ fontSize: '20px' }} />
                    }
                  </Button>
                </Tooltip>
                <Tooltip title='Add to Compare' placement="top">
                  <Button className="btn-blue btn-lg btn-big btn-circle ml-4"><MdCompareArrows /></Button>
                </Tooltip>
              </div>

            </div>
          </div>


          <br />

          <div className="card mt-5 p-5 detailPageTabs">
            <div className="customTabs">
              <ul className="list list-inline">
                <li className="list-inline-item">
                  <Button className={`${activeTabs === 0 && 'active'}`} onClick={() => { setActiveTabs(0) }}>Description</Button>
                </li>
                <li className="list-inline-item">
                  <Button className={`${activeTabs === 1 && 'active'}`} onClick={() => { setActiveTabs(1) }}>Additional info</Button>
                </li>
                <li className="list-inline-item">
                  <Button className={`${activeTabs === 2 && 'active'}`} onClick={() => { setActiveTabs(2) }}>Reviews({(Array.isArray(reviewsData) && reviewsData?.length) || 0})</Button>
                </li>
              </ul>
              <br />

              {activeTabs === 0 &&
                <div className='tabContent'>
                  {productData?.description}
                </div>
              }

              {
                activeTabs === 1 &&
                <div className='tabContent'>
                  <div className='table-responsive'>
                    <table className='table table-bordered'>
                      <tbody>
                        <tr class="stand-up">
                          <th>Stand Up</th>
                          <td>
                            <p>35"L x 24"W x 37-45"H(front to back wheel)</p>
                          </td>
                        </tr>
                        <tr class="folded-wo-wheels">
                          <th>Folded (w/o wheels) </th>
                          <td>
                            <p>32.5"L x 18.5"W x 16.5"H</p>
                          </td>
                        </tr>
                        <tr class="folded-w-wheels">
                          <th>Folded (w/ wheels) </th>
                          <td>
                            <p>32.5"L x 24"W x 18.5"H</p>
                          </td>
                        </tr>
                        <tr class="door-pass-through">
                          <th>Door Pass Through</th>
                          <td>
                            <p>24</p>
                          </td>
                        </tr>
                        <tr class="frame">
                          <th>Frame</th>
                          <td>
                            <p>Aluminum</p>
                          </td>
                        </tr>
                        <tr class="weight-wo-wheels">
                          <th>Weight (w/o wheels) </th>
                          <td>
                            <p>20 LBS</p>
                          </td>
                        </tr>
                        <tr class="weight-capacity">
                          <th>Weight Capacity</th>
                          <td>
                            <p>60 LBS</p>
                          </td>
                        </tr>
                        <tr class="width">
                          <th>Width</th>
                          <td>
                            <p>24"</p>
                          </td>
                        </tr>
                        <tr class="handle-height-ground-to-handle">
                          <th>Handle height (ground to handle)</th>
                          <td>
                            <p>37-45"</p>
                          </td>
                        </tr>
                        <tr class="wheels">
                          <th>Wheels</th>
                          <td>
                            <p>12" air / wide track slick tread</p>
                          </td>
                        </tr>
                        <tr class="seat-back-height">
                          <th>Seat back height</th>
                          <td>
                            <p>21.5"</p>
                          </td>
                        </tr>
                        <tr class="head-room-inside-canopy">
                          <th>Head room (inside canopy)</th>
                          <td>
                            <p>25"</p>
                          </td>
                        </tr>
                        <tr class="pa_color">
                          <th>Color</th>
                          <td>
                            <p>Black,Blue,Red,White"</p>
                          </td>
                        </tr>
                        <tr class="pa_size">
                          <th>Size</th>
                          <td>
                            <p>M, S"</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              }
              {

                activeTabs === 2 &&
                <div className='tabContent'>
                  <div className='row'>
                    <div className='col-md-8'>
                      <h3>Custoer QnA</h3>
                      <br />
                      {
                        Array.isArray(reviewsData) && reviewsData?.length !== 0 && reviewsData?.slice(0)?.reverse()?.map((item, index) => {
                          return (
                            <div className='card p-4 reviewsCard flex-row shadow mb-3' key={index}>
                              <div className='info'>
                                <div className='d-flex align-items-center w-100'>
                                  <h5>{item?.customerName}</h5>
                                  <div className='ml-auto'>
                                    <Rating name="half-rating-read" value={item?.customerRating} readOnly size="small" />
                                  </div>
                                </div>
                                <h6 className='text-light'>{item?.dateCreated}</h6>
                                <p>{item?.review}</p>
                              </div>
                            </div>
                          )
                        })
                      }



                      <br className="res-hide" />

                      <form className='reviewForm' onSubmit={addReview}>
                        <h4>Add a review</h4>
                        <div className='form-group'>
                          <textarea className='form-control' placeholder='Write a Review' name='review' value={reviews.review} onChange={onChangeInput}></textarea>
                        </div>

                        <div className='row'>

                          <div className='col-md-6'>
                            <div className='form-group'>
                              <Rating name="rating" value={reviews.customerRating}
                                onChange={changeRating} />
                            </div>
                          </div>
                        </div>

                        <br />

                        <div className='form-group'>
                          <Button type='submit' className='btn-blue btn-lg btn-big btn-round'>
                            {
                              isLoading === true ? <CircularProgress color="inherit" className="loader" /> :
                                "Submit Review"
                            }</Button>
                        </div>
                      </form>
                    </div>


                  </div>
                </div>
              }

            </div>
          </div>

          <br />
          {
            relatedProductData?.length !== 0 && <RelatedProducts title="RELATED PRODUCTS" data={relatedProductData} />
          }

          {
            recentlyViewedproducts?.length !== 0 && <RelatedProducts title="RECENTLY VIEWED PRODUCTS" data={recentlyViewedproducts} />
          }



        </div>
      </section>
    </>
  )
}
export default ProductDetails;
