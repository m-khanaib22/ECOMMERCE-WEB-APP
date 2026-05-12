import { MdDelete } from "react-icons/md";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import Chip from "@mui/material/Chip";
import { emphasize, styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import { Link } from "react-router-dom";

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

const HomeBanner = () => {

    const [homeBannerData, setHomeBannerData] = useState([]);
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(20)
        fetchDataFromApi('/api/homeBanner').then((res) => {
            setHomeBannerData(res);
            context.setProgress(100);
        })
    }, []);


    const deleteBanner = (id) => {
        context.setProgress(40);
        deleteData(`/api/homeBanner/${id}`).then(res => {
            fetchDataFromApi('/api/homeBanner').then((res) => {
                setHomeBannerData(res);
                context.setProgress(100);
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'Banner deleted successfully!'
                });
            })
        })
    }

    return (
        <>

            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4">
                    <h5 className="mb-0">Home Banner List</h5>
                    <div className="ml-auto d-flex align-items-center">
                        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                            <StyledBreadcrumb
                                component="a"
                                href="/"
                                label="Dashboard"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                                label="Home Banner"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>

                        <Link to="/homeBanner/add"><Button className="btn-blue ml-3 pl-3 pr-3">Add Banner</Button></Link>

                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>IMAGE</th>
                                    <th style={{ width: '100px' }}>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    homeBannerData?.length !== 0 && homeBannerData?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="img" style={{ width: '100%', maxWidth: '500px' }}>
                                                            <img src={item.image} alt="" className="w-100" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ width: '100px' }}>
                                                    <div className="actions d-flex align-items-center">
                                                        <Button className="error" color="error" onClick={() => deleteBanner(item.id)}><MdDelete /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
}

export default HomeBanner;
