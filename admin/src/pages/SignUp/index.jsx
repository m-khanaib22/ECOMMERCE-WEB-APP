import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo.png';
import { MyContext } from '../../App';
import background from '../../assets/images/background.webp';
import { MdEmail } from "react-icons/md";
import { FaLock, FaPhoneAlt, FaUserCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from 'react-icons/io';
import { IoShieldCheckmark } from "react-icons/io5";
import Button from '@mui/material/Button';
import { IoMdHome } from "react-icons/io";
import { Link } from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import googleImg from '../../assets/images/googleImg.png';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

const SignUp = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const [formdFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: true
  })

  const history = useNavigate();

  const context = useContext(MyContext)

  useEffect(() => {
    context.setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
  }, []);

  const focusInput = (index) => {
    setInputIndex(index);
  }

  const onchangeInput = (e) => {
    setFormFields(() => ({
      ...formdFields,
      [e.target.name]: e.target.value
    }))
  }

  const signUp = (e) => {

    e.preventDefault();
    try {
      if (formdFields.name === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "name cannot be blank"
        })
        return false;
      }
      if (formdFields.email === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "email cannot be blank"
        })
        return false;
      }
      if (formdFields.phone === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "phone number cannot be blank"
        })
        return false;
      }
      if (formdFields.password === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "password cannot be blank"
        })
        return false;
      }
      if (formdFields.confirmPassword === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "confirm password"
        })
        return false;
      }
      if (formdFields.confirmPassword !== formdFields.password) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "password not matched"
        })
        return false;
      }
      setIsLoading(true)
      postData(`/api/user/signup`, formdFields).then((res) => {

        if (res.error !== true) {
          context.setAlertBox({
            open: true,
            error: false,
            msg: "Register Successfully"
          })
          setTimeout(() => {
            setIsLoading(false)
            history("/verify-otp", { state: { email: formdFields.email } })
          }, 2000);
        }

        else {
          setIsLoading(false)
          context.setAlertBox({
            open: true,
            error: true,
            msg: res.msg
          })
        }

      }).catch(error => {
        setIsLoading(false)
        console.log(`Error posting data`, error);
      });

    } catch (error) {
      console.log(error)
    }
  }

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then(async (result) => {
      const user = result.user;
      const idToken = await user.getIdToken();
      console.log("Firebase ID Token:", idToken);

      setIsLoading(true);
      postData(`/api/user/google-signin`, { idToken }).then((res) => {
        if (res.error !== true) {
          localStorage.setItem("token", res.token);
          const userData = {
            name: res.user?.name,
            email: res.user?.email,
            userId: res.user?.id
          }
          localStorage.setItem("user", JSON.stringify(userData));
          context.setAlertBox({
            open: true,
            error: false,
            msg: "User Login Successfully"
          })
          setTimeout(() => {
            setIsLoading(false)
            window.location.href = "/"
          }, 2000);
        } else {
          setIsLoading(false)
          context.setAlertBox({
            open: true,
            error: true,
            msg: res.msg || "Server Error"
          })
        }
      }).catch(err => {
        setIsLoading(false);
        console.error("Backend Error:", err);
        context.setAlertBox({
          open: true,
          error: true,
          msg: err.message
        })
      })
    }).catch((error) => {
      console.error("Firebase Auth Error:", error);
      context.setAlertBox({
        open: true,
        error: true,
        msg: error.message
      })
    });
  }

  return (
    <>
      <img src={background} className='loginPatern' alt="" />
      <section className="loginSection signUpSection">

        <div className="row">
          <div className="col-md-8 d-flex align-items-center flex-column part1 justify-content-center">
            <h1>Welcome to <span className="text-sky">Ecommerce</span>  Admin Panel!</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, adipisci sed rem soluta officiis natus placeat at debitis qui veniam non earum. Modi dolor veniam eos cum possimus quibusdam ipsum et temporibus?</p>
            <div className="w-100 md-4">
              <Link to="/"><Button className='btn-big btn-blue btn-lg'><IoMdHome /> Go To Home</Button></Link>
            </div>
          </div>
          <div className="col-md-4 pr-0">
            <div className="loginBox">
              <div className="logo text-center">
                <img src={Logo} alt="logo" width="80px" />
                <h5 className="font-weight-bold">Register a new account</h5>
              </div>

              <div className="wrapper mt-3 card border ">
                <form onSubmit={signUp}>
                  <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                    <span className='icon'><FaUserCircle /></span>
                    <input type="text" className="form-control" placeholder='ENTER YOUR NAME' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus name='name' onChange={onchangeInput} />
                  </div>
                  <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                    <span className='icon'><MdEmail /></span>
                    <input type="text" className="form-control" placeholder='ENTER YOUR EMAIL' onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} name='email' onChange={onchangeInput} />
                  </div>
                  <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                    <span className='icon'><FaPhoneAlt /></span>
                    <input type="text" className="form-control" placeholder='ENTER YOUR PHONE' onFocus={() => focusInput(2)} onBlur={() => setInputIndex(null)} name='phone' onChange={onchangeInput} />
                  </div>
                  <div className={`form-group position-relative ${inputIndex === 3 && 'focus'}`}>
                    <span className='icon'><FaLock /></span>
                    <input type={`${isShowPassword === true ? 'text' : 'password'}`} className="form-control" placeholder='ENTER YOUR PASSWORD' onFocus={() => focusInput(3)} onBlur={() => setInputIndex(null)} name='password' onChange={onchangeInput} />
                    <span className="toggleShowPassword" onClick={() => setIsShowPassword(!isShowPassword)}>
                      {
                        isShowPassword === false ? <IoMdEyeOff /> : <FaEye />
                      }
                    </span>

                  </div>
                  <div className={`form-group position-relative ${inputIndex === 4 && 'focus'}`}>
                    <span className='icon'><IoShieldCheckmark /></span>
                    <input type={`${isShowConfirmPassword === true ? 'text' : 'password'}`} className="form-control" placeholder='CONFIRM YOUR PASSWORD' onFocus={() => focusInput(4)} onBlur={() => setInputIndex(null)} name='confirmPassword' onChange={onchangeInput} />
                    <span className="toggleShowPassword" onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}>
                      {
                        isShowConfirmPassword === false ? <IoMdEyeOff /> : <FaEye />
                      }
                    </span>

                  </div>

                  <FormControlLabel control={<Checkbox />} label="I agree to the Terms & Conditions" />

                  <div className="form-group">
                    <Button type='submit' className="btn-blue btn-big btn-lg w-100">{isLoading === true ? <CircularProgress /> : "SIGN UP"}</Button>
                  </div>

                  <div className="form-group text-center mb-0">
                    <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                      <span className="line"></span>
                      <span className="txt">or</span>
                      <span className="line"></span>
                    </div>

                    <Button className="loginWithGoogle mt-2" variant="outlined" onClick={signInWithGoogle}><img src={googleImg} alt="" />SignIn With Google</Button>

                  </div>

                </form>

                <span className="text-center d-block mt-3">
                  Already have an account? &nbsp;
                  <Link to="/login" className='link color ml-2'>Sign In</Link>
                </span>

              </div>

            </div>
          </div>
        </div>


      </section>
    </>
  )
}
export default SignUp;