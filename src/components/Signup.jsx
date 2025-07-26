// hooks
import { useRef, useState } from "react";

// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import { allApi } from "@api/api";
import Loading from '@common/Loading';
import { API_CONSTANTS } from "@constants/apiurl";
import { ROUTES_CONSTANTS } from "@constants/routesurl";

// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const data = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: ""
};

const Signup = () => {
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const [checked, setChecked] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("name_is_required")),
    email: yup
      .string()
      .email(t("please_enter_valid_email"))
      .required(t("email_is_required")),
    password: yup
      .string()
      .min(6, t("please_enter_password_more_then_6_characters"))
      .max(20, t("please_enter_password_less_then_20_characters"))
      .required(t("password_is_required")),
    confirmPassword: yup
      .string()
      .min(6, t("please_enter_password_more_then_6_characters"))
      .max(20, t("please_enter_password_less_then_20_characters"))
      .required(t("confirm_password_is_required"))
      .oneOf(
        [yup.ref("password")],
        t("confirm_password_and_new_password_should_be_same"),
      ),
  });

  const onHandleSubmit = async (value) => {
    setLoader(true);
    let body = structuredClone(
      {
        name: value.name,
        email: value.email,
        password: value.password,
        phone_number: value.phoneNumber, 
        role_id: 1
      });
      allApi(API_CONSTANTS.SIGNUP, body, "post")
      .then((response) => {
        if(response?.status === 200){
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "User has been created successfully",
            life: 3000,
          });
          setTimeout(() => {
            navigate(ROUTES_CONSTANTS.LOGIN); 
          }, 2000);
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
      }).finally(()=>{
        setLoader(false);
      });
    };

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });
  const { values, errors, handleSubmit, handleChange, touched } =
    formik;

  return (
    <div className="h-screen items-center flex justify-center">
      {loader && <Loading/>}
      <div className="w-1/4 border px-5 max-lg:px-10 max-md:px-5 shadow-cards">
        <Toast ref={toast} position="top-right" />
        <div className="my-2 text-center text-TextPrimaryColor text-[1.5rem] font-[600] tracking-wide max-xl:text-center max-lg:text-[1.4em] max-sm:text-[1rem]">
          {t("signup")}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <div>
            <InputTextComponent
              value={values?.name}
              onChange={handleChange}
              type="text"
              placeholder={t("full_name")}
              name="name"
              error={errors?.name}
              touched={touched?.name}
              className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
            />
          </div>
          <div>
            <InputTextComponent
              value={values?.email}
              onChange={handleChange}
              type="email"
              placeholder={t("email")}
              name="email"
              error={errors?.email}
              touched={touched?.email}
              className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
            />
          </div>
          <div>
            <InputTextComponent
                value={values?.phoneNumber}
                onChange={handleChange}
                type="phoneNumber"
                placeholder={t("phone_number")}
                name="phoneNumber"
                className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
              />
          </div>
          <div>
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
          <div>
            <InputTextComponent
              value={values?.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder={t("confirm_password")}
              name="confirmPassword"
              error={errors?.confirmPassword}
              touched={touched?.confirmPassword}
              className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-start">
          <div>
            <input
              type="checkbox"
              onChange={() => {
                setChecked(!checked);
              }}
            />
          </div>
          <div className="ms-2 text-[0.8rem]">{t("terms_&_condition")}</div>
        </div>
        <div className="mt-6">
          <ButtonComponent
            disabled={!checked}
            onClick={() => handleSubmit()}
            type="submit"
            label={t("sign_up")}
            className="w-full rounded bg-TextPrimaryColor px-6 py-2 text-[12px] text-white"
          />
        </div>
        <div className="mb-4 mt-2 text-center text-[0.8rem]">
          {t("already_have_an_account?")}
          <span className="ps-2 font-[500] text-TextPrimaryColor underline">
            <Link to="/login">{t("sign_in")}</Link>
          </span>
        </div>
      </div>
    </div>
  );
};
export default Signup;
