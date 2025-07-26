// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import { allApiWithHeaderToken } from "@api/api";
import { API_CONSTANTS } from "@constants/apiurl";
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import AdminPanelLoader from '@common/AdminPanelLoader';
import Dropdown from "@common/DropdownComponent";
import { refactorPrefilledDate } from '@helper';

// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";

const structure = {
  code: "",
  discountValue: "",
  validFrom: "",
  validUntil: "",
  discountType: {},
  user: {}
};

const discountTypeList = [
  { name: "Percentage", value: "0"},
  { name: "Fixed", value: "1"}
];

const CouponForm = () => {
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [data, setData] = useState(structure);
  const [loader, setLoader] = useState(false);
  const { id } = useParams();
  const [ userList, setUserList] = useState([]);

  const validationSchema = yup.object().shape({
    code: yup.string().required(t("code_is_required")),
    discountType: yup.string().required(t("discount_type_is_required")),
    discountValue: yup.string().required(t("discount_value_is_required")),
    validFrom: yup.string().required(t("valid_from_date_is_required")),
    validUntil: yup.string().required(t("valid_until_date_is_required")),
    user: yup.object()
    .test('non-empty-object', t("user_id_is_required"), (value) => {
      return value && Object.keys(value).length > 0;
    })
  });

  const onHandleSubmit = async (value) => {
    if (id) {
      // Update
      updateCoupon(value);
    } else {
      // Create
      createCoupon(value);
    }
  };

  const createCoupon = (value) => {
    let data = {
      code: value?.code,
      discount_type: value?.discountType,
      discount_value: value?.discountValue,
      valid_from: value?.validFrom,
      valid_until: value?.validUntil,
      user_id: value?.user?.id,
    }
    setLoader(true);
    allApiWithHeaderToken(API_CONSTANTS.COMMON_COUPON_URL, data , "post")
      .then((response) => {
        if (response.status === 201) {
          navigate(ROUTES_CONSTANTS.COUPONS);
        } 
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err?.response?.data?.errors,
          life: 3000,
        });
        setLoader(false)
      }).finally(()=>{
        setLoader(false);
      });
  };

  const updateCoupon = (value) => {
    setLoader(true);
    let data = {
      code: value?.code,
      discount_type: value?.discountType,
      discount_value: value?.discountValue,
      valid_from: value?.validFrom,
      valid_until: value?.validUntil,
      user_id: value?.user?.id,
    }

    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_COUPON_URL}/${id}`, data, "put")
      .then((response) => {
        if (response.status === 200) {
          navigate(ROUTES_CONSTANTS.COUPONS);
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

  const handleBack = () => {
    navigate(ROUTES_CONSTANTS.COUPONS);
  };

  const checkValidDate=(startDate, endDate, key)=>{
    if(new Date(startDate) > new Date(endDate)){
      setFieldValue(key, "");
    }
  };

 const fetchUserList = async () => {
     setLoader(true); 
     try {
       const userResponse = await allApiWithHeaderToken(`${API_CONSTANTS.COMMON_USERS_URL}/get_users_list`, "", "get");
       if (userResponse.status === 200) {  
         setUserList(userResponse?.data);
       } 
       if (userResponse.status === 200 && id) {
         // Fetch inventory data only if id exists
         const couponResponse = await allApiWithHeaderToken(`${API_CONSTANTS.COMMON_COUPON_URL}/${id}`, "", "get");
         if (couponResponse.status === 200) {
           const userId = couponResponse?.data?.user_id;
           
           const selectedUser = userResponse.data.find((item) => item.id == userId);
        
           let data = {
             code: String(couponResponse?.data?.code),
             discountType: String(couponResponse?.data?.discount_type),
             discountValue: couponResponse?.data?.discount_value,
             validFrom: refactorPrefilledDate(couponResponse?.data?.valid_from),
             validUntil: refactorPrefilledDate(couponResponse?.data?.valid_until),
             user: selectedUser
           }
           setData(data);  // Set the form data
         }
       }
   
     } catch (err) {
       toast.current.show({
         severity: "error",
         summary: "Error",
         detail: err?.response?.data?.errors,
         life: 3000,
       });
       setLoader(false); 
     } finally {
       setLoader(false);  // Stop Loader after the operation is finished
     }
  };
  
  useEffect(() => {
      fetchUserList();
  }, [id]);

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, handleSubmit, handleChange, setFieldValue, touched } = formik;

  return (
    <div className="flex h-screen bg-BgPrimaryColor text-TextPrimaryColor overflow-y-scroll">
      {loader && <AdminPanelLoader/>}
      <Toast ref={toast} position="top-right" />
      <div className="mx-16 my-auto grid h-fit w-full grid-cols-4 gap-4 bg-BgSecondaryColor p-8 border rounded border-BorderColor">
        <div className="col-span-4 font-[600]">
            {id ? t("update_coupon") : t("create_coupon")}
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.code}
            onChange={handleChange}
            type="text"
            placeholder={t("code")}
            name="code"
            isLabel={true}
            error={errors?.code}
            touched={touched?.code}
            className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <Dropdown
              value={values?.user}
              onChange={(field, value) => setFieldValue(field, value)}
              data={userList}
              name="user"
              placeholder={t("user")}
              className="custom-dropdown col-span-2 w-full rounded border-[1px] border-[#ddd] focus:outline-none"
              optionLabel="name"
              error={errors?.user}
              touched={touched?.user}
            />
        </div>
        <div className="col-span-2">
          <Dropdown
              value={values?.discountType}
              onChange={(field, value) => setFieldValue(field, value)}
              data={discountTypeList}
              name="discountType"
              placeholder={t("discount_type")}
              className="custom-dropdown col-span-2 w-full rounded border-[1px] border-[#ddd] focus:outline-none"
              optionLabel="name"
              error={errors?.discountType}
              touched={touched?.discountType}
            />
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.discountValue}
            onChange={handleChange}
            type="number"
            placeholder={t("discount_value")}
            name="discountValue"
            isLabel={true}
            error={errors?.discountValue}
            touched={touched?.discountValue}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.validFrom}
            onChange={(e)=>{
              handleChange(e);
              if(values?.validUntil){
                checkValidDate(e?.target?.value, values?.validUntil, "validUntil");
              }
            }}
            type="date"
            placeholder={t("valid_from")}
            name="validFrom"
            isLabel={true}
            error={errors?.validFrom}
            touched={touched?.validFrom}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.validUntil}
            onChange={(e)=>{
              handleChange(e);
              if(values?.validFrom){
                checkValidDate(values?.validFrom, e?.target?.value, "validFrom");
              }
            }}
            type="date"
            placeholder={t("valid_until")}
            name="validUntil"
            isLabel={true}
            error={errors?.validUntil}
            touched={touched?.validUntil}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
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
  );
};

export default CouponForm;
