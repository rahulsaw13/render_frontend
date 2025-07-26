// utils
import { useEffect, useRef, useState } from "react";
import { useLocation } from 'react-router-dom';
import * as yup from "yup";
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import { allApi } from "@api/api";
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import { API_CONSTANTS } from "@constants/apiurl";
import Loading from '@common/Loading';

const data = {
  email: "",
  password: "",
};

const Login = () => {
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const location = useLocation();
  const { isLogout } = location?.state || {};
  const [toastType, setToastType] = useState(''); 
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required(t("email_is_required")),
    password: yup
      .string()
      .min(6, t("please_enter_password_more_then_6_characters"))
      .max(20, t("please_enter_password_less_then_20_characters"))
      .required(t("password_is_required")),
  });

  const onHandleSubmit = async (value) => {
    setLoader(true);
    let data = {
      user: {
      ...value}
    }
    allApi(API_CONSTANTS.LOGIN, data, "post")
      .then((response) => {
        if(response?.status === 200){
          localStorage.setItem("token", JSON.stringify(response?.headers?.authorization));
          localStorage.setItem("userDetails", JSON.stringify(response?.data?.data));
          navigate(ROUTES_CONSTANTS.DASHBOARD, { 
            state: { 
                    isLogin: "success"
                } 
            });
        }
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err?.response?.data?.errors,
          life: 3000,
        });
        setLoader(false);
      }).finally(()=> {
        setLoader(false);
      });
  };

  useEffect(()=>{
    if(isLogout){
      toast.current.show({
       severity: "success",
       summary: t("success"),
       detail: "You have successfully logout",
       life: 2000
      });
    };
    
    navigate(location.pathname, { replace: true }); 
  },[])

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });
   
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(); // Trigger form submission on Enter
    }
  };

  const { values, errors, handleSubmit, handleChange, touched } = formik;

  return (
    <div className="h-screen flex items-center justify-center">
      {loader && <Loading/>}
      <div className="w-1/4 border shadow-cards px-5 py-5 max-lg:px-10 max-md:px-5" onKeyDown={handleKeyDown}>
        <Toast ref={toast} position="top-right" style={{scale: '0.7'}}/>
        <div className="mb-2 text-center">
          <i className="ri-shopping-cart-2-line text-[40px] text-TextPrimaryColor"></i>
        </div>
        <div className="text-center text-[1.5rem] font-[600] text-TextPrimaryColor tracking-wide max-lg:text-[1.4em] max-sm:text-[1rem]">
          {t("login")}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          <InputTextComponent
            value={values?.email}
            onChange={handleChange}
            type="text"
            placeholder={t("email")}
            name="email"
            error={errors?.email}
            touched={touched?.email}
            className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
          <InputTextComponent
            value={values?.password}
            onChange={handleChange}
            type="password"
            placeholder={t("password")}
            name="password"
            error={errors?.password}
            touched={touched?.password}
            className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-2">
          </div>
          <div className="z-10 text-[0.8rem] text-TextPrimaryColor underline underline-offset-2 hover:cursor-pointer">
            <Link to="/forgot-password">{t("forgot_password")}</Link>
          </div>
        </div>
        <div className="mt-4">
          <ButtonComponent
            onClick={() => handleSubmit()}
            type="submit"
            label={t("log_in")}
            className="w-full rounded bg-TextPrimaryColor px-6 py-2 text-[12px] text-white"
            icon="pi pi-arrow-right"
            iconPos="right"
          />
        </div>
        <div className="mt-2 text-center text-[0.8rem]">
          {" "}
          {t("don't_have_an_account?")}
          <span className="ps-2 font-[500] text-TextPrimaryColor underline">
            <Link to="/signup">Signup</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
