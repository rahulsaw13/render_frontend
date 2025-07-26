// hooks
import { useRef, useState, useEffect } from "react";

// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import { allApiWithHeaderToken } from "@api/api";
import AdminPanelLoader from '@common/AdminPanelLoader';
import FileUpload from "@common/FileUpload";
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import { API_CONSTANTS } from "@constants/apiurl";

// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "",
    image: "",
};

const UserForm = () => {
    const toast = useRef(null);
    const { t } = useTranslation("msg");
    const [toastType, setToastType] = useState('');
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState(initialValues);
    const navigate = useNavigate();  
    const { id } = useParams();

    const validationSchema = yup.object().shape({
        name: yup.string().required(t("name_is_required")),
        gender: yup.string().required(t("gender_is_required")),
        phoneNumber: yup.string().required(t("phone_number_is_required")),
        email: yup
            .string()
            .email(t("please_enter_valid_email"))
            .required(t("email_is_required")),
        password: id ? yup.string() : yup
            .string()
            .min(6, t("please_enter_password_more_then_6_characters"))
            .max(20, t("please_enter_password_less_then_20_characters"))
            .required(t("password_is_required")),
        confirmPassword: id ? yup.string() : yup
            .string()
            .min(6, t("please_enter_password_more_then_6_characters"))
            .max(20, t("please_enter_password_less_then_20_characters"))
            .required(t("confirm_password_is_required"))
            .oneOf(
                [yup.ref("password")],
                t("confirm_password_and_new_password_should_be_same"),
            ),
        }) ;

    const onHandleSubmit = (value) => {
        if (id) {
          // Update User
          updateUser(value);
        } else {
          // Create User
          createUser(value);
        }
    };

    const createUser = (value) => {
        let body = {
                email: value?.email,
                password: value?.password,
                name: value?.name,
                role_id: 1,
                image: value?.image,
                gender: value?.gender,
                phone_number: value?.phoneNumber,
        };
        setLoader(true);
        allApiWithHeaderToken("users", body, "post", 'multipart/form-data')
        .then((response) => {
            if (response?.status === 200) {
                setToastType('success');
                toast.current.show({
                    severity: "success",
                    summary: t("success"),
                    detail: response?.data?.message,
                    life: 1000
                });
            }
        })
        .catch((err) => {
            toast.current.show({
                severity: "error",
                summary: t("error"),
                detail: err?.response?.data?.errors,
                life: 3000,
            });
        }).finally(() => {
            setLoader(false);
        });
    };

    const updateUser = (value) => {
        setLoader(true);
        let body = {
            email: value?.email,
            name: value?.name,
            role_id: 1,
            gender: value?.gender,
            phone_number: value?.phoneNumber,
        };
        if(value?.image){
          body['image'] = value?.image
        }
        allApiWithHeaderToken(`${API_CONSTANTS.COMMON_USERS_URL}/${id}`, body, "put", 'multipart/form-data' )
          .then((response) => {
            if (response.status === 200) {
              navigate(ROUTES_CONSTANTS.USERS);
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
          });
      };

    const toastHandler = () => {
        if (toastType === 'success') {
            navigate(ROUTES_CONSTANTS.USERS);
        }
    };

    const formik = useFormik({
        initialValues: data,
        onSubmit: onHandleSubmit,
        validationSchema: validationSchema,
        enableReinitialize: true,
        validateOnBlur: true,
    });

    const handleBack = () => {
        navigate(ROUTES_CONSTANTS.USERS);
    };

     const fetchUserList = async () => {
        setLoader(true);
        try{
            if(id){
              allApiWithHeaderToken(`${API_CONSTANTS.COMMON_USERS_URL}/${id}`, "", "get")
              .then((response) => {
                if (response.status === 200) {
                    let data = {
                        name: response?.data?.name,
                        gender: response?.data?.gender,
                        image_url: response?.data?.image_url,
                        phoneNumber: response?.data?.phone_number,
                        email: response?.data?.email
                    }
                    setData(data);
                } 
              })
              .catch((err) => {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: err?.response?.data?.errors,
                    life: 3000,
                });
              });
            }
        } catch (err){
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Something Went Wrong",
            life: 3000,
          });
        }finally {
          setLoader(false);
        }
      }; 

    useEffect(()=>{
        fetchUserList();
     },[id]);

    const { values, errors, handleSubmit, setFieldValue, handleChange, touched } = formik;
     
    return (
        <div className="flex h-screen text-TextPrimaryColor bg-BgPrimaryColor py-5 overflow-y-scroll">
            {loader && <AdminPanelLoader/>}
            <Toast ref={toast} position="top-right" style={{ scale: '0.7' }} onHide={toastHandler} />
            <div className="mx-16 my-auto grid h-fit w-full grid-cols-4 gap-4 bg-BgSecondaryColor p-8 border rounded border-BorderColor">
                <div className="col-span-4 font-[600]">
                    {id ? t("update_user") : t("create_user")}
                </div>
                <div className="col-span-4">
                    <FileUpload 
                        value={values?.image_url}
                        name="image"
                        isProfile={true}
                        isLabel={t("profile_image")} 
                        onChange={(e)=> {
                        setFieldValue('image', e?.currentTarget?.files[0]);
                        setFieldValue('image_url', URL.createObjectURL(e?.target?.files[0]));
                        }}
                    />    
                    <label htmlFor="file" className="error text-red-500">{errors?.file}</label>
                </div>
                <div className="col-span-4 md:col-span-2">
                    <InputTextComponent
                        value={values?.name}
                        onChange={handleChange}
                        type="text"
                        isLabel={true}
                        placeholder={t("name")}
                        name="name"
                        error={errors?.name}
                        touched={touched?.name}
                        className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
                    />
                </div>
                <div className="col-span-4 md:col-span-2">
                    <InputTextComponent
                        value={values?.email}
                        onChange={handleChange}
                        type="email"
                        isLabel={true}
                        placeholder={t("email")}
                        name="email"
                        error={errors?.email}
                        touched={touched?.email}
                        className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
                    />
                </div>
                {
                    id ? null :
                <div className="col-span-4 md:col-span-2">
                    <InputTextComponent
                        value={values?.password}
                        onChange={handleChange}
                        type="password"
                        isLabel={true}
                        placeholder={t("password")}
                        name="password"
                        error={errors?.password}
                        touched={touched?.password}
                        className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
                    />
                </div>
                }
                {
                    id ? null :
                <div className="col-span-4 md:col-span-2">
                    <InputTextComponent
                        value={values?.confirmPassword}
                        onChange={handleChange}
                        type="password"
                        isLabel={true}
                        placeholder={t("confirm_password")}
                        name="confirmPassword"
                        error={errors?.confirmPassword}
                        touched={touched?.confirmPassword}
                        className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
                    />
                </div>
                }
                <div className="col-span-4 md:col-span-2">
                    <InputTextComponent
                        value={values?.phoneNumber}
                        onChange={handleChange}
                        type="text"
                        isLabel={true}
                        placeholder={t("phone_number")}
                        name="phoneNumber"
                        error={errors?.phoneNumber}
                        touched={touched?.phoneNumber}
                        className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
                    />
                </div>
                <div className="col-span-4 md:col-span-2">
                    <label className="text-[12px] text-TextSecondaryColor ms-[4px] font-[600]">{t("gender")}</label>
                    <div className="flex flex-wrap gap-3 mt-2">
                        <div className="flex align-items-center">
                            <RadioButton 
                                name="gender" 
                                value="Male" 
                                onChange={(e) => setFieldValue('gender', e.value)} 
                                checked={values.gender === 'Male'} 
                            />
                            <label className="ml-2 font-[600] text-[12px]">Male</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton 
                                name="gender" 
                                value="Female" 
                                onChange={(e) => setFieldValue('gender', e.value)} 
                                checked={values.gender === 'Female'} 
                            />
                            <label className="ml-2 font-[600] text-[12px]">Female</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton 
                                name="gender" 
                                value="Other" 
                                onChange={(e) => setFieldValue('gender', e.value)} 
                                checked={values.gender === 'Other'} 
                            />
                            <label className="ml-2 font-[600] text-[12px]">Other</label>
                        </div>
                    </div>
                    {errors?.gender && touched?.gender ? (
                        <p className="text-[0.7rem] text-red-600">{errors?.gender}</p>
                        ) : (
                        ""
                    )}
                </div>
                <div className="col-span-3"></div>
                    <div className="mt-4 flex justify-end gap-4">
                    <ButtonComponent
                        onClick={() => handleBack()}
                        type="button"
                        label={t("back")}
                        className="rounded bg-TextPrimaryColor px-6 py-2 text-[12px] text-white"
                    />
                    <ButtonComponent
                        onClick={() => handleSubmit()}
                        type="submit"
                        label={id ? t("update") : t("submit")}
                        className="rounded bg-TextPrimaryColor px-6 py-2 text-[12px] text-white"
                    />
                </div>
            </div>
        </div>
    )
}

export default UserForm
