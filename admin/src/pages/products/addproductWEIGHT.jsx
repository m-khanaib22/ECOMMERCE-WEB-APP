import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from "@mui/material/Chip";
import { emphasize, styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { MyContext } from '../../App';
import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { IoMdCloudUpload } from 'react-icons/io';
import CircularProgress from '@mui/material/CircularProgress';
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { deleteData, editData, fetchDataFromApi, postData } from '../../utils/api';

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

const AddproductWEIGHT = () => {

    const [editId, setEditId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productWeightData, setProductWeightData] = useState([]);
    const [formFields, setFormFields] = useState({
        productWEIGHT: ''
    });

    const context = useContext(MyContext);

    const inputChange = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        fetchDataFromApi('/api/productWEIGHT').then((res) => {
            setProductWeightData(res);
        })
    }, []);

    const addProductWEIGHT = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('productWEIGHT', formFields.productWEIGHT);

        if (formFields.productWEIGHT === '') {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'please add product Weight'
            });
            return false;
        }

        setIsLoading(true);

        if (editId === "") {
            postData('/api/productWEIGHT/create', formFields).then(res => {
                setIsLoading(false);
                setFormFields({
                    productWEIGHT: ''
                });

                fetchDataFromApi('/api/productWEIGHT').then((res) => {
                    setProductWeightData(res);
                })

            });
        } else {
            editData(`/api/productWEIGHT/${editId}`, formFields).then((res) => {
                fetchDataFromApi('/api/productWEIGHT').then((res) => {
                    setProductWeightData(res);
                    setEditId('');
                    setIsLoading(false);
                    setFormFields({
                        productWEIGHT: ''
                    });
                })
            })
        }


    }

    const deleteItem = (id) => {
        deleteData(`/api/productWEIGHT/${id}`).then((res) => {
            fetchDataFromApi('/api/productWEIGHT').then((res) => {
                setProductWeightData(res);
            })
        })

    }

    const updateData = (id) => {
        fetchDataFromApi(`/api/productWEIGHT/${id}`).then((res) => {
            setEditId(id);
            setFormFields({
                productWEIGHT: res.productWEIGHT
            })
        })
    }


    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                <h5 className="mb-0">Add Product WEIGHT</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <StyledBreadcrumb
                        component="a"
                        href="/"
                        label="Dashboard"
                        icon={<HomeIcon fontSize="small" />}
                    />
                    <StyledBreadcrumb
                        component="a"
                        label="productWEIGHT"
                        href="/productWEIGHTadd"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                    <StyledBreadcrumb
                        label="Add Product WEIGHT"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                </Breadcrumbs>
            </div>

            <form className='form' onSubmit={addProductWEIGHT}>
                <div className="row">
                    <div className="col-sm-9">
                        <div className="card p-4 mt-0">
                            <div className="row">

                                <div className="col">
                                    <div className="form-group">
                                        <h6>PRODUCT WEIGHT</h6>
                                        <input type="text" name='productWEIGHT' value={formFields.productWEIGHT} onChange={inputChange} />
                                    </div>
                                </div>

                            </div>

                            <Button type='submit' className="btn-blue btn-big btn-lg w-100"><IoMdCloudUpload />&nbsp;{isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}</Button>
                        </div>
                    </div>
                </div>
            </form>

            {
                productWeightData.length !== 0 &&
                <div className="row">
                    <div className="col-md-12">
                        <div className=" p-4 mt-0">
                            <div className="table-responsive mt-3">
                                <table className="table table-bordered v-align">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>PRODUCT WEIGHT</th>
                                            <th width="25%">ACTION</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            productWeightData.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td>{item.productWEIGHT}</td>
                                                        <td><div className="actions d-flex align-items-center">
                                                            <Button className="success" color="success" onClick={() => updateData(item.id)}><FaPencilAlt /></Button>
                                                            <Button className="error" color="error" onClick={() => deleteItem(item.id)} ><MdDelete /></Button>
                                                        </div></td>
                                                    </tr>
                                                )
                                            })
                                        }


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}

export default AddproductWEIGHT;