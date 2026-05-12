import { useContext, useEffect, useState } from "react";
import logo from "../../assets/images/logo.jpg";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";

const VerifyOTP = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const context = useContext(MyContext);
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    useEffect(() => {
        context.setisHeaderFooterShow(false);
        if (!email) {
            navigate("/signup");
        }
    }, [email, navigate, context]);

    const handleVerify = (e) => {
        e.preventDefault();
        if (otp === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please enter the OTP"
            });
            return;
        }

        setIsLoading(true);
        postData("/api/user/verify-otp", { email, otp }).then((res) => {
            setIsLoading(false);
            if (res.error !== true) {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "Email verified successfully!"
                });
                setTimeout(() => {
                    navigate("/signin");
                }, 2000);
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res.msg
                });
            }
        }).catch(err => {
            setIsLoading(false);
            console.error(err);
        });
    }

    const handleResend = () => {
        setIsLoading(true);
        postData("/api/user/resend-otp", { email }).then((res) => {
            setIsLoading(false);
            if (res.error !== true) {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "OTP sent successfully!"
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
            console.error(err);
        });
    }

    return (
        <section className="section signInPage signUpPage">
            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center">
                        <img src={logo} alt="logo" />
                    </div>

                    <form className="mt-2" onSubmit={handleVerify}>
                        <h2 className="mb-3">Verify OTP</h2>
                        <p className="txt">An OTP has been sent to <strong>{email}</strong></p>

                        <div className="fom-group mb-3">
                            <TextField
                                label="OTP"
                                type="text"
                                variant="standard"
                                className="w-100"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="d-flex align-items-center mt-3 mb-3">
                            <Button className="btn-blue w-100 btn-lg btn-big" type="submit" disabled={isLoading}>
                                {isLoading === true ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
                            </Button>
                        </div>

                        <p className="txt text-center">
                            Didn't receive the code? &nbsp;
                            <span className="border-effect cursor" onClick={handleResend} style={{ color: '#3f51b5', fontWeight: 'bold' }}>
                                Resend OTP
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default VerifyOTP;
