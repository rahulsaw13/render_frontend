// utils
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";

// Components
import Loading from '@common/Loading';
import Navbar from '@userpage/Navbar';
import Footer from '@userpage/Footer';
import { allApi } from "@api/api";
import { API_CONSTANTS } from "@constants/apiurl";
import InputTextComponent from "@common/InputTextComponent";
import { ROUTES_CONSTANTS } from "@constants/routesurl";

const initialValues = {
  email: "",
  password: ""
};

const SignInRegister = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("msg");
  const [data, setData] = useState(initialValues);
  const [menuList, setMenuList] = useState([]);
  const [isLoginScreen, setIsLoginScreen] = useState(false);
  const [footerRangeList, setFooterRangeList] = useState([]);
  const [isloggedIn, setIsLoggedId] = useState(false);
  const [isForgotPasswordSent, setIsForgotPasswordSent] = useState(false);

  const validationSchema = yup.object().shape({
    email: yup.string().required(t("email_is_required")),
    password: isLoginScreen
      ? yup.string()
      : yup.string().required(t("password_is_required"))
  });

  const fetchMenuList = () => {
    setLoader(true);
    allApi(API_CONSTANTS.MENU_LIST_URL, "" , "get")
    .then((response) => {
      if (response.status === 200) {
        let data = response?.data?.filter((item, index)=> index <= 6);
        setFooterRangeList(data);
        data.push({name: "About Us"});
        setMenuList(data);
      }
    })
    .catch((err) => {
      setLoader(false);
    }).finally(() => {
      setLoader(false);
    });
  };

  const onHandleSubmit = (value) => {
    if(isLoginScreen){
      let body = {
        user: {
          email: value?.email
        }
      }
      setLoader(true);
      allApi(API_CONSTANTS.FORGOT_PASSWORD, body, "post")
      .then((response) => {
        if(response?.status === 200){
          resetForm(); 
          setIsForgotPasswordSent(true);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoader(false);
      }); 
    } else {
      setLoader(true);
      let data = {
        user: { ...value }
      };
      allApi(API_CONSTANTS.LOGIN, data, "post")
      .then((response) => {
        if(response?.status === 200){
          localStorage.setItem("token", JSON.stringify(response?.headers?.authorization));
          localStorage.setItem("userDetails", JSON.stringify(response?.data?.data));
          navigate(ROUTES_CONSTANTS.SIGN_IN);
          resetForm(); 
          setIsLoggedId(true);
        }
      })
      .catch((err) => {
        setLoader(false);
      }).finally(() => {
        setLoader(false);
      });
    }
  }

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, resetForm, handleSubmit, handleChange, touched } = formik;

  useEffect(() => {
    fetchMenuList();
  }, []);

  return (
    <>
      {loader ? <Loading /> : 
      <>
        <Navbar data={menuList} />
        <div className="flex flex-col mt-16 items-center justify-center bg-white px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl text-[#1D2E43] font-[playfair] font-bold">{t("login")}</h1>
            <div className="text-sm text-gray-600 mt-2">
              <span className="hover:cursor-pointer" onClick={() => { navigate("/") }}>{t("home")}</span> 
              <span className="mx-1 text-[11px]">&gt;</span> 
              <span>{t("account")}</span>
            </div>
          </div>

          <div className="w-full max-w-6xl px-2 sm:px-4 flex flex-col md:flex-row gap-10 md:gap-24">
            {/* Login Form */}
            <div className="w-full md:w-1/2 mb-10 md:mb-0 transition-all duration-300 ease-in-out">
              {
                isLoginScreen ? 
                <>
                  <h2 className="text-2xl text-[#1D2E43] mb-4 font-[playfair]">{t("reset_your_password")}</h2>
                  <p className="text-[#1D2E43] text-[0.9rem] mb-2">{t("we_will_send_you_an_email_to_reset_your_password")}</p>
                  <div className="space-y-4">
                    <InputTextComponent
                      value={values?.email}
                      onChange={handleChange}
                      type="text"
                      placeholder={t("email")}
                      name="email"
                      error={errors?.email}
                      touched={touched?.email}
                      className="text-[0.8rem] rounded-none w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
                    />
                    {isForgotPasswordSent && (
                      <div className="text-[0.75rem] text-[green]">{t("reset_password_link_has_been_sent")}</div>
                    )}
                    <div className='flex flex-col sm:flex-row gap-3'>
                      <button
                        type="submit"
                        onClick={() => handleSubmit()}
                        className="w-full sm:w-auto text-white text-[1.1rem] font-[playfair] hover:bg-white border bg-[#cca438] px-6 py-2 rounded-md hover:text-[#cca438] hover:border hover:border-[#caa446]"
                      >
                        {t("submit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsLoginScreen(false); setIsForgotPasswordSent(false); }}
                        className="w-full sm:w-auto hover:border border border-white text-[1.1rem] font-[playfair] bg-white px-6 py-2 rounded-md text-[#cca438] hover:border-[#cca438]"
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                </> :
                <>
                  <h2 className="text-2xl text-[#1D2E43] mb-6 font-[playfair]">{t("login")}</h2>
                  <div className="space-y-4">
                    <InputTextComponent
                      value={values?.email}
                      onChange={handleChange}
                      type="text"
                      placeholder={t("email")}
                      name="email"
                      error={errors?.email}
                      touched={touched?.email}
                      className="text-[0.8rem] rounded-none w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
                    />
                    <InputTextComponent
                      value={values?.password}
                      onChange={handleChange}
                      type="password"
                      placeholder={t("password")}
                      name="password"
                      error={errors?.password}
                      touched={touched?.password}
                      className="text-[0.8rem] rounded-none w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
                    />
                    {isloggedIn && (
                      <div className="text-[0.75rem] text-[green]">{t("user_logged_in_successfully")}</div>
                    )}
                    <div className="text-sm">
                      <a
                        onClick={() => { setIsLoginScreen(true); setIsLoggedId(false); }}
                        className="text-gray-700 hover:cursor-pointer hover:text-gray-900 underline font-[playfair] text-[1rem]"
                      >
                        {t("forgot_your_password")}
                      </a>
                    </div>
                    <button
                      type="submit"
                      onClick={() => handleSubmit()}
                      className="w-full sm:w-auto text-white text-[1.1rem] font-[playfair] hover:bg-white border bg-[#cca438] px-6 py-2 rounded-md hover:text-[#cca438] hover:border hover:border-[#caa446]"
                    >
                      {t("sign_in")}
                    </button>
                  </div>
                </>
              }
            </div>

            {/* Register Section */}
            <div className="w-full md:w-1/2 transition-all duration-300 ease-in-out">
              <h2 className="text-2xl text-[#1D2E43] mb-6 font-[playfair]">{t("new_customer")}</h2>
              <p className="mb-6 text-[0.9rem]">
                {t("user_login_new_customer_description")}
              </p>
              <button
                onClick={() => { navigate(ROUTES_CONSTANTS?.REGISTER) }}
                className="w-full sm:w-auto text-white text-[1.1rem] font-[playfair] hover:bg-white border bg-[#cca438] px-6 py-2 rounded-md hover:text-[#cca438] hover:border hover:border-[#caa446]"
              >
                {t("register")}
              </button>
            </div>
          </div>
        </div>
        <Footer data={footerRangeList}/>
      </>
      }
    </>
  )
}

export default SignInRegister;