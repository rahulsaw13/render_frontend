// utils
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import Logo from "@assets/logo.webp";

// Components
import Loading from '@common/Loading';
import { shopdata } from '@constants/shopdata.js';
import InputTextComponent from "@common/InputTextComponent";

const initialValues = {
  trackingNumber: ""
};

const Header = () => {
    const navigate = useNavigate();
    return(
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 py-4 px-6 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
                <img
                    className="hover:cursor-pointer w-[80px] md:w-[120px]"
                    onClick={() => navigate("/")}
                    src={Logo}
                    alt="logo-image"
                />
            </h1>
        </header>
    )
};

const Footer = () => {
    const { t } = useTranslation("msg");
    return(
        <footer className="fixed bottom-0 left-0 right-0 bg-white py-3 px-6 border-t">
            <div className="text-center sm:text-left text-sm text-gray-700 flex flex-col sm:flex-row justify-center sm:justify-center gap-2 sm:gap-4 items-center">
            <span>
                {t("email_us_at")}: <a href={`mailto:${shopdata?.email}`} className="text-black hover:underline">{shopdata?.email}</a>
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
                {t("call_us_at")}: <a href="tel:6360758651" className="text-black hover:underline">{shopdata?.phoneNumber}</a>
            </span>
            </div>
        </footer>
    );
}

const TrackOrderPage = () => {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState(initialValues);
  const { t } = useTranslation("msg");

  const validationSchema = yup.object().shape({
    trackingNumber: yup.string().required(t("tracking_order_number_is_required"))
  });

  const onHandleSubmit = (value) => {
    // Handle tracking submission
  };

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, handleSubmit, handleChange, touched } = formik;

  return (
    <>
      <Header />

      {loader ? (
        <Loading />
      ) : (
        <main className="pt-24 pb-20 min-h-screen bg-gray-100 flex justify-center items-center px-4">
          <div className="bg-white rounded-xl shadow-md w-full max-w-2xl p-6">
            {/* Header */}
            <div className="flex items-center mb-6">
              <i className="ri-road-map-line text-[2.4rem] text-gray-800"></i>
              <h2 className="ms-8 text-lg font-semibold text-gray-600">
                {t("track_status_of_your_shipment")}
              </h2>
            </div>

            {/* Input */}
            <div className="mb-6">
              <InputTextComponent
                value={values?.trackingNumber}
                onChange={handleChange}
                type="text"
                placeholder={t("track_by_order_number")}
                name="trackingNumber"
                error={errors?.trackingNumber}
                touched={touched?.trackingNumber}
                className="text-[0.8rem] rounded-none w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
              />
            </div>

            <div className='flex justify-end'>
                {/* Submit Button */}
                <button
                type="submit"
                onClick={() => handleSubmit()}
                className="w-full sm:w-auto text-white text-[1.1rem] font-[playfair] hover:bg-white border bg-[#cca438] px-6 py-2 rounded-md hover:text-[#cca438] hover:border hover:border-[#caa446]"
                >
                {t("submit")}
                </button>
            </div>
          </div>
        </main>
      )}

      <Footer />
    </>
  );
};

export default TrackOrderPage;
