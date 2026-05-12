import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { useEffect, useState } from 'react';
import { IoMdCloudUpload } from "react-icons/io";
import Button from '@mui/material/Button';
import { deleteImages, postData } from '../../utils/api';
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { FaRegImages } from 'react-icons/fa';
import { useContext } from 'react';
import { IoMdClose } from "react-icons/io";


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
const AddCategory = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        images: [],
        color: ''
    });

    const [files, setFiles] = useState([]);
    const [imgFiles, setImgFiles] = useState();
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);

    const formdata = new FormData();

    const history = useNavigate();

    const context = useContext(MyContext);

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

    const changeInput = (e) => {
        setFormFields(() => (
            {
                ...formFields,
                [e.target.name]: e.target.value
            }
        ))
    }

    const onChangeFile = async (e, apiEndPoint) => {
        try {
            const files = e.target.files;
            const uploadFormData = new FormData();
            let hasValidFiles = false;

            for (var i = 0; i < files.length; i++) {
                if (files[i] && (files[i].type === 'image/jpeg' || files[i].type === 'image/png' || files[i].type === 'image/jpg')) {
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
        deleteImages(`/api/category/delete-image?img=${publicId}`).then((res) => {
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


    const addCategory = (e) => {
        e.preventDefault();

        if (formFields.name !== "" && formFields.color !== "") {
            setIsLoading(true);

            postData('/api/category/create', formFields).then(res => {
                setIsLoading(false);
                history('/category');
            });
            context.fetchCategory();
        }
        else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please fill all the details'
            });

            return false;
        }
    }

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                    <h5 className="mb-0">Add Category</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="/"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            component="a"
                            label="Category"
                            href="/category"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="Add Category"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className='form' onSubmit={addCategory}>
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="card p-4 mt-0">
                                <div className="form-group">
                                    <h6>CATEGORY NAME</h6>
                                    <input type='text' name='name' value={formFields.name} onChange={changeInput} />
                                </div>


                                <div className="form-group">
                                    <h6>COLOR</h6>
                                    <input type='text' name='color' value={formFields.color} onChange={changeInput} />
                                </div>

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
                                            <input type="file" multiple onChange={(e) => onChangeFile(e, '/api/category/upload')} name='images' />
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
                        </div>
                    </div>

                </form>

            </div>
        </>
    )
}

export default AddCategory;