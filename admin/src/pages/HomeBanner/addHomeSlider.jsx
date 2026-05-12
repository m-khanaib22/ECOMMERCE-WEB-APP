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
const AddHomeBannerSlider = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        image: ''
    });

    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);

    const history = useNavigate();

    const context = useContext(MyContext);

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
                            image: res[0]
                        }));
                        setPreviews(res);
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
        deleteImages(`/api/homeBanner/delete-image?img=${publicId}`).then((res) => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Image deleted successfully!'
            });
        })

        setPreviews([]);
        setFormFields((prev) => ({
            ...prev,
            image: ''
        }));
    }


    const addHomeBanner = (e) => {
        e.preventDefault();

        if (previews.length !== 0) {
            setIsLoading(true);

            const promises = previews.map(imgUrl => {
                return postData('/api/homeBanner/create', { image: imgUrl });
            });

            Promise.all(promises).then(res => {
                setIsLoading(false);
                history('/homeBanner');
            }).catch(err => {
                setIsLoading(false);
                console.error(err);
            });
        }
        else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please upload an image'
            });

            return false;
        }
    }

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
                    <h5 className="mb-0">Add Home Banner</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="/"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            component="a"
                            label="Home Banner"
                            href="/homeBanner"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="Add Home Banner"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className='form' onSubmit={addHomeBanner}>
                    <div className="row">
                        <div className="col-sm-9">
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

                                        {
                                            previews?.length === 0 &&
                                            <div className="uploadBox">
                                                <input type="file" multiple onChange={(e) => onChangeFile(e, '/api/homeBanner/upload')} name='images' />
                                                <div className="info">
                                                    <FaRegImages />
                                                    <h5>image upload</h5>
                                                </div>
                                            </div>
                                        }

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

export default AddHomeBannerSlider;
