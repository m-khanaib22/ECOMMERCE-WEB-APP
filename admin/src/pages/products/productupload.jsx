import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState, useRef } from 'react';
import Rating from '@mui/material/Rating';
import { IoMdCloudUpload } from "react-icons/io";
import Button from '@mui/material/Button';
import { MyContext } from '../../App';
import { useEffect } from 'react';
import { useContext } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import { FaRegImages } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";
import { deleteImages, fetchDataFromApi, postData } from '../../utils/api';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};



const ProductUpload = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [catdata, setCatData] = useState([]);
    const [categoryVal, setCategoryVal] = useState('');
    const [subCatVal, setSubCatVal] = useState('');

    const [ProductRams, setProductRams] = useState([]);
    const [ProductSize, setProductSize] = useState([]);
    const [ProductWeight, setProductWeight] = useState([]);

    const [ratingValue, setRatingValue] = useState(1);
    const [isFeaturedValue, setIsFeaturedValue] = useState("");

    const [imgFiles, setImgFiles] = useState();
    const [previews, setPreviews] = useState([]);
    const history = useNavigate();
    const [formFields, setFormFields] = useState({
        name: "",
        subCat: '',
        description: "",
        brand: "",
        price: null,
        oldPrice: null,
        category: "",
        subCatId: "",
        countInStock: null,
        rating: 0,
        catName: "",
        isFeatured: null,
        images: [],
        discount: null,
        productRAMS: [],
        productSIZE: [],
        productWEIGHT: [],
        location: []
    })

    // const productImages = useRef();
    const context = useContext(MyContext);

    // const formdata = new FormData();

    useEffect(() => {
        window.scrollTo(0, 0);
        setCatData(context.catdata);
    }, []);

    useEffect(() => {
        if (!imgFiles) return;
        let tmp = [];
        for (let i = 0; i < imgFiles.length; i++) {
            tmp.push(URL.createObjectURL(imgFiles[i]));
        }
        const objectUrls = tmp;
        setPreviews(objectUrls);

        for (let i = 0; i < objectUrls.length; i++) {
            return () => {
                URL.revokeObjectURL(objectUrls[i]);
            }
        }
    }, [imgFiles]);


    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value);
        setFormFields((prev) => ({
            ...prev,
            category: event.target.value,
            subCat: "",
            subCatId: ""
        }))
        setSubCatVal("");
    };

    const handleChangeProductRams = (event) => {
        const {
            target: { value },
        } = event;
        const selectedValues = typeof value === 'string' ? value.split(',') : value;
        setProductRams(selectedValues);
        setFormFields((prev) => ({
            ...prev,
            productRAMS: selectedValues
        }));
    };

    const handleChangeProductSize = (event) => {
        const {
            target: { value },
        } = event;
        const selectedValues = typeof value === 'string' ? value.split(',') : value;
        setProductSize(selectedValues);
        setFormFields((prev) => ({
            ...prev,
            productSIZE: selectedValues
        }));
    };

    const handleChangeProductWeight = (event) => {
        const {
            target: { value },
        } = event;
        const selectedValues = typeof value === 'string' ? value.split(',') : value;
        setProductWeight(selectedValues);
        setFormFields((prev) => ({
            ...prev,
            productWEIGHT: selectedValues
        }));

    };

    const handleChangeSubCategory = (event) => {
        setSubCatVal(event.target.value);
        setFormFields(() => ({
            ...formFields,
            subCat: event.target.value
        }))
        formFields.subCatId = event.target.value;
    };

    const handleChangeisFeaturedValue = (event) => {
        setIsFeaturedValue(event.target.value);
        setFormFields(() => ({
            ...formFields,
            isFeatured: event.target.value
        }))
    };

    const handleChangeLocation = (countries) => {
        setFormFields((prev) => ({
            ...prev,
            location: countries
        }))
    }

    useEffect(() => {
        if (context.selectedCountry) {
            setFormFields((prev) => ({
                ...prev,
                location: [context.selectedCountry]
            }))
        }
    }, [context.selectedCountry])

    const inputChange = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }))
    }

    const selectCat = (cat) => {
        setFormFields((prev) => ({
            ...prev,
            catName: cat
        }));
    }



    const onChangeFile = async (e, apiEndPoint) => {
        try {
            const files = e.target.files;
            const uploadFormData = new FormData();
            let hasValidFiles = false;

            for (var i = 0; i < files.length; i++) {
                if (files[i] && (files[i].type === 'image/jpeg' || files[i].type === 'image/png' || files[i].type === 'image/jpg' || files[i].type === 'image/webp')) {
                    uploadFormData.append(`images`, files[i]);
                    hasValidFiles = true;
                }
            }

            if (hasValidFiles) {
                setUploading(true);
                postData(apiEndPoint, uploadFormData).then((res) => {
                    setUploading(false);
                    if (res && Array.isArray(res)) {
                        setFormFields((prev) => ({
                            ...prev,
                            images: [...prev.images, ...res]
                        }));
                        setPreviews((prev) => [...prev, ...res]);
                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: 'Images uploaded successfully'
                        });
                    } else {
                        context.setAlertBox({
                            open: true,
                            error: true,
                            msg: res?.msg || 'Failed to upload images'
                        });
                    }
                }).catch(err => {
                    setUploading(false);
                    console.error(err);
                });
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'Please upload only JPEG or PNG images'
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

    const removeImage = (index, url) => {
        const publicId = url.split('/').pop().split('.')[0];
        deleteImages(`/api/products/delete-image?img=${publicId}`).then((res) => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Image deleted successfully!'
            });
        })

        const imgArr = previews.filter((item, i) => i !== index);
        setPreviews(imgArr);
        setFormFields((prev) => ({
            ...prev,
            images: imgArr
        }));
    }

    const addProduct = (e) => {
        e.preventDefault();

        console.log(formFields)

        if (!formFields.name ||
            !formFields.description ||
            !formFields.category ||
            !formFields.subCat ||
            !formFields.brand ||
            !formFields.price ||
            !formFields.oldPrice ||
            formFields.isFeatured === null ||
            !formFields.countInStock ||
            !formFields.rating) {

            context.setAlertBox({
                open: true,
                msg: 'Please fill all required fields',
                error: true
            });
            return;
        }

        setIsLoading(true);

        postData(`/api/products/create`, formFields).then((res) => {
            setIsLoading(false);
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Product uploaded successfully!'
            });
            history('/products');
        }).catch(err => {
            setIsLoading(false);
            console.log(err);
        });
    }


    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Product Upload</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="/"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            component="a"
                            label="Products"
                            href="products"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="Product Upload"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className='form' onSubmit={addProduct}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card p-4 mt-0">
                                <h5 className='mb-4 '>Basic Information</h5>
                                <div className="form-group">
                                    <h6>PRODUCT NAME</h6>
                                    <input type='text' name='name' value={formFields.name} onChange={inputChange} />
                                </div>
                                <div className="form-group">
                                    <h6>DESCRIPTION</h6>
                                    <textarea rows={5} cols={10} value={formFields.description} name='description' onChange={inputChange} />
                                </div>


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
                                            >
                                                <MenuItem value=""><em value={null}>None</em></MenuItem>
                                                {
                                                    context.catdata?.categoryList?.length !== 0 && context.catdata?.categoryList?.map((cat, index) => {
                                                        return (
                                                            <MenuItem className='text-capitalize' value={cat.id} key={index} onClick={() => selectCat(cat.name)} >{cat.name}</MenuItem>
                                                        )
                                                    })
                                                }

                                            </Select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>SUB CATEGORY</h6>
                                            <Select
                                                value={subCatVal}
                                                onChange={handleChangeSubCategory}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value=""><em value={null}>None</em></MenuItem>
                                                {
                                                    context.subCatData?.subCategoryList?.length !== 0 && context.subCatData?.subCategoryList?.filter(item => item?.category?.id === categoryVal).map((subCat, index) => {
                                                        return (
                                                            <MenuItem className='text-capitalize' value={subCat.id} key={index} >{subCat.subCat}</MenuItem>
                                                        )
                                                    })
                                                }


                                            </Select>
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PRICE</h6>
                                            <input type="text" name='price' value={formFields.price} onChange={inputChange} />
                                        </div>
                                    </div>

                                    {/* */}


                                </div>

                                <div className="row">



                                    <div className="col">
                                        <div className="form-group">
                                            <h6>OLD PRICE</h6>
                                            <input type="text" name='oldPrice' value={formFields.oldPrice} onChange={inputChange} />
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6 className='text-uppercase'>IS FEATURED</h6>
                                            <Select
                                                value={isFeaturedValue}
                                                onChange={handleChangeisFeaturedValue}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                <MenuItem value={true} >TRUE</MenuItem>
                                                <MenuItem value={false}>FALSE</MenuItem>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PRODUCT STOCK</h6>
                                            <input type="text" name='countInStock' value={formFields.countInStock} onChange={inputChange} />
                                        </div>
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>BRAND</h6>
                                            <input type="text" name='brand' value={formFields.brand} onChange={inputChange} />
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>DISCOUNT</h6>
                                            <input type="text" name='discount' value={formFields.discount} onChange={inputChange} />
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PRODUCT WEIGHT</h6>
                                            <Select
                                                multiple
                                                value={ProductWeight}
                                                onChange={handleChangeProductWeight}
                                                displayEmpty
                                                MenuProps={MenuProps}
                                                className='w-100'
                                            >
                                                {
                                                    context.productWEIGHTData?.map((item, index) => {
                                                        return (
                                                            <MenuItem className='text-capitalize' value={item.id} key={index}>{item.productWEIGHT}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PRODUCT RAMS</h6>
                                            <Select
                                                multiple
                                                value={ProductRams}
                                                onChange={handleChangeProductRams}
                                                displayEmpty
                                                className='w-100'
                                                MenuProps={MenuProps}
                                            >
                                                {
                                                    context.productRAMSData?.map((item, index) => {
                                                        return (
                                                            <MenuItem className='text-capitalize' value={item.id} key={index}>{item.productRAM}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PRODUCT SIZE</h6>
                                            <Select
                                                multiple
                                                value={ProductSize}
                                                onChange={handleChangeProductSize}
                                                displayEmpty
                                                MenuProps={MenuProps}
                                                className='w-100'
                                            >
                                                {
                                                    context.productSIZEData?.map((item, index) => {
                                                        return (
                                                            <MenuItem className='text-capitalize' value={item.id} key={index}>{item.productSIZE}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>RATINGS</h6>
                                            <Rating
                                                name='simple-controlled'
                                                value={ratingValue}
                                                onChange={(event, newValue) => {
                                                    setRatingValue(newValue);
                                                    setFormFields(() => ({
                                                        ...formFields,
                                                        rating: newValue
                                                    }))
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row location">
                                    <div className="col-md-3 ">
                                        <div className="form-group ">
                                            <h6>LOCATION</h6>
                                            {
                                                context.countryList?.length !== 0 && (
                                                    <Autocomplete
                                                        multiple
                                                        onChange={(event, newValue) => {
                                                            handleChangeLocation(newValue ? newValue.map(item => item.country) : []);
                                                        }}
                                                        options={context.countryList}
                                                        getOptionLabel={(option) => option.country || ""}
                                                        value={context.countryList.filter(item => formFields.location.includes(item.country)) || []}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                size="small"
                                                                variant="outlined"
                                                                placeholder="Select Locations"
                                                            />
                                                        )}
                                                    />
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="card p-4 mt-0">
                        <div className="imagesUploadSec">
                            <h5 className='mb-4'>Media And Published</h5>

                            <div className="imgUploadBox d-flex align-items-center">
                                {
                                    previews?.length !== 0 && previews?.map((img, index) => {
                                        return (
                                            <div className="uploadBox" key={index}>
                                                <span className='remove' onClick={() => removeImage(index, img)}><IoMdClose /></span>
                                                <img src={img} className='w-100' />
                                            </div>
                                        )
                                    })
                                }

                                {
                                    uploading === true &&
                                    <div className="uploadBox">
                                        <div className="progressBar">
                                            <CircularProgress />
                                        </div>
                                    </div>
                                }
                                <div className="uploadBox">
                                    <input type="file" multiple onChange={(e) => onChangeFile(e, '/api/products/upload')} name='images' />
                                    <div className="info">
                                        <FaRegImages />
                                        <h5>image upload</h5>
                                    </div>
                                </div>

                            </div>

                            <br />

                            <Button type='submit' className="btn-blue btn-big btn-lg w-100"><IoMdCloudUpload />&nbsp;{isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}</Button>

                        </div>
                    </div>

                </form>

            </div>
        </>
    )
}

export default ProductUpload;