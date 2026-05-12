import DashboardBox from "../Dashboard/components/dashboardBox";
import { FaPencilAlt, FaUserCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { MdDelete, MdShoppingBag } from "react-icons/md";
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button";
import React, { useState } from "react";
import FormControl from '@mui/material/FormControl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Select from '@mui/material/Select';
import Pagination from '@mui/material/Pagination';
import { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { emphasize, styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import Rating from "@mui/material/Rating";


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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

const Products = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [showBysetCatBy, setCatBy] = useState('');
    const open = Boolean(anchorEl);
    const context = useContext(MyContext);
    const [productList, setProductList] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);

    const ITEM_HEIGHT = 48;

    useEffect(() => {
        // context.setIsHideSidebarAndHeader(false);
        window.scrollTo(0, 0);
        context.setProgress(40)
        fetchDataFromApi("/api/products").then((res) => {
            setProductList(res);
            context.setProgress(100)
        });

        fetchDataFromApi("/api/user/get/count").then((res) => {
            setTotalUsers(res?.userCount !== undefined ? res.userCount : 0);
        });

        fetchDataFromApi("/api/orders/get/count").then((res) => {
            setTotalOrders(res?.orderCount !== undefined ? res.orderCount : 0);
        });

        fetchDataFromApi("/api/products/get/count").then((res) => {
            setTotalProducts(res?.productCount !== undefined ? res.productCount : 0);
        });
    }, []);

    const deleteProduct = (id) => {
        context.setProgress(40)
        deleteData(`/api/products/${id}`).then((res) => {
            context.setProgress(100)
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Product deleted successfully!'
            });
            fetchDataFromApi("/api/products").then((res) => {
                setProductList(res);
            });
        })
    }

    const handleChange = (event, value) => {
        context.setProgress(40);
        fetchDataFromApi(`/api/products?page=${value}`).then((res) => {
            setProductList(res);
            context.setProgress(100);
        })
    };

    return (
        <>

            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4">
                    <h5 className="mb-0">Products</h5>
                    <div className="ml-auto d-flex align-items-center">
                        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                            <StyledBreadcrumb
                                component="a"
                                href="/"
                                label="Dashboard"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                                label="Products"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>

                        <Link to="/productupload"><Button className="btn-blue ml-3 pl-3 pr-3">Add Product</Button></Link>

                    </div>
                </div>



                <div className="row dashboardBoxWrapperRow">
                    <div className="col-md-12">
                        <div className="dashboardBoxWrapper d-flex one-line">
                            <DashboardBox color={["#1da256", "#48d483"]} icon={<FaUserCircle />} title="Total Users" count={totalUsers} grow={true} />
                            <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<TiShoppingCart />} title="Total Orders" count={totalOrders} />
                            <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<MdShoppingBag />} title="Total Products" count={totalProducts} />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Best Selling Products</h3>
                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>Category by</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={showBysetCatBy}
                                    onChange={(e) => setCatBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    labelId="demo-select-small-label"
                                    className="w-100"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        context.catdata?.categoryList?.length !== 0 && context.catdata?.categoryList?.map((cat, index) => {
                                            return (
                                                <MenuItem className='text-capitalize' value={cat.id} key={index} >{cat.name}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ width: '300px' }} >PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>SUB CATEGORY</th>
                                    <th>BRAND</th>
                                    <th>PRICE</th>
                                    <th>RATING</th>
                                    <th>PRODUCT RAMS</th>
                                    <th>PRODUCT SIZE</th>
                                    <th>PRODUCT WEIGHT</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    productList?.products?.length !== 0 && productList?.products?.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>
                                                    <div className="d-flex align-items-center productBox">
                                                        <div className="imgWrapper">
                                                            <div className="img card shadow m-0"><img src={item.images[0]?.startsWith("http") ? item.images[0] : `${context.baseURL}/uploads/${item.images[0]}`} alt="" className="w-100" /></div>
                                                        </div>
                                                        <div className="info pl-3">
                                                            <h6>{item?.name}</h6>
                                                            <p>{item?.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item?.category?.name}</td>
                                                <td>{item?.subCat?.subCat}</td>
                                                <td>{item?.brand}</td>
                                                <td>
                                                    <div style={{ width: '70px' }}>
                                                        <del className="old">Rs{item?.oldPrice}</del>
                                                        <span className="new text-danger">Rs{item?.price}</span>
                                                    </div>
                                                </td>
                                                <td><Rating name="read-only" defaultValue={item?.rating} precision={0.5} size="small" readOnly /></td>
                                                <td>
                                                    {item?.productRAMS.map((ram) => {
                                                        return (<span className="badge badge-primary mr-2">{ram.productRAM}</span>)
                                                    })}
                                                </td>
                                                <td>
                                                    {item?.productSIZE.map((size) => {
                                                        return (<span className="badge badge-primary mr-2">{size.productSIZE}</span>)
                                                    })}
                                                </td>
                                                <td>
                                                    {item?.productWEIGHT.map((weight) => {
                                                        return (<span className="badge badge-primary mr-2">{weight.productWEIGHT}</span>)
                                                    })}
                                                </td>
                                                <td><div className="actions d-flex align-items-center">
                                                    <Link to={`/productdetails/${item.id}`}><Button className="secondary" color="secondary"><FaEye /></Button></Link>
                                                    <Link to={`/product/edit/${item.id}`}><Button className="success" color="success"><FaPencilAlt /></Button></Link>
                                                    <Button className="error" color="error" onClick={() => deleteProduct(item.id)} ><MdDelete /></Button>
                                                </div></td>
                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>
                        {
                            productList?.totalPages > 1 && <div className="d-flex tableFooter">
                                <Pagination count={productList?.totalPages || 1} color="primary" className="pagination" showFirstButton showLastButton onChange={handleChange} />
                            </div>
                        }
                    </div>

                </div>
            </div>
        </>
    );
}

export default Products;