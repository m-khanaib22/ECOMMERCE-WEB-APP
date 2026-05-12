import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo.png';
import { MyContext } from '../../App';
import background from '../../assets/images/background.webp';
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from 'react-icons/io';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import googleImg from '../../assets/images/googleImg.png';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";


const Login = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const context = useContext(MyContext)
  const history = useNavigate();

  const [formdFields, setFormFields] = useState({
    email: "",
    password: "",
    isAdmin: true
  })

  useEffect(() => {
    context.setIsHideSidebarAndHeader(true);
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

  const signIn = (e) => {
    e.preventDefault();

    if (formdFields.email === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "email cannot be blank"
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

    setIsLoading(true)
    postData(`/api/user/signin`, formdFields).then((res) => {

      try {
        if (res.error !== true) {
          localStorage.setItem("token", res.token);
          const user = {
            name: res.user?.name,
            email: res.user?.email,
            userId: res.user?.id
          }

          localStorage.setItem("user", JSON.stringify(user));

          context.setAlertBox({
            open: true,
            error: false,
            msg: "User Login Successfully"
          })

          setTimeout(() => {
            // history("/dashboard")
            setIsLoading(false)
            window.location.href = "/dashboard"
          }, 2000);
        } else {
          setIsLoading(false)
          context.setAlertBox({
            open: true,
            error: true,
            msg: res.msg
          })
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }

    })

  }

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then(async (result) => {
      const user = result.user;
      const idToken = await user.getIdToken();
      console.log("Firebase ID Token:", idToken);

      setIsLoading(true);
      postData(`/api/user/google-signin`, { idToken, isAdmin: true }).then((res) => {
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
      <section className="loginSection">
        <div className="loginBox">
          <div className="logo text-center">
            <img src={Logo} alt="logo" width="80px" />
            <h5 className="font-weight-bold">Login to Ecommerce </h5>
          </div>

          <div className="wrapper mt-3 card border ">
            <form onSubmit={signIn}>
              <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                <span className='icon'><MdEmail /></span>
                <input type="text" className="form-control" placeholder='ENTER YOUR EMAIL' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus name='email' onChange={onchangeInput} />
              </div>
              <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                <span className='icon'><FaLock /></span>
                <input type={`${isShowPassword === true ? 'text' : 'password'}`} className="form-control" placeholder='ENTER YOUR PASSWORD' onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} name='password' onChange={onchangeInput} />
                <span className="toggleShowPassword" onClick={() => setIsShowPassword(!isShowPassword)}>
                  {
                    isShowPassword === false ? <IoMdEyeOff /> : <FaEye />
                  }
                </span>

              </div>

              <div className="form-group">
                <Button type='submit' className="btn-blue btn-big btn-lg w-100">{isLoading === true ? <CircularProgress /> : "SIGN IN"}</Button>
              </div>

              <div className="form-group text-center mb-0">
                <Link to="/forgot-password" className='link'>Forgot Password?</Link>
                <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                  <span className="line"></span>
                  <span className="txt">or</span>
                  <span className="line"></span>
                </div>

                <Button className="loginWithGoogle mt-2" variant="outlined" onClick={signInWithGoogle}><img src={googleImg} alt="" />SignIn With Google</Button>

              </div>

            </form>
          </div>

          <div className="wrapper mt-3 card border footer p-3">
            <span className="text-center">
              Don't have an account? &nbsp;
              <Link to="/signUp" className='link color ml-2'>Register</Link>
            </span>
          </div>

        </div>
      </section>
    </>
  )
}

export default Login;