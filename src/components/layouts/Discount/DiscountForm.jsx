// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import { allApiWithHeaderToken } from "@api/api";
import { API_CONSTANTS } from "@constants/apiurl";
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import AdminPanelLoader from '@common/AdminPanelLoader';
import DropdownComponent from "@common/DropdownComponent";
import { refactorPrefilledDate } from '@helper';

// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";

const structure = {
  discountValue: "",
  validFrom: "",
  validUntil: "",
  discountType: "",
  product: {}
};

const discountTypeList = [
  { name: "Percentage", value: "0"},
  { name: "Fixed", value: "1"}
];

const DiscountForm = () => {
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [data, setData] = useState(structure);
  const [loader, setLoader] = useState(false);
  const [productList, setProductList] = useState([]);
  const { id } = useParams();

  const validationSchema = yup.object().shape({
    discountType: yup.string().required(t("discount_type_is_required")),
    discountValue: yup.number().required(t("discount_value_is_required")),
    validFrom: yup.string().required(t("valid_from_date_is_required")),
    validUntil: yup.string().required(t("valid_until_date_is_required")),
    product: yup.object()
    .test('non-empty-object', t("product_is_required"), (value) => {
      return value && Object.keys(value).length > 0;
    })
  });

  const onHandleSubmit = async (value) => {
    if (id) {
      // Update
      updateDiscount(value);
    } else {
      // Create
      createDiscount(value);
    }
  };

  const createDiscount = (value) => {
    let data = {
      discount_type: value?.discountType,
      discount_value: value?.discountValue,
      start_date: value?.validFrom,
      end_date: value?.validUntil,
      product_id: value?.product?.id,
    }
    setLoader(true);
    allApiWithHeaderToken(API_CONSTANTS.COMMON_DISCOUNT_URL, data , "post")
      .then((response) => {
        if (response.status === 201) {
          navigate(ROUTES_CONSTANTS.DISCOUNT);
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

  const updateDiscount = (value) => {
    setLoader(true);
    let body = {
      discount_type: value?.discountType,
      discount_value: value?.discountValue,
      start_date: value?.validFrom,
      end_date: value?.validUntil,
      product_id: value?.product?.id,
    }

    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_DISCOUNT_URL}/${id}`, body, "put")
      .then((response) => {
        if (response.status === 200) {
          navigate(ROUTES_CONSTANTS.DISCOUNT);
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
    navigate(ROUTES_CONSTANTS.DISCOUNT);
  };

  const checkValidDate=(startDate, endDate, key)=>{
    if(new Date(startDate) > new Date(endDate)){
      setFieldValue(key, "");
    }
  };

  const fetchProductList = async () => {
    setLoader(true); 
    try {
      
      let url = id ? API_CONSTANTS.COMMON_PRODUCTS_URL : `${API_CONSTANTS.COMMON_DISCOUNT_URL}/discount_product_list`;
      const productResponse = await allApiWithHeaderToken(url, "", "get");
      if (productResponse.status === 200) {  
        setProductList(productResponse?.data);
      } 
      if (productResponse.status === 200 && id) {
        // Fetch inventory data only if id exists
        const discountResponse = await allApiWithHeaderToken(`${API_CONSTANTS.COMMON_DISCOUNT_URL}/${id}`, "", "get");
        if (discountResponse.status === 200) {
          const productId = discountResponse?.data?.product_id;
          
          const selectedProduct = productResponse.data.find((product) => product.id == productId);
        
          let data = {
            discountType: String(discountResponse?.data?.discount_type),
            discountValue: discountResponse?.data?.discount_value,
            validFrom: refactorPrefilledDate(discountResponse?.data?.start_date),
            validUntil: refactorPrefilledDate(discountResponse?.data?.end_date),
            product: selectedProduct
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
      setLoader(false);  // Stop loading after the operation is finished
    }
  };
  
  useEffect(() => {
      fetchProductList();
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
            {id ? t("update_discount") : t("create_discount")}
        </div>
        <div className="col-span-2">
          <DropdownComponent
              value={values?.product}
              onChange={(field, value) => setFieldValue(field, value)}
              data={productList}
              name="product"
              placeholder={t("product")}
              className="custom-dropdown col-span-2 w-full rounded border-[1px] border-[#ddd] focus:outline-none"
              optionLabel="name"
              error={errors?.product}
              touched={touched?.product}
            />
        </div>
        <div className="col-span-2">
         <DropdownComponent
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
            type="number"checkValidDate
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

export default DiscountForm;
