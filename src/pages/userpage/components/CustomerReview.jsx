// utils
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Rating } from "primereact/rating";
import * as yup from "yup";
import { useFormik } from "formik";

// Components
import InputTextComponent from "@common/InputTextComponent";
import { allApi } from "@api/api";
import { API_CONSTANTS } from "@constants/apiurl";
import { refactorPrefilledDate } from '@helper';
import DefaultImage from "@assets/no-image.jpeg";
import Loading from '@common/Loading';

const initialValues = {
  name: "",
  reviewHeading: "",
  rating: "",
  email: "",
  image: null
}

const CustomerReview = ({ id, getProductReview, reviews, overallRating }) => {
  const { t } = useTranslation("msg");
  const [addReview, setAddReview] = useState(false);
  const [review, setReview] = useState(initialValues);
  const [loader, setLoader] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("name_is_required")),
    email: yup.string().required(t("email_is_required")),
    rating: yup.string().required(t("rating_is_required"))
  });

  useEffect(() => {
    setUserDetails(JSON.parse(localStorage.getItem("userDetails")));
  }, []);

  const onHandleSubmit = (value) => {
    let data = {
      name: value?.name,
      review_text: value?.reviewHeading,
      email: value?.email,
      rating: value?.rating,
      image: value?.image,
      product_id: id,
      user_id: userDetails?.id,
      is_verified: false
    }
    allApi(API_CONSTANTS.PRODUCT_REVIEW_URL, data, "post", 'multipart/form-data')
      .then((response) => {
        if (response?.status === 201) {
          getProductReview();
          resetForm();
          setFieldValue("image", null);
        }
      })
      .catch((err) => { })
      .finally(() => { });
  };

  const countRating = (stars) => {
    return reviews?.filter((item) => item?.rating === stars)?.length;
  }

  const formik = useFormik({
    initialValues: review,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, resetForm, setFieldValue, handleSubmit, handleChange, touched } = formik;

  return (
    <>
      {loader ? <Loading /> :
        <>
          <div className="border rounded-lg p-8 sm:p-12 bg-white shadow-sm">
            <h2 className="text-xl font-bold mb-2">{t("customer_reviews")}</h2>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((item, index) => {
                  if (overallRating <= index) {
                    return (<i className="ri-star-line" key={index}></i>)
                  }
                  else {
                    return (<i className="ri-star-fill" key={index}></i>)
                  }
                })}
              </div>
              <p className="text-gray-600 text-[0.9rem]"> {t("based_on")} {reviews?.length} {t("reviews")}</p>
            </div>
            <div className="mt-4 flex flex-col lg:flex-row justify-between gap-4">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1]?.map((stars, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex text-yellow-500">
                      {[...Array(stars)]?.map((_, i) => (
                        <i className="ri-star-fill" key={i}></i>
                      ))}
                    </div>
                    <div className="w-32 sm:w-40 h-2 bg-gray-200 rounded">
                      {stars === 5 && <div className="h-full bg-yellow-500 w-full rounded"></div>}
                    </div>
                    <p className="text-gray-600 text-[0.8rem]">({countRating(stars)})</p>
                  </div>
                ))}
              </div>
              <button className="mt-4 sm:mt-0 px-4 py-2 border rounded text-sm h-[40px]" onClick={() => { setAddReview(!addReview) }}>
                {addReview ? t("cancel_review") : t("write_a_review")}
              </button>
            </div>
            {
              addReview ?
                <div className="mt-8 p-4 border rounded-lg bg-white">
                  <div className='mt-4'>
                    <p className="font-semibold mb-2 text-[0.9rem]">{t("add_rating")}</p>
                    <Rating value={values?.rating} name="rating" cancel={false} onChange={handleChange} />
                    {errors?.rating && touched?.rating ? (
                      <p className="text-[0.7rem] text-red-600">{errors?.rating}</p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mb-2 mt-4">
                    <InputTextComponent
                      value={values?.name}
                      onChange={handleChange}
                      type="text"
                      placeholder={t("name")}
                      name="name"
                      error={errors?.name}
                      touched={touched?.name}
                      className="w-full text-[0.9rem] mt-2 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                  <div className="mb-2 mt-4">
                    <InputTextComponent
                      value={values?.email}
                      onChange={handleChange}
                      type="text"
                      placeholder={t("email")}
                      name="email"
                      error={errors?.email}
                      touched={touched?.email}
                      className="w-full text-[0.9rem] mt-2 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                  <div className="mb-4 mt-4 relative">
                    <p className="font-semibold mb-2 text-[0.9rem]">{t("add_photo_or_video")}</p>
                    <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-100 relative">
                      <i className={`${values?.image ? "ri-cloud-fill text-[24px]" : "ri-cloud-line text-[24px]"}`}></i>
                      <span className="text-gray-600 text-sm mt-2">{values?.image ? t("file_has_been_uploaded", { name: values?.image?.name }) : t("click_here_to_upload")}</span>
                      <input
                        type="file"
                        name="image"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          setFieldValue('image', e?.currentTarget?.files[0]);
                        }}
                      />
                      {errors?.image && touched?.image ? (
                        <p className="text-[0.7rem] text-red-600">{errors?.image}</p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-[0.9rem]">{t("write_your_review")}</p>
                    <textarea
                      className="w-full text-[0.9rem] mt-2 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                      rows="4"
                      maxLength="400"
                      name="reviewHeading"
                      onChange={handleChange}
                      placeholder={t("would_you_like_to_write")}
                      value={values?.reviewHeading}
                    ></textarea>
                    <p className="text-right text-gray-500 text-sm">{400 - values?.reviewHeading?.length} {t("characters_remaining")}</p>
                  </div>
                  <div className='flex justify-end'>
                    <button className="mt-4 px-4 py-2 border rounded text-sm h-[40px]" onClick={() => handleSubmit()}>
                      {t("submit")}
                    </button>
                  </div>
                </div>
                : null
            }
            <div className="mt-6 border-t pt-4">
              {reviews?.map((review) => (
                <div key={review?.id} className="flex gap-4 mt-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((item, index) => {
                          if (review?.rating <= index) {
                            return (<i className="ri-star-line" key={index}></i>)
                          }
                          else {
                            return (<i className="ri-star-fill" key={index}></i>)
                          }
                        })}
                      </div>
                      <p className="text-gray-600 text-sm">{refactorPrefilledDate(review?.created_at)}</p>
                    </div>
                    <p className="font-bold flex items-center gap-2">
                      {review.is_verified && (
                        <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded-full">Verified</span>
                      )}
                      {review?.name}
                    </p>
                    <p className="text-gray-700 text-[0.9rem]">{review?.review_text}</p>
                    <div className="flex items-center gap-4 w-full mt-2">
                      <div className="w-48 h-20 overflow-hidden rounded">
                        <img
                          src={review?.image_url ? review.image_url : DefaultImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      }
    </>
  )
}

export default CustomerReview;