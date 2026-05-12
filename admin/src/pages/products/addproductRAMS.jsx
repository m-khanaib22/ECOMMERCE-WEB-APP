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

const AddproductRAMS = () => {

    const [editId, setEditId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productRamData, setProductRamData] = useState([]);
    const [formFields, setFormFields] = useState({
        productRAM: ''
    });

    const context = useContext(MyContext);

    const inputChange = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        fetchDataFromApi('/api/productRAMS').then((res) => {
            setProductRamData(res);
        })
    }, []);

    const addProductRAM = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('productRAM', formFields.productRAM);

        if (formFields.productRAM === '') {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'please add product RAM'
            });
            return false;
        }

        setIsLoading(true);

        if (editId === "") {
            postData('/api/productRAMS/create', formFields).then(res => {
                setIsLoading(false);
                setFormFields({
                    productRAM: ''
                });

                fetchDataFromApi('/api/productRAMS').then((res) => {
                    setProductRamData(res);
                })

            });
        } else {
            editData(`/api/productRAMS/${editId}`, formFields).then((res) => {
                fetchDataFromApi('/api/productRAMS').then((res) => {
                    setProductRamData(res);
                    setEditId('');
                    setIsLoading(false);
                    setFormFields({
                        productRAM: ''
                    });
                })
            })
        }


    }

    const deleteItem = (id) => {
        deleteData(`/api/productRAMS/${id}`).then((res) => {
            fetchDataFromApi('/api/productRAMS').then((res) => {
                setProductRamData(res);
            })
        })

    }

    const updateData = (id) => {
        fetchDataFromApi(`/api/productRAMS/${id}`).then((res) => {
            setEditId(id);
            setFormFields({
                productRAM: res.productRAM
            })
        })
    }


    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                <h5 className="mb-0">Add Product RAMS</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <StyledBreadcrumb
                        component="a"
                        href="/"
                        label="Dashboard"
                        icon={<HomeIcon fontSize="small" />}
                    />
                    <StyledBreadcrumb
                        component="a"
                        label="productRAMS"
                        href="/productRAMSadd"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                    <StyledBreadcrumb
                        label="Add Product RAMS"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                </Breadcrumbs>
            </div>

            <form className='form' onSubmit={addProductRAM}>
                <div className="row">
                    <div className="col-sm-9">
                        <div className="card p-4 mt-0">
                            <div className="row">

                                <div className="col">
                                    <div className="form-group">
                                        <h6>PRODUCT RAM</h6>
                                        <input type="text" name='productRAM' value={formFields.productRAM} onChange={inputChange} />
                                    </div>
                                </div>

                            </div>

                            <Button type='submit' className="btn-blue btn-big btn-lg w-100"><IoMdCloudUpload />&nbsp;{isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}</Button>
                        </div>
                    </div>
                </div>
            </form>

            {
                productRamData.length !== 0 &&
                <div className="row">
                    <div className="col-md-12">
                        <div className=" p-4 mt-0">
                            <div className="table-responsive mt-3">
                                <table className="table table-bordered v-align">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>PRODUCT RAM</th>
                                            <th width="25%">ACTION</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            productRamData.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.productRAM}</td>
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

export default AddproductRAMS;