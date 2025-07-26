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
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import InputTextComponent from "@common/InputTextComponent";

const initialValues = {
  fullName: "",
  email: "",
  password: ""
};

const Register = () => {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [menuList, setMenuList] = useState([]);
  const [footerRangeList, setFooterRangeList] = useState([]);
  const [isSignUpSuccessfull, setIsSignUpSuccessfull] = useState("");

  const validationSchema = yup.object().shape({
    fullName: yup.string().required(t("full_name_is_required")),
    email: yup.string().required(t("email_is_required")),
    password: yup.string().required(t("password_is_required"))
  });

  const onHandleSubmit = async (value) => {
    setLoader(true);
    const body = {
      name: value.fullName,
      email: value.email,
      password: value.password,
      role_id: 1
    };

    try {
      const response = await allApi(API_CONSTANTS.SIGNUP, body, "post");
      if (response?.status === 200) {
        navigate(ROUTES_CONSTANTS?.SIGN_IN);
      }
    } catch (err) {
      setIsSignUpSuccessfull(err?.response?.data?.errors);
    } finally {
      setLoader(false);
    }
  };

  const fetchMenuList = () => {
    setLoader(true);
    allApi(API_CONSTANTS.MENU_LIST_URL, "", "get")
      .then((response) => {
        if (response.status === 200) {
          let data = response?.data.filter((item, index)=> index <= 6);
          setFooterRangeList(data);
          data.push({ name: "About Us" });
          setMenuList(data);
        }
      })
      .catch(() => setLoader(false))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    fetchMenuList();
  }, []);

  const formik = useFormik({
    initialValues,
    onSubmit: onHandleSubmit,
    validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, handleSubmit, handleChange, touched } = formik;

  return (
    <>
      {loader ? (
        <Loading />
      ) : (
        <>
          <Navbar data={menuList} />
          <div className="min-h-screen mt-16 flex flex-col items-center justify-center bg-white px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl text-[#1D2E43] font-[playfair] font-bold">
                {t("register")}
              </h1>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                <span
                  className="hover:cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  {t("home")}
                </span>
                <span className="mx-1">&gt;</span>
                <span>{t("create_account")}</span>
              </div>
            </div>

            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md">
              <h2 className="text-xl sm:text-2xl text-[#1D2E43] mb-5 font-[playfair]">
                {t("register")}
              </h2>
              <div className="space-y-4">
                <InputTextComponent
                  value={values.fullName}
                  onChange={handleChange}
                  type="text"
                  placeholder={t("full_name")}
                  name="fullName"
                  error={errors.fullName}
                  touched={touched.fullName}
                  className="text-sm rounded w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
                />
                <InputTextComponent
                  value={values.email}
                  onChange={handleChange}
                  type="text"
                  placeholder={t("email")}
                  name="email"
                  error={errors.email}
                  touched={touched.email}
                  className="text-sm rounded w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
                />
                <InputTextComponent
                  value={values.password}
                  onChange={handleChange}
                  type="password"
                  placeholder={t("password")}
                  name="password"
                  error={errors.password}
                  touched={touched.password}
                  className="text-sm rounded w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
                />

                {isSignUpSuccessfull && (
                  <div className="text-xs text-red-500">{isSignUpSuccessfull}</div>
                )}

                <p className="text-sm text-gray-700">
                  {t("user_register_description")}
                </p>

                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="text-white w-full text-base font-[playfair] bg-[#cca438] hover:bg-white border border-[#caa446] px-6 py-2 rounded-md hover:text-[#cca438] hover:border"
                >
                  {t("register")}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(ROUTES_CONSTANTS?.SIGN_IN)}
                  className="w-full text-base font-[playfair] border border-[#cca438] text-[#cca438] hover:text-white hover:bg-[#cca438] px-6 py-2 rounded-md"
                >
                  {t("login")}
                </button>
              </div>
            </div>
          </div>
          <Footer data={footerRangeList}/>
        </>
      )}
    </>
  );
};

export default Register;