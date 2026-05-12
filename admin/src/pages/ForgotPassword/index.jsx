import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo.png';
import { MyContext } from '../../App';
import background from '../../assets/images/background.webp';
import { MdEmail } from "react-icons/md";
import { FaLock, FaEye } from "react-icons/fa";
import { IoMdEyeOff } from 'react-icons/io';
import { RiShieldKeyholeFill } from "react-icons/ri";
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [isLoading, setIsLoading] = useState(false);
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        context.setIsHideSidebarAndHeader(true);
    }, []);

    const focusInput = (index) => {
        setInputIndex(index);
    }

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (email === "") {
            context.setAlertBox({ open: true, error: true, msg: "Please enter your email" });
            return;
        }

        setIsLoading(true);
        postData('/api/user/forgot-password', { email }).then(res => {
            setIsLoading(false);
            if (res.error === false) {
                context.setAlertBox({ open: true, error: false, msg: res.msg });
                setStep(2);
            } else {
                context.setAlertBox({ open: true, error: true, msg: res.msg || res.message || "An error occurred" });
            }
        });
    }

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (otp === "") {
            context.setAlertBox({ open: true, error: true, msg: "Please enter the OTP" });
            return;
        }

        setIsLoading(true);
        postData('/api/user/verify-forgot-password-otp', { email, otp }).then(res => {
            setIsLoading(false);
            if (res.error === false) {
                context.setAlertBox({ open: true, error: false, msg: res.msg });
                setStep(3);
            } else {
                context.setAlertBox({ open: true, error: true, msg: res.msg || res.message || "An error occurred" });
            }
        });
    }

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (newPassword === "" || confirmPassword === "") {
            context.setAlertBox({ open: true, error: true, msg: "Please fill all fields" });
            return;
        }
        if (newPassword !== confirmPassword) {
            context.setAlertBox({ open: true, error: true, msg: "Passwords do not match" });
            return;
        }

        setIsLoading(true);
        postData('/api/user/reset-password', { email, otp, newPassword }).then(res => {
            setIsLoading(false);
            if (res.error === false) {
                context.setAlertBox({ open: true, error: false, msg: res.msg });
                setTimeout(() => {
                    history("/login");
                }, 2000);
            } else {
                context.setAlertBox({ open: true, error: true, msg: res.msg || res.message || "An error occurred" });
            }
        });
    }

    return (
        <>
            <img src={background} className='loginPatern' alt="" />
            <section className="loginSection">
                <div className="loginBox">
                    <div className="logo text-center">
                        <img src={Logo} alt="logo" width="80px" />
                        <h5 className="font-weight-bold">
                            {step === 1 && "Forgot Password"}
                            {step === 2 && "Verify OTP"}
                            {step === 3 && "Reset Password"}
                        </h5>
                    </div>

                    <div className="wrapper mt-3 card border">
                        {step === 1 && (
                            <form onSubmit={handleEmailSubmit}>
                                <p className='text-center mb-4'>Enter your email address and we'll send you an OTP to reset your password.</p>
                                <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                    <span className='icon'><MdEmail /></span>
                                    <input type="email" className="form-control" placeholder='ENTER YOUR EMAIL' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <Button type='submit' className="btn-blue btn-big btn-lg w-100">{isLoading ? <CircularProgress color="inherit" size={24} /> : "SEND OTP"}</Button>
                                </div>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleOtpSubmit}>
                                <p className='text-center mb-4'>Enter the 6-digit OTP sent to <b>{email}</b></p>
                                <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                    <span className='icon'><RiShieldKeyholeFill /></span>
                                    <input type="text" className="form-control" placeholder='ENTER OTP' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus value={otp} onChange={(e) => setOtp(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <Button type='submit' className="btn-blue btn-big btn-lg w-100">{isLoading ? <CircularProgress color="inherit" size={24} /> : "VERIFY OTP"}</Button>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handlePasswordSubmit}>
                                <p className='text-center mb-4'>Enter your new password below.</p>
                                <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                    <span className='icon'><FaLock /></span>
                                    <input type={isShowPassword ? "text" : "password"} className="form-control" placeholder='NEW PASSWORD' onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                    <span className="toggleShowPassword" onClick={() => setIsShowPassword(!isShowPassword)}>
                                        {isShowPassword ? <FaEye /> : <IoMdEyeOff />}
                                    </span>
                                </div>
                                <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                                    <span className='icon'><FaLock /></span>
                                    <input type={isShowConfirmPassword ? "text" : "password"} className="form-control" placeholder='CONFIRM PASSWORD' onFocus={() => focusInput(2)} onBlur={() => setInputIndex(null)} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    <span className="toggleShowPassword" onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}>
                                        {isShowConfirmPassword ? <FaEye /> : <IoMdEyeOff />}
                                    </span>
                                </div>
                                <div className="form-group">
                                    <Button type='submit' className="btn-blue btn-big btn-lg w-100">{isLoading ? <CircularProgress color="inherit" size={24} /> : "RESET PASSWORD"}</Button>
                                </div>
                            </form>
                        )}

                        <div className="form-group text-center mb-0">
                            <Link to="/login" className='link color'>Back to Login</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ForgotPassword;
