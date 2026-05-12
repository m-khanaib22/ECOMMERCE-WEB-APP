import { useContext, useEffect, useState } from "react";
import logo from "../../assets/images/logo.jpg";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from "../../utils/api";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        context.setisHeaderFooterShow(false);
    }, []);

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
                    history("/signin");
                }, 2000);
            } else {
                context.setAlertBox({ open: true, error: true, msg: res.msg || res.message || "An error occurred" });
            }
        });
    }

    return (
        <section className="section signInPage">
            <div className="shape-bottom"> 
                <svg fill="#fff" id="Layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8" style={{ enableBackground: 'new 0 0 1921 819.8' }} > 
                    <path className="st0" d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,48.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path> 
                </svg>
            </div>
            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center">
                        <img src={logo} alt="logo" />
                    </div>

                    <form className="mt-3">
                        <h2 className="mb-4">
                            {step === 1 && "Forgot Password"}
                            {step === 2 && "Verify OTP"}
                            {step === 3 && "Reset Password"}
                        </h2>

                        {step === 1 && (
                            <>
                                <p className="mb-3">Enter your email to receive an OTP.</p>
                                <div className="fom-group mb-3">
                                    <TextField label="Email" type="email" variant="standard" className="w-100" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="d-flex align-items-center mt-3 mb-3">
                                    <Button className="btn-blue col btn-lg btn-big" onClick={handleEmailSubmit}>
                                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                                    </Button>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <p className="mb-3">Enter the OTP sent to <b>{email}</b></p>
                                <div className="fom-group mb-3">
                                    <TextField label="OTP" type="text" variant="standard" className="w-100" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                </div>
                                <div className="d-flex align-items-center mt-3 mb-3">
                                    <Button className="btn-blue col btn-lg btn-big" onClick={handleOtpSubmit}>
                                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
                                    </Button>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <p className="mb-3">Enter your new password.</p>
                                <div className="fom-group mb-3">
                                    <TextField label="New Password" type="password" variant="standard" className="w-100" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </div>
                                <div className="fom-group mb-3">
                                    <TextField label="Confirm Password" type="password" variant="standard" className="w-100" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                                <div className="d-flex align-items-center mt-3 mb-3">
                                    <Button className="btn-blue col btn-lg btn-big" onClick={handlePasswordSubmit}>
                                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
                                    </Button>
                                </div>
                            </>
                        )}

                        <p className="txt"><Link to="/signin" className="border-effect">Back to Sign In</Link></p>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default ForgotPassword;
