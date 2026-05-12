import { useContext, useEffect, useState } from "react";
import logo from "../../assets/images/logo.jpg";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import GoogleImg from "../../assets/images/googleImg.png";
import { postData } from "../../utils/api";
import { useNavigate } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

const SignUp = () => {

  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);
  const history = useNavigate();

  const [formdFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false
  })

  const onchangeInput = (e) => {
    setFormFields(() => ({
      ...formdFields,
      [e.target.name]: e.target.value
    }))
  }


  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);

  const register = (e) => {
    console.log(formdFields)
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

      //   if (formdFields.confirmPassword !== formdFields.password) {
      //     context.setAlertBox({
      //       open: true,
      //       error: true,
      //       msg: "password not matched"
      //     })
      //     return false;
      //   }

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
    <section className="section signInPage signUpPage">
      <div className="shape-bottom"> <svg fill="#fff" id="Layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8" style={{ enableBackground: 'new 0 0 1921 819.8' }} > <path class="st0" d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,48.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z">
      </path> </svg>
      </div>
      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center">
            <img src={logo} alt="logo" />
          </div>



          <form className="mt-2" onSubmit={register}>
            <h2 className="mb-3">Sign Up</h2>
            <div className="row">
              <div className="col-md-6">
                <div className="fom-group ">
                  <TextField label="Name" name="name" onChange={onchangeInput} type="text" variant="standard" className="w-100" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="fom-group ">
                  <TextField label="Phone No." name="phone" onChange={onchangeInput} type="text" variant="standard" className="w-100" />
                </div>
              </div>
            </div>
            <div className="fom-group ">
              <TextField id="standard-basic" label="Email" type="email" name="email" onChange={onchangeInput} variant="standard" className="w-100" />
            </div>
            <div className="fom-group mb-3">
              <TextField id="standard-basic" label="Password" type="password" name="password" onChange={onchangeInput} required variant="standard" className="w-100" />
            </div>

            <a className="border-effect cursor txt">Forgot Password?</a>

            <div className="d-flex align-items-center mt-3 mb-3">
              <div className="row w-100">
                <div className="col-md-6" >
                  <Button className="btn-blue w-100 btn-lg btn-big" disabled={isLoading === true ? true : false} type="submit">
                    {
                      isLoading === true ? <CircularProgress /> : "Sign Up"
                    }</Button></div>
                <div className="col-md-6 pr-0"><Link to="/" className="d-block w-100"><Button className="btn-lg btn-big w-100" variant='outlined' onClick={() => context.setisHeaderFooterShow(true)}>Cancel</Button></Link></div>
              </div>

            </div>

            <p className="txt">Not Registered?<Link to="/signIn" className="border-effect ">Sign In</Link></p>

            <Button className="loginWithGoogle mt-2" variant="outlined" onClick={signInWithGoogle}><img src={GoogleImg} alt="" />SignIn With Google</Button>



          </form>


        </div>
      </div>
    </section>
  );
}

export default SignUp;