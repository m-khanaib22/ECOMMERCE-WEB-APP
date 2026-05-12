import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { BsArrowsFullscreen } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import ProductModal from "../ProductModal";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData } from "../../utils/api";
import { Link } from "react-router-dom";

const ProductItem = (props) => {

  const context = useContext(MyContext);

  const [productData, setProductData] = useState();
  const [isOpenProductModal, setisOpenProductModal] = useState({
    id: '',
    open: false
  });


  const viewProductDetails = (id) => {
    setisOpenProductModal({
      id: id,
      open: true
    });
  }

  const closeProductModal = () => {
    setisOpenProductModal({
      id: '',
      open: false
    });
  }

  useEffect(() => {
    if (isOpenProductModal.open === true && isOpenProductModal.id !== "" && isOpenProductModal.id !== undefined) {
      fetchDataFromApi(`/api/products/${isOpenProductModal.id}`).then((res) => {
        setProductData(res);
      });
    }
  }, [isOpenProductModal]);

  const addToMyList = (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user !== undefined && user !== null && user !== "") {
      if (isItemInMyList(id)) {
        const item = context.myListData?.find(item => item.productId === id);
        context.removeMyListItem(item?._id);
      } else {
        const data = {
          productTitle: props?.item?.name,
          image: props?.item?.images[0],
          rating: props?.item?.rating,
          price: props?.item?.price,
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


      <Link to={`/product/${props.item?.id || props.item?._id}`} className={`productItemLink ${props.itemView}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={`productItem ${props.itemView}`}>
          <div className="imgWrapper">
            {
              props.item?.images?.length > 0 &&
              <img src={props.item?.images[0]?.startsWith("http") ? props.item?.images[0] : `${context.baseURL}/uploads/${props.item?.images[0]}`}
                className="w-100" />
            }
            <span className="badge badge-primary">{props.item?.discount}%</span>
            <div className="actions ">
              <Button onClick={(e) => { e.preventDefault(); e.stopPropagation(); viewProductDetails(props.item?.id || props.item?._id); }}><BsArrowsFullscreen /></Button>
              <Button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToMyList(props.item?.id || props.item?._id) }}>
                {
                  isItemInMyList(props.item?.id || props.item?._id) ?
                    <FaHeart style={{ fontSize: '20px', color: '#ff4d4d' }} />
                    :
                    <IoMdHeartEmpty style={{ fontSize: '20px' }} />
                }
              </Button>
            </div>
          </div>
          <div className="info">
            <h4>{props?.item?.name?.substr(0, 30) + '...'}</h4>
            <span className="text-success d-block">In Stock</span>
            <Rating
              className="mt-2 mb-2"
              name="read-only"
              value={props?.item?.rating}
              readOnly
              size="small"
              precision={0.5}
            />
            <div className="d-flex">
              <span className="oldPrice">Rs {props.item?.oldPrice}</span>
              <span className="netPrice text-danger ml-2">Rs {props.item?.price}</span>
            </div>
          </div>
        </div>
      </Link>

      {
        isOpenProductModal.open === true && <ProductModal open={isOpenProductModal.open} data={productData} closeProductModal={closeProductModal} />
      }
    </>
  );
};
export default ProductItem;
