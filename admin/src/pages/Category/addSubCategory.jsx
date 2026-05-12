import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from "@mui/material/Chip";
import { useNavigate } from 'react-router-dom';
import { emphasize, styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { MyContext } from '../../App';
import { useContext, useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { IoMdCloudUpload } from 'react-icons/io';
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';




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

const AddSubCategory = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [categoryVal, setCategoryVal] = useState('');
    const [formFields, setFormFields] = useState({
        category: '',
        subCat: '',
    });

    const history = useNavigate();
    const context = useContext(MyContext);

    const inputChange = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }))
    }

    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value);
        setFormFields(() => ({
            ...formFields,
            category: event.target.value
        }))
    };

    const addSubCat = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append('category', formFields.category);
        formdata.append('subCat', formFields.subCat);

        if (formFields.category === '') {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'select a Category'
            });
            return false;
        }
        if (formFields.subCat === '') {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Enter Sub Category Name'
            });
            return false;
        }
        postData('/api/subCat/create', formFields).then(res => {
            setIsLoading(false);
            history('/subCategory');
        });
    }


    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                <h5 className="mb-0">Add Sub Category</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <StyledBreadcrumb
                        component="a"
                        href="/"
                        label="Dashboard"
                        icon={<HomeIcon fontSize="small" />}
                    />
                    <StyledBreadcrumb
                        component="a"
                        label="category"
                        href="/category"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                    <StyledBreadcrumb
                        label="Add Sub Category"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                </Breadcrumbs>
            </div>

            <form className='form' onSubmit={addSubCat}>
                <div className="row">
                    <div className="col-sm-9">
                        <div className="card p-4 mt-0">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <h6>CATEGORY</h6>
                                        <Select
                                            value={categoryVal}
                                            onChange={handleChangeCategory}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            className='w-100'
                                            name='category'
                                        >
                                            <MenuItem value=""><em value={null}>None</em></MenuItem>
                                            {
                                                context.catdata?.categoryList?.length !== 0 && context.catdata?.categoryList?.map((cat, index) => {
                                                    return (
                                                        <MenuItem className='text-capitalize' value={cat.id} key={index} >{cat.name}</MenuItem>
                                                    )
                                                })
                                            }


                                        </Select>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="form-group">
                                        <h6>SUB CATEGORY</h6>
                                        <input type="text" name='subCat' value={formFields.subCat} onChange={inputChange} />
                                    </div>
                                </div>

                            </div>

                            <Button type='submit' className="btn-blue btn-big btn-lg w-100"><IoMdCloudUpload />&nbsp;{isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}</Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddSubCategory;