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
import { allApiWithHeaderToken } from "@api/api";
import FileUpload from "@common/FileUpload";

const structure = {
  name: "",
  email: "",
  gender: "",
  address: "",
  image: "",
  role_id: 1
};

const UserProfilePage = () => {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [data, setData] = useState(structure);
  const [menuList, setMenuList] = useState([]);
  const [footerRangeList, setFooterRangeList] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("name_is_required")),
    email: yup.string().required(t("email_is_required")),
  });

  const onHandleSubmit = async (value) => {
    setLoader(true);
    let body = {
        name: value?.name,
        phone_number: value?.phoneNumber,
    };
    if(value?.image){
      body['image'] = value?.image
    }
    
    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_USERS_URL}/${userDetails?.id}`, body, "put", 'multipart/form-data' )
      .then((response) => {
        if (response.status === 200) {
          // navigate("/");
          console.log("response",response);
          // const userDetails = JSON.parse(localStorage.getItem("userDetails"));
        }
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  useEffect(() => {
    setLoader(true);
    try{
        if(userDetails?.id){
          allApiWithHeaderToken(`${API_CONSTANTS.COMMON_USERS_URL}/${userDetails?.id}`, "", "get")
          .then((response) => {
            if (response.status === 200) {
                let data = {
                    name: response?.data?.name,
                    image_url: response?.data?.image_url,
                    phoneNumber: response?.data?.phone_number,
                    email: response?.data?.email
                }
                setData(data);
            } 
          })
          .catch((err) => {
          });
        }
    } catch (err){
    }finally {
      setLoader(false);
    }
  }, []);

  const fetchMenuList = () => {
    setLoader(true);
    allApi(API_CONSTANTS.MENU_LIST_URL, "" , "get")
    .then((response) => {
      if (response.status === 200) {
          let data = response?.data.filter((item, index)=> index <= 6);
          setFooterRangeList(data);
          data.push({name: "About Us"});
          setMenuList(data)
      } 
    })
    .catch((err) => {
      setLoader(false);
    }).finally(()=>{
      setLoader(false);
    });
  };

  useEffect(()=>{
    fetchMenuList();
  },[]);

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, handleSubmit, handleChange, setFieldValue, touched } = formik;

  return (
    <>
      {loader ? <Loading/> : 
      <>
        <Navbar data={menuList}/>
        <div className="min-h-screen flex mt-16 flex-col items-center justify-center bg-white px-6 py-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-[#1D2E43] font-[playfair] font-bold">{t("edit_profile")}</h1>
          <div className="text-sm text-gray-600 mt-2">
            <span className="hover:cursor-pointer" onClick={()=>{ navigate("/") }}>{t("home")}</span> <span className="mx-1 text-[11px]">&gt;</span> <span>{t("edit_account")}</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-2xl text-[#1D2E43] mb-6 font-[playfair]">{t("profile")}</h2>
          <div className="space-y-4">
            <FileUpload
              isLabel={t("profile_image")}
              value={values?.image_url}
              name="image"
              onChange={(e)=> {
                setFieldValue('image', e?.currentTarget?.files[0]);
                setFieldValue('image_url', URL.createObjectURL(e?.target?.files[0]));
                }}
              isProfile={true}
            />
            <InputTextComponent
              value={values?.name}
              onChange={handleChange}
              type="text"
              placeholder={t("full_name")}
              name="name"
              error={errors?.name}
              touched={touched?.name}
              className="text-[0.8rem] rounded-none w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
            />
            <InputTextComponent
              value={values?.email}
              onChange={handleChange}
              type="text"
              disabled={true}
              placeholder={t("email")}
              name="email"
              error={errors?.email}
              touched={touched?.email}
              className="text-[0.8rem] rounded-none w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
            />
            <InputTextComponent
              value="********"
              type="password"
              placeholder={t("password")}
              className="text-[0.8rem] rounded-none w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
            />
            <InputTextComponent
              value={values?.phoneNumber}
              onChange={handleChange}
              type="text"
              placeholder={t("phone_number")}
              name="phoneNumber"
              error={errors?.phoneNumber}
              touched={touched?.phoneNumber}
              className="text-[0.8rem] rounded-none w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
            />

            <button
              type="submit"
              onClick={() => handleSubmit()}
              className="text-white w-full text-[1.1rem] font-[playfair] hover:bg-white border border-[#caa446] bg-[#cca438] px-6 py-2 rounded-md hover:text-[#cca438] hover:border hover:border-[#caa446]"
            >
              {t("update_profile")}
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

export default UserProfilePage;