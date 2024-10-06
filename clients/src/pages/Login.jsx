import React, { useEffect, useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { googleAuth, loginUser, validUser } from '../apis/auth';
import { Link, useNavigate } from 'react-router-dom';
import { BsEmojiLaughing, BsEmojiExpressionless } from 'react-icons/bs';
import { toast } from 'react-toastify';

const defaultData = {
  email: "",
  password: ""
};

function Login() {
  const [formData, setFormData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const pageRoute = useNavigate();

  // Google Login Success Handler
  const googleSuccess = async (res) => {
    if (res?.profileObj) {
      setIsLoading(true);
      try {
        const response = await googleAuth({ tokenId: res.tokenId });
        if (response.data.token) {
          localStorage.setItem("userToken", response.data.token);
          pageRoute("/chats");
        } else {
          toast.error("Google Login failed. Please try again.");
        }
      } catch (error) {
        toast.error("Google Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Google Login Failure Handler
  const googleFailure = () => {
    toast.error("Google Login Failed! Please try again.");
  };

  // Handle Input Change
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form Submit Handler
  const formSubmit = async (e) => {
    e.preventDefault();
    // Basic Email Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email validation
    if (emailPattern.test(formData.email) && formData.password.length > 6) {
      setIsLoading(true);
      try {
        const { data } = await loginUser(formData);
        if (data?.token) {
          localStorage.setItem("userToken", data.token);
          toast.success("Successfully Logged In!");
          pageRoute("/chats");
        } else {
          toast.error("Invalid Credentials!");
          setFormData({ ...formData, password: "" });
        }
      } catch (error) {
        toast.error("Login failed. Please check your credentials.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warning("Please provide valid credentials!");
      setFormData(defaultData);
    }
  };

  // Google API Client Initialization
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope: ''
      });
    };
    gapi.load('client:auth2', initClient);
    
    // Check if user is already valid
    const isValidUser = async () => {
      const data = await validUser();
      if (data?.user) {
        window.location.href = "/chats";
      }
    };
    isValidUser();
  }, []);

  return (
    <div className='bg-white w-[100vw] h-[100vh] flex justify-center items-center'>
      <div className='w-[90%] sm:w-[400px] pl-0 ml-0 h-[400px] sm:pl-0 sm:ml-9 mt-20 relative'>
        <div className='absolute -top-5 left-0'>
          <h3 className='text-[25px] font-bold tracking-wider text-[#000]'>Login</h3>
          <p className='text-[#000] text-[12px] tracking-wider font-medium'>
            No Account? <Link className='text-[rgba(0,195,154,1)] underline' to="/register">Sign up</Link>
          </p>
        </div>
        <form className='flex flex-col gap-y-3 mt-[12%]' onSubmit={formSubmit}>
          <div>
            <input
              className="w-[100%] sm:w-[80%] bg-[#f1f1f1] h-[50px] pl-3 text-[#000]"
              onChange={handleOnChange}
              name="email"
              type="text"
              placeholder='Email'
              value={formData.email}
              required
            />
          </div>
          <div className='relative'>
            <input
              className='w-[100%] sm:w-[80%] bg-[#f1f1f1] h-[50px] pl-3 text-[#000]'
              onChange={handleOnChange}
              type={showPass ? "text" : "password"}
              name="password"
              placeholder='Password'
              value={formData.password}
              required
            />
            {
              !showPass ? (
                <button type='button' onClick={() => setShowPass(!showPass)}>
                  <BsEmojiLaughing className='text-[#000] absolute top-3 right-5 sm:right-24 w-[30px] h-[25px]' />
                </button>
              ) : (
                <button type='button' onClick={() => setShowPass(!showPass)}>
                  <BsEmojiExpressionless className='text-[#000] absolute top-3 right-5 sm:right-24 w-[30px] h-[25px]' />
                </button>
              )
            }
          </div>
          <button
            style={{ background: "linear-gradient(90deg, rgba(0,195,154,1) 0%, rgba(224,205,115,1) 100%)" }}
            className='w-[100%] sm:w-[80%] h-[50px] font-bold text-[#121418] tracking-wide text-[17px] relative'
            type='submit'
          >
            {isLoading && (
              <div className='absolute -top-[53px] left-[27%] sm:-top-[53px] sm:left-[56px]'>
                <lottie-player
                  src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json"
                  background="transparent"
                  speed="1"
                  style={{ width: "200px", height: "160px" }}
                  loop
                  autoplay
                ></lottie-player>
              </div>
            )}
            <p style={{ display: isLoading ? "none" : "block" }} className='test-[#fff]'>Login</p>
          </button>
          <p className='text-[#000] text-center sm:-ml-20'>/</p>
          <GoogleLogin
            clientId={process.env.REACT_APP_CLIENT_ID}
            render={(renderProps) => (
              <button
                style={{
                  borderImage: "linear-gradient(to right, rgba(0,195,154,1) 50%, rgba(224,205,115,1) 80%)",
                  borderImageSlice: "1"
                }}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                aria-label="Continue with Google"
                className="focus:ring-2 focus:ring-offset-1 py-3.5 px-4 border rounded-lg flex items-center w-[100%] sm:w-[80%]"
              >
                <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg" alt="google" />
                <p className="text-[base] font-medium ml-4 text-[#000]">Continue with Google</p>
              </button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy={'single_host_origin'}
            scope="profile email https://www.googleapis.com/auth/user.birthday.read"
          />
        </form>
      </div>
    </div>
  );
}

export default Login;
