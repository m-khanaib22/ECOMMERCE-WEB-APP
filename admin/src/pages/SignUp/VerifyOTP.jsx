import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo.png';
import { MyContext } from '../../App';
import background from '../../assets/images/background.webp';
import { IoShieldCheckmark } from "react-icons/io5";
import Button from '@mui/material/Button';
import { IoMdHome } from "react-icons/io";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { postData } from '../../utils/api';
import CircularProgress from "@mui/material/CircularProgress";

const VerifyOTP = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [inputIndex, setInputIndex] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const context = useContext(MyContext);

    const email = location.state?.email;

    useEffect(() => {
        context.setIsHideSidebarAndHeader(true);
        if (!email) {
            navigate("/signUp");
        }
    }, [email, navigate, context]);

    const focusInput = (index) => {
        setInputIndex(index);
    }

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
                    navigate("/login");
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
        <>
            <img src={background} className='loginPatern' alt="" />
            <section className="loginSection signUpSection">
                <div className="row">
                    <div className="col-md-8 d-flex align-items-center flex-column part1 justify-content-center">
                        <h1>Welcome to <span className="text-sky">Ecommerce</span> Admin Panel!</h1>
                        <p>Verify your email to continue exploring the admin features.</p>
                        <div className="w-100 md-4">
                            <Link to="/"><Button className='btn-big btn-blue btn-lg'><IoMdHome /> Go To Home</Button></Link>
                        </div>
                    </div>
                    <div className="col-md-4 pr-0">
                        <div className="loginBox">
                            <div className="logo text-center">
                                <img src={Logo} alt="logo" width="80px" />
                                <h5 className="font-weight-bold">Verify OTP</h5>
                                <p>An OTP has been sent to <strong>{email}</strong></p>
                            </div>

                            <div className="wrapper mt-3 card border">
                                <form onSubmit={handleVerify}>
                                    <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                        <span className='icon'><IoShieldCheckmark /></span>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder='ENTER OTP' 
                                            onFocus={() => focusInput(0)} 
                                            onBlur={() => setInputIndex(null)} 
                                            autoFocus 
                                            value={otp} 
                                            onChange={(e) => setOtp(e.target.value)} 
                                        />
                                    </div>

                                    <div className="form-group">
                                        <Button type='submit' className="btn-blue btn-big btn-lg w-100">
                                            {isLoading === true ? <CircularProgress /> : "VERIFY OTP"}
                                        </Button>
                                    </div>

                                    <div className="form-group text-center mb-0">
                                        <Button className="mt-2" variant="text" onClick={handleResend} disabled={isLoading}>
                                            Resend OTP
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default VerifyOTP;
