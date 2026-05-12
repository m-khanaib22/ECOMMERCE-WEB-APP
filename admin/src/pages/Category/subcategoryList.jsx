import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Pagination from '@mui/material/Pagination';
import { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import Chip from "@mui/material/Chip";
import { emphasize, styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import { Link } from "react-router-dom";

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

const SubCategory = () => {

    const [subCatdata, setSubCatData] = useState([]);

    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(20)
        fetchDataFromApi('/api/subCat').then((res) => {
            setSubCatData(res);
            console.log(res);
            context.setProgress(100);
        })
    }, []);


    const deleteCat = (id) => {
        context.setProgress(30);
        deleteData(`/api/subCat/${id}`).then(res => {
            if (res.success) {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'Sub Category Deleted!'
                });
                fetchDataFromApi('/api/subCat').then((res) => {
                    setSubCatData(res);
                    context.setProgress(100);
                });
                context.fetchSubCategory();
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res.message || 'Something went wrong!'
                });
                context.setProgress(100);
            }
        })
    }

    const handleChange = (event, value) => {
        context.setProgress(40);
        fetchDataFromApi(`/api/subCat?page=${value}`).then((res) => {
            setSubCatData(res);
            context.setProgress(100);
        })
    };

    return (
        <>

            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4">
                    <h5 className="mb-0">Sub Category List</h5>
                    <div className="ml-auto d-flex align-items-center">
                        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                            <StyledBreadcrumb
                                component="a"
                                href="/"
                                label="Dashboard"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                                label="sub Category"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>

                        <Link to="/subcategoryadd"><Button className="btn-blue ml-3 pl-3 pr-3">Add Sub Category</Button></Link>

                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">


                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ width: '100px' }} >CATEGORY IMAGE</th>
                                    <th>CATEGORY</th>
                                    <th>SUB CATEGORIES</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    (() => {
                                        if (subCatdata?.error) {
                                            return <tr><td colSpan="3" className="text-center text-danger">Error: {subCatdata.msg}</td></tr>
                                        }

                                        const groupedData = subCatdata?.subCategoryList?.reduce((acc, item) => {
                                            if (!item) return acc;
                                            const category = item.category;
                                            const catId = category?._id || category?.id || "uncategorized";
                                            
                                            if (!acc[catId]) {
                                                acc[catId] = {
                                                    category: (category && typeof category === 'object') ? category : { name: 'Uncategorized', images: [] },
                                                    subCats: []
                                                };
                                            }
                                            acc[catId].subCats.push({
                                                id: item._id || item.id,
                                                name: item.subCat || "Unnamed"
                                            });
                                            return acc;
                                        }, {});

                                        const rows = groupedData ? Object.values(groupedData) : [];

                                        if (rows.length === 0 && subCatdata?.subCategoryList) {
                                            return <tr><td colSpan="3" className="text-center">No Sub Categories Found</td></tr>
                                        }

                                        return rows.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="d-flex align-items-center productBox">
                                                            <div className="imgWrapper">
                                                                <div className="img">
                                                                    {
                                                                        item.category.images[0] ? (
                                                                            <img src={item.category.images[0]?.startsWith("http") ? item.category.images[0] : `${context.baseURL}/uploads/${item.category.images[0]}`} alt="" className="w-100" />
                                                                        ) : (
                                                                            <div className="no-img">No Image</div>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{item.category.name}</td>
                                                    <td>
                                                        <div className="d-flex flex-wrap">
                                                            {
                                                                 item.subCats.map((sub, subIndex) => (
                                                                    <Chip 
                                                                        key={subIndex} 
                                                                        label={sub.name} 
                                                                        onDelete={() => deleteCat(sub.id)} 
                                                                        className="mr-2 mb-2"
                                                                        color="primary"
                                                                        variant="outlined"
                                                                    />
                                                                ))
                                                            }
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    })()
                                }

                            </tbody>
                        </table>
                        {
                            subCatdata?.totalPages > 1 && <div className="d-flex tableFooter">
                                <Pagination count={subCatdata?.totalPages || 1} color="primary" className="pagination" showFirstButton showLastButton onChange={handleChange} />
                            </div>
                        }
                    </div>

                </div>
            </div>
        </>
    );
}

export default SubCategory;