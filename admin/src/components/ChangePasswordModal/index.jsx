import React, { useContext, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { MdClose } from 'react-icons/md';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { postData } from '../../utils/api';
import { MyContext } from '../../App';

const ChangePasswordModal = ({ open, handleClose }) => {
    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formFields, setFormFields] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const onChangeInput = (e) => {
        setFormFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!formFields.oldPassword || !formFields.newPassword || !formFields.confirmPassword) {
            context.setAlertBox({ open: true, error: true, msg: "All fields are required" });
            return;
        }

        if (formFields.newPassword !== formFields.confirmPassword) {
            context.setAlertBox({ open: true, error: true, msg: "Passwords do not match" });
            return;
        }

        setIsLoading(true);
        postData(`/api/user/change-password/${context.user.userId}`, {
            oldPassword: formFields.oldPassword,
            newPassword: formFields.newPassword
        }).then(res => {
            setIsLoading(false);
            if (res.error === false) {
                context.setAlertBox({ open: true, error: false, msg: res.msg });
                handleClose();
                setFormFields({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                context.setAlertBox({ open: true, error: true, msg: res.msg || res.message || "An error occurred" });
            }
        });
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle className="d-flex align-items-center justify-content-between p-3">
                <span className="font-weight-bold">Change Password</span>
                <IconButton onClick={handleClose} size="small"><MdClose /></IconButton>
            </DialogTitle>
            <form onSubmit={handleFormSubmit}>
                <DialogContent dividers className="p-4">
                    <div className="form-group mb-3">
                        <TextField
                            fullWidth
                            type={showOldPassword ? "text" : "password"}
                            label="Old Password"
                            variant="outlined"
                            name="oldPassword"
                            value={formFields.oldPassword}
                            onChange={onChangeInput}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                                            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <TextField
                            fullWidth
                            type={showNewPassword ? "text" : "password"}
                            label="New Password"
                            variant="outlined"
                            name="newPassword"
                            value={formFields.newPassword}
                            onChange={onChangeInput}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                    <div className="form-group mb-0">
                        <TextField
                            fullWidth
                            type={showConfirmPassword ? "text" : "password"}
                            label="Confirm New Password"
                            variant="outlined"
                            name="confirmPassword"
                            value={formFields.confirmPassword}
                            onChange={onChangeInput}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                </DialogContent>
                <DialogActions className="p-3">
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" className="btn-blue" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : "Update Password"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ChangePasswordModal;
