import { useContext, useEffect, useState } from "react";
import logo from "../../assets/images/logo.jpg";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import GoogleImg from "../../assets/images/googleImg.png";
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from "../../utils/api";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

const SignIn = () => {

  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);

  const [formdFields, setFormFields] = useState({
    email: "",
    password: ""
  })

  const onchangeInput = (e) => {
    setFormFields(() => ({
      ...formdFields,
      [e.target.name]: e.target.value
    }))
  }

  const login = (e) => {
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
            window.location.href = "/"
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
    <section className="section signInPage">
      <div className="shape-bottom"> <svg fill="#fff" id="Layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8" style={{ enableBackground: 'new 0 0 1921 819.8' }} > <path class="st0" d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,48.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z">
      </path> </svg>
      </div>
      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center">
            <img src={logo} alt="logo" />
          </div>



          <form className="mt-3" onSubmit={login}>
            <h2 className="mb-4">Sign In</h2>
            <div className="fom-group ">
              <TextField id="standard-basic" label="Email" type="email" required variant="standard" className="w-100" name='email' onChange={onchangeInput} />
            </div>
            <div className="fom-group mb-3">
              <TextField id="standard-basic" label="Password" type="password" required variant="standard" className="w-100" name='password' onChange={onchangeInput} />
            </div>

            <Link to="/forgot-password"><Button className="border-effect cursor txt p-0" style={{ textTransform: 'none' }}>Forgot Password?</Button></Link>

            <div className="d-flex align-items-center mt-3 mb-3 ">
              <Button type="submit" className="btn-blue col btn-lg btn-big">
                {
                  isLoading === true ? <CircularProgress /> : "Sign In"
                }
              </Button>
              <Link to="/"><Button className="btn-lg btn-big col ml-3" variant='outlined' onClick={() => context.setisHeaderFooterShow(true)}>Cancel</Button></Link>
            </div>

            <p className="txt">Not Registered?<Link to="/signup" className="border-effect ">Sign Up</Link></p>

            <Button className="loginWithGoogle mt-2" variant="outlined" onClick={signInWithGoogle}><img src={GoogleImg} alt="" />SignIn With Google</Button>



          </form>


        </div>
      </div>
    </section>
  );
}

export default SignIn;