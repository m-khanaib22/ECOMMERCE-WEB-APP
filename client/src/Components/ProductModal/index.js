import Dialog from "@mui/material/Dialog";
import { IoIosClose } from "react-icons/io";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import QuantityBox from "../QuantityBox";
import { FaHeart } from "react-icons/fa";
import { MdCompareArrows } from "react-icons/md";
import ProductZoom from "../ProductZoom";
import { TiShoppingCart } from "react-icons/ti";
import { MyContext } from "../../App";
import { useContext, useState } from "react";
import { postData } from "../../utils/api";

const ProductModal = (props) => {
  const context = useContext(MyContext);
  const [productQuantity, setProductQuantity] = useState(1);

  const quantity = (val) => {
    setProductQuantity(val);
  }

  const addtoCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user !== undefined && user !== null && user !== "") {
      const cartFields = {
        productTitle: props.data?.name,
        image: props.data?.images[0],
        rating: props.data?.rating,
        price: props.data?.price,
        quantity: productQuantity,
        subTotal: parseInt(props.data?.price * productQuantity),
        productId: props.data?.id,
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
  }


  const addToMyList = (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user !== undefined && user !== null && user !== "") {
      if (isItemInMyList(id)) {
        const item = context.myListData?.find(item => item.productId === id);
        context.removeMyListItem(item?._id);
      } else {
        const data = {
          productTitle: props?.data?.name,
          image: props?.data?.images[0],
          rating: props?.data?.rating,
          price: props?.data?.price,
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

  const isItemInMyList = (id) => {
    const status = context.myListData?.some(item => item.productId === id);
    return status;
  }

  return (
    <>
      <Dialog open={props.open} className="productModal" onClose={() => props.closeProductModal()}>
        <Button className="close_" onClick={() => props.closeProductModal()}><IoIosClose /></Button>
        <h4 className="mb-1 font-weight-bold">{props?.data?.name}</h4>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center mr-4">
            <span>Brands:</span>
            <span className="ml-2"><b>{props?.data?.brand}</b></span>
          </div>
          <Rating name="read-only" value={parseInt(props?.data?.rating)} readOnly size="small" precision={0.5} />
        </div>
        <hr />
        <div className="row mt-2 productDetailsModal">
          <div className="col-md-5">
            <ProductZoom images={props?.data?.images} discount={props?.data?.discount} />
          </div>
          <div className="col-md-7">
            <div className="d-flex info align-items-center mb-3">
              <span className="oldPrice lg mr-2">Rs: {props?.data?.oldPrice}</span>
              <span className="netPrice text-danger lg">Rs: {props?.data?.price}</span>
            </div>

            <span className="badge bg-success">IN STOCK</span>
            <p className="mt-3">{props?.data?.description}</p>


            <div className="d-flex align-items-center">
              <QuantityBox quantity={quantity} />
              <Button className="btn-red btn-lg btn-big btn-round ml-3" onClick={addtoCart}>
                <TiShoppingCart />
                {
                  context.addingInCart === true ? "adding..." : "Add to Cart"
                }
              </Button>
            </div>

            <div className="d-flex align-items-center mt-5 actions">
              <Button className={`btn-round btn-sml ${isItemInMyList(props.data?.id) && 'active'}`} variant="outlined" onClick={() => addToMyList(props.data?.id)}>
                <FaHeart style={{ color: isItemInMyList(props.data?.id) ? '#ff4d4d' : '' }} /> &nbsp; {isItemInMyList(props.data?.id) ? 'ADDED TO WISHLIST' : 'ADD TO WISHLIST'}
              </Button>
              <Button className="btn-round btn-sml ml-3" variant="outlined"><MdCompareArrows /> &nbsp; COMPARE</Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default ProductModal;