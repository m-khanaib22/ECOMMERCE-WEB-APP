import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../../App";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { IoMdCamera } from "react-icons/io";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import { fetchDataFromApi, postData, editData, deleteData } from "../../utils/api";

const getPublicIdFromCloudinaryUrl = (url) => {
    if (!url) return null;
    const urlParts = url.split('/');
    const filename = urlParts.pop();
    if (!filename) return null;
    return filename.split('.')[0];
};

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const MyAccount = () => {

    const [isLogin, setIsLogin] = useState(false);
    const context = useContext(MyContext);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [userData, setUserData] = useState(null);
    const history = useNavigate();
    const formdata = new FormData();
    const [value, setValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        images: [],
        phone: ''
    });

    const [passwordFields, setPasswordFields] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    // let { id } = useParams(); // Removed as the route doesn't provide it
    const userId = context.user?.userId;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
        } else {
            history("/login");
        }

        if (userId) {
            setIsLoading(true);
            fetchDataFromApi(`/api/user/${userId}`).then((res) => {
                setIsLoading(false);
                if (res && !res.error) {
                    setUserData(res);
                    setPreviews(res.images || []);
                    setFormFields({
                        name: res.name || "",
                        email: res.email || "",
                        phone: res.phone || "",
                        images: res.images || []
                    });
                }
            }).catch(err => {
                setIsLoading(false);
                console.log("Error fetching user data", err);
            });
        }
    }, [userId]);

    const changeInput = (e) => {
        setFormFields(() => (
            {
                ...formFields,
                [e.target.name]: e.target.value
            }
        ))
    }

    const changeInputChangePassword = (e) => {
        setPasswordFields(() => (
            {
                ...passwordFields,
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

                // Delete old image if exists
                if (previews && previews.length > 0) {
                    const oldImageUrl = previews[0];
                    const publicId = getPublicIdFromCloudinaryUrl(oldImageUrl);

                    if (publicId) {
                        deleteData(`/api/user/delete-image?img=${publicId}`).then((res) => {
                            console.log("Old image deletion attempt:", res);
                        });
                    }
                }

                postData(apiEndPoint, uploadFormData).then((res) => {
                    setUploading(false);
                    if (res && Array.isArray(res)) {
                        setFormFields((prev) => ({
                            ...prev,
                            images: res
                        }));
                        setPreviews(res);
                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: 'Profile image updated successfully'
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

    const changePassword = (e) => {
        e.preventDefault();

        if (passwordFields.oldPassword === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Old password is required!'
            });
            return;
        }
        if (passwordFields.newPassword === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'New password is required!'
            });
            return;
        }
        if (passwordFields.confirmPassword === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Confirm password is required!'
            });
            return;
        }
        if (passwordFields.newPassword !== passwordFields.confirmPassword) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Passwords do not match!'
            });
            return;
        }

        setIsLoading(true);
        postData(`/api/user/change-password/${userId}`, {
            oldPassword: passwordFields.oldPassword,
            newPassword: passwordFields.newPassword
        }).then(res => {
            setIsLoading(false);
            if (!res.error) {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: res.msg
                });
                setPasswordFields({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res.msg
                });
            }
        }).catch(err => {
            setIsLoading(false);
            console.log(err);
        });
    }

    const removeImage = (index, url) => {
        const publicId = getPublicIdFromCloudinaryUrl(url);

        if (publicId) {
            deleteData(`/api/user/delete-image?img=${publicId}`).then((res) => {
                if (res && !res.error) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: 'Image deleted successfully!'
                    });
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg || 'Failed to delete image!'
                    });
                }
            }).catch(err => {
                console.error("Error deleting image:", err);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'Error deleting image!'
                });
            });
        } else {
            console.warn("Could not extract public ID from URL:", url);
        }

        const imgArr = previews.filter((item, i) => i !== index);
        setPreviews(imgArr);
        setFormFields((prev) => ({
            ...prev,
            images: imgArr
        }));
    }

    const edituser = (e) => {
        e.preventDefault();

        if (formFields.name === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Name is required!'
            });
            return;
        }
        if (formFields.email === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Email is required!'
            });
            return;
        }
        if (formFields.phone === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Phone number is required!'
            });
            return;
        }

        setIsLoading(true);

        const updatedData = {
            ...formFields,
            images: previews // Ensure we use current previews
        }

        editData(`/api/user/${userId}`, updatedData).then(res => {
            setIsLoading(false);
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'User updated successfully!'
            });
        }).catch(err => {
            setIsLoading(false);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Something went wrong!'
            });
            console.log(err);
        })
    }


    return (
        <section className="section myAccountPage">
            <div className="container">
                <h2 className="hd mb-1">My Account</h2>
                <Box sx={{ width: '100%' }} className="myAccBox card border-0">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Edit Profile" {...a11yProps(0)} />
                            <Tab label="Change Password" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <form onSubmit={edituser}>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="userImage">
                                        {
                                            previews?.length > 0 ?
                                                <img src={previews[0]} alt="" />
                                                :
                                                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" />
                                        }
                                        <div className="overlay d-flex align-items-center justify-content-center"><IoMdCamera />
                                            <input type="file" onChange={(e) => onChangeFile(e, '/api/user/upload')} name='images' /></div>
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <TextField label="Name" variant="outlined" className="w-100" name="name" onChange={changeInput} value={formFields.name} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <TextField label="Email" disabled variant="outlined" className="w-100" name="email" value={formFields.email} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <TextField label="Phone" variant="outlined" className="w-100" name="phone" onChange={changeInput} value={formFields.phone} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="form-group">
                                        <Button type="submit" variant="contained" className="btn-blue btn-big btn-lg bg-red">Save</Button>
                                    </div>
                                </div>


                            </div>
                        </form>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <form onSubmit={changePassword}>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <TextField label="Old Password" type="password" variant="outlined" className="w-100" name="oldPassword" value={passwordFields.oldPassword} onChange={changeInputChangePassword} />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <TextField label="New Password" type="password" variant="outlined" className="w-100" name="newPassword" value={passwordFields.newPassword} onChange={changeInputChangePassword} />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <TextField label="Confirm Password" type="password" variant="outlined" className="w-100" name="confirmPassword" value={passwordFields.confirmPassword} onChange={changeInputChangePassword} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="form-group">
                                        <Button type="submit" variant="contained" className="btn-blue btn-big btn-lg bg-red">
                                            {isLoading === true ? <CircularProgress /> : "Change Password"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CustomTabPanel>
                </Box>
            </div>
        </section>
    )
}

export default MyAccount;