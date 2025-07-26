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
import ContactFromBannerImage from "@assets/contact-from-banner.webp";
import Image from "@common/Image";
import InputTextComponent from "@common/InputTextComponent";
import InputTextAreaComponent from "@common/InputTextAreaComponent";
import { shopdata } from '@constants/shopdata.js';
import { ROUTES_CONSTANTS } from "@constants/routesurl";

const initialValues = {
  name: "",
  email: "",
  phoneNumber: "",
  message: "",
  rememberMe: ""
};

const ContactUsPage = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation("msg");
  const [data, setData] = useState(initialValues);
  const [menuList, setMenuList] = useState([]);
  const [footerRangeList, setFooterRangeList] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("name_is_required")),
    email: yup.string().required(t("email_is_required")),
    phoneNumber: yup.string().required(t("phone_number_is_required")),
    message: yup.string().required(t("message_is_required"))
  });

  const fetchMenuList = () => {
    setLoader(true);
    allApi(API_CONSTANTS.MENU_LIST_URL, "", "get")
      .then((response) => {
        if (response.status === 200) {
          let data = response?.data.filter((item, index) => index <= 6);
          setFooterRangeList(data);
          data?.push({ name: "About Us" });
          setMenuList(data);
        }
      })
      .catch(() => setLoader(false))
      .finally(() => setLoader(false));
  };

  const onHandleSubmit = (value) => {
      let body = {
        name: value?.name,
        email: value?.email,
        phone_number: value?.phoneNumber,
        message: value?.message,
        remember_me: value?.rememberMe
      }
      setLoader(true);
      allApi(API_CONSTANTS.ADD_CONTACT_DETAILS, body, "post")
      .then((response) => {
        if(response?.status === 201){
          resetForm(); 
          setIsSubmitted(true);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoader(false);
      });
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

           {/* Excellence Section */}
           <section className="container mx-auto text-left py-10 px-4">
            <h2 className="text-[#1D2E43] capitalize font-[playfair] text-[1.8rem] sm:text-[2rem] md:text-[2.1rem] font-bold">
              {t("we_love_to_hear_from_you")}
            </h2>
            <p className="mt-4 font-[500] mx-auto">
              {t("we_love_to_hear_from_you_desc")}
            </p>
            <Image src={ContactFromBannerImage} alt="Sweets Grid" className="mt-6 mx-auto max-w-full h-auto" />
          </section>

          <section>
            <div className="flex flex-col md:flex-row p-8 md:p-16 gap-12">
              {/* Left Column - Contact Details */}
              <div className="md:w-1/2 space-y-6">
                <h2 className="text-2xl font-semibold font-[playfair] text-[#1D2E43]">{t("head_office")}</h2>

                <div>
                  <h4 className="font-medium">{t("address")}</h4>
                  <p className='text-[0.8rem]'>
                    {shopdata?.address} <br />
                    {shopdata?.pincode}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">{t("email")}</h4>
                  <p className='text-[0.8rem]'>{shopdata?.email}</p>
                </div>

                <div>
                  <h4 className="font-medium">{t("timing")}</h4>
                  <p className='text-[0.8rem]'>{shopdata?.timing?.days} {shopdata?.timing?.time}</p>
                </div>

                <div>
                  <h4 className="font-medium">{t("social_media")}</h4>
                  <div className="flex gap-4 mt-2">
                    {
                      shopdata?.social.map((item)=>{
                        return <i className={`${item?.icon} hover:cursor-pointer`}></i>
                      })
                    }
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="md:w-1/2 space-y-4">
                <h2 className="text-2xl font-semibold font-[playfair] text-[#1D2E43]">{t("talk_to_us")}</h2>
                <div className="space-y-4">
                  <InputTextComponent
                    value={values?.name}
                    onChange={handleChange}
                    type="text"
                    placeholder={t("name")}
                    name="name"
                    error={errors?.name}
                    touched={touched?.name}
                    className="text-[0.8rem] rounded-none w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
                  />
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
                    value={values?.phoneNumber}
                    onChange={handleChange}
                    type="text"
                    placeholder={t("phone_number")}
                    name="phoneNumber"
                    error={errors?.phoneNumber}
                    touched={touched?.phoneNumber}
                    className="text-[0.8rem] rounded-none w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
                  />
                  <InputTextAreaComponent
                    value={values?.message}
                    onChange={handleChange}
                    type="text"
                    rows={3}
                    placeholder={t("message")}
                    name="message"
                    error={errors?.message}
                    touched={touched?.message}
                    className="text-[0.8rem] rounded-none w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
                  />

                  <div className="flex items-start gap-2">
                    <input 
                      type="checkbox" 
                      className="mt-1" 
                      value={values?.message}
                      onChange={handleChange}
                      name="rememberMe"
                    />
                    <label className="text-[0.8rem]">
                      {t("save_my_details")}
                    </label>
                  </div>
                  {
                    isSubmitted && (
                      <div className="text-[0.75rem] text-[green]">{t("contact_details_shared_successfully")}</div>
                    )
                  }
                  <button
                      type="submit"
                      onClick={() => handleSubmit()}
                      className="w-full sm:w-auto text-white text-[1.1rem] font-[playfair] hover:bg-white border bg-[#cca438] px-6 py-2 rounded-md hover:text-[#cca438] hover:border hover:border-[#caa446]"
                      >
                      {t("submit_now")}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <Footer data={footerRangeList}/>
        </>
      }
    </>
  );
};

export default ContactUsPage;