import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { googleAuth, registerUser, validUser } from '../apis/auth';
import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs";
import { toast } from 'react-toastify';

const defaultData = {
  firstname: "",
  lastname: "",
  email: "",
  password: ""
};

function Register() {
  const [formData, setFormData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email and password
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(formData.email) && formData.password.length > 6) {
      try {
        const { data } = await registerUser(formData);
        if (data?.token) {
          localStorage.setItem("userToken", data.token);
          toast.success("Successfully Registered😍");
          navigate("/chats");
        } else {
          toast.error("Invalid Credentials!");
        }
      } catch (error) {
        toast.error("Registration failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warning("Provide valid Credentials!");
      setFormData({ ...formData, password: "" });
      setIsLoading(false);
    }
  };

  const googleSuccess = async (res) => {
    setIsLoading(true);
    try {
      const response = await googleAuth({ tokenId: res.tokenId });
      if (response.data.token) {
        localStorage.setItem("userToken", response.data.token);
        navigate("/chats");
      }
    } catch (error) {
      toast.error("Something Went Wrong. Try Again!");
    } finally {
      setIsLoading(false);
    }
  };

  const googleFailure = () => {
    toast.error("Something Went Wrong. Try Again!");
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope: ''
      });
    };
    gapi.load('client:auth2', initClient);
    const checkValidUser = async () => {
      const data = await validUser();
      if (data?.user) {
        window.location.href = "/chats";
      }
    };
    checkValidUser();
  }, []);

  return (
    <div className='bg-white w-[100vw] h-[100vh] flex justify-center items-center'>
      <div className='w-[90%] sm:w-[400px] pl-0 ml-0 h-[400px] sm:pl-0 sm:ml-9 mt-10 relative'>
        <div className='absolute -top-7 left-0'>
          <h3 className=' text-[25px] font-bold tracking-wider text-[#121418]'>Register</h3>
          <p className='text-[#121418] text-[12px] tracking-wider font-medium'>
            Have an Account? <Link className='text-[rgba(0,195,154,1)] underline' to="/login">Sign in</Link>
          </p>
        </div>
        <form className='flex flex-col gap-y-3 mt-[12%]' onSubmit={handleOnSubmit}>
          <div className='flex gap-x-2 w-[100%]'>
            <input
              onChange={handleOnChange}
              className='bg-[#f5f5f5] h-[50px] pl-3 text-[#121418] w-[49%] sm:w-[47%]'
              type="text"
              name="firstname"
              placeholder='First Name'
              value={formData.firstname}
              required
            />
            <input
              onChange={handleOnChange}
              className='bg-[#f5f5f5] h-[50px] pl-3 text-[#121418] w-[49%] sm:w-[47%]'
              type="text"
              name="lastname"
              placeholder='Last Name'
              value={formData.lastname}
              required
            />
          </div>
          <div>
            <input
              onChange={handleOnChange}
              className='bg-[#f5f5f5] h-[50px] pl-3 text-[#121418] w-[100%] sm:w-[96.3%]'
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              required
            />
          </div>
          <div className='relative flex flex-col gap-y-3'>
            <input
              onChange={handleOnChange}
              className='bg-[#f5f5f5] h-[50px] pl-3 text-[#121418] w-[100%] sm:w-[96.3%]'
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              required
            />
            <button type='button' onClick={() => setShowPass(!showPass)}>
              {showPass ? (
                <BsEmojiExpressionless className='text-[#121418] absolute top-3 right-4 sm:right-6 w-[30px] h-[25px]' />
              ) : (
                <BsEmojiLaughing className='text-[#121418] absolute top-3 right-4 sm:right-6 w-[30px] h-[25px]' />
              )}
            </button>
          </div>
          <button
            style={{ background: "linear-gradient(90deg, rgba(0,195,154,1) 0%, rgba(224,205,115,1) 100%)" }}
            className='w-[100%] sm:w-[96.3%] h-[50px] font-bold text-[#121418] tracking-wide text-[17px] relative'
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? (
              <div className='absolute -top-[53px] left-[29.5%] sm:-top-[53px] sm:left-[87px]'>
                <lottie-player
                  src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json"
                  background="transparent"
                  speed="1"
                  style={{ width: "200px", height: "160px" }}
                  loop
                  autoplay
                ></lottie-player>
              </div>
            ) : (
              <p className='text-[#fff]'>Register</p>
            )}
          </button>
          <p className='text-[#121418] text-center sm:-ml-8'>/</p>
          <GoogleLogin
            clientId={process.env.REACT_APP_CLIENT_ID}
            render={(renderProps) => (
              <button
                style={{ borderImage: "linear-gradient(to right, rgba(0,195,154,1) 50%, rgba(224,205,115,1) 80%)", borderImageSlice: "1" }}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled || isLoading}
                aria-label="Continue with Google"
                className="focus:ring-2 focus:ring-offset-1 py-3.5 px-4 border rounded-lg flex items-center w-[100%] sm:w-[96.3%]"
              >
                <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg" alt="google" />
                <p className="text-[base] font-medium ml-4 text-[#121418]">Continue with Google</p>
              </button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy={'single_host_origin'}
          />
        </form>
      </div>
    </div>
  );
}

export default Register;
