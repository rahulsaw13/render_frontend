// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import FileUpload from "@common/FileUpload";
import { API_CONSTANTS } from "@constants/apiurl";
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import { allApiWithHeaderToken } from "@api/api";
import DropdownComponent from "@common/DropdownComponent";
import AdminPanelLoader from '@common/AdminPanelLoader';

// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

const statusList = [
  { name: "Active", value: "1"},
  { name: "Inactive", value: "0"}
];

const weightList = [
  { name: "500 Gram", value: "500 Gram"},
  { name: "1 Kg", value: "1 Kg"},
  { name: "1.5 Kg", value: "1.5 Kg"},
  { name: "2 Kg", value: "2 Kg"},
  { name: "3 Kg", value: "3 Kg"},
  { name: "4 Kg", value: "4 Kg"},
  { name: "5 Kg", value: "5 Kg"},
  { name: "6 Kg", value: "6 Kg"},
  { name: "7 Kg", value: "7 Kg"},
  { name: "8 Kg", value: "8 Kg"},
  { name: "9 Kg", value: "9 Kg"},
  { name: "10 Kg", value: "10 Kg"}
];

const initialValues = {
  name: "",
  description: "",
  subCategory: {},
  image: "",
  price: "",
  shelfLife: "",
  status: "",
  weight: ""
};

const ProductForm = () => {
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [data, setData] = useState(initialValues);
  const [toastType, setToastType] = useState(''); 
  const [categoryData, setCategoryData] = useState([]);
  const { id } = useParams();

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("product_name_is_required")),
    price: yup.number().required(t("price_is_required")),
    shelfLife: yup.number().required(t("price_is_required")),
    description: yup.string().required(t("description_is_required")),
    subCategory: yup.object()
    .test('non-empty-object', t("sub_category_is_required"), (value) => {
      return value && Object.keys(value).length > 0;
    }),
    weight: yup.string().required(t("weight_is_required"))
  });

  const onHandleSubmit = (value) => {
    if (id) {
      // Update Product
      updateProduct(value);
    } else {
      // Create Product
      createProduct(value);
    }
  };

  
  const toastHandler=()=>{
    if (toastType === 'success') {
       navigate(ROUTES_CONSTANTS.PRODUCTS);
     }
  }

  const successToaster=(response)=>{
    setToastType('success');
    return toast.current.show({
      severity: "success",
      summary: t("success"),
      detail: response?.data?.message,
      life: 500
    });
  };

  const errorToaster=(err)=>{
    setToastType('error');
    return toast.current.show({
      severity: "error",
      summary: t("error"),
      detail: err,
      life: 1000
    });
  };

  const createProduct = (value) => {
    let data = {
      name: value?.name,
      description: value?.description,
      status: 1,
      image: value?.image,
      sub_category_id: value?.subCategory?.id,
      price: value?.price,
      shelf_life: value?.shelfLife,
      weight: value?.weight
    }
    setLoader(true);
    allApiWithHeaderToken(API_CONSTANTS.COMMON_PRODUCTS_URL, data, "post", 'multipart/form-data').then((response) => {
        if (response.status === 201) {
          successToaster(response);
        }
      })
    .catch((err) => {
      errorToaster(err?.response?.data?.errors);
      setLoader(false);
    }).finally(()=>{
      setLoader(false);
    });
  };

  const updateProduct = (value) => {
    setLoader(true);
    let body = {
      name: value?.name,
      description: value?.description,
      status: Number(value?.status),
      price: value?.price,
      shelf_life: value?.shelfLife,
      weight: value?.weight
    }
    if(value?.image){
      body['image'] = value?.image
    }

    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_PRODUCTS_URL}/${id}`, body, "put", 'multipart/form-data' )
      .then((response) => {
        if (response.status === 200) {
          navigate(ROUTES_CONSTANTS.PRODUCTS);
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

  const fetchProductList = async () => {
    setLoader(true);
    try{
       const categoryResponse = await allApiWithHeaderToken(`${API_CONSTANTS.COMMON_SUB_CATEGORIES_URL}/active_sub_categories_list`, "", "get");
        if (categoryResponse.status === 200) {  
          setCategoryData(categoryResponse?.data);
        } 
        if(categoryResponse.status === 200 && id){
          allApiWithHeaderToken(`${API_CONSTANTS.COMMON_PRODUCTS_URL}/${id}`, "", "get")
          .then((response) => {
            if (response.status === 200) {
              const subCategoryId = response?.data?.sub_category_id;
              const selectedSubCategory = categoryResponse.data.find((category) => category.id == subCategoryId);
              let data = {
                name: response?.data?.name,
                description: response?.data?.description,
                image_url: response?.data?.image_url,
                status: String(response?.data?.status),
                price: response?.data?.price,
                weight: response?.data?.weight,
                shelfLife: response?.data?.shelf_life,
                subCategory: selectedSubCategory
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
    fetchProductList();
 },[id]);

  const handleBack = () => {
    navigate(ROUTES_CONSTANTS.PRODUCTS);
  };

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, setFieldValue, handleSubmit, handleChange, touched } = formik;

  return (
    <div className="flex h-screen bg-BgPrimaryColor text-TextPrimaryColor py-5 overflow-y-scroll">
      {loader && <AdminPanelLoader/>}
      <Toast ref={toast} position="top-right" style={{scale: '0.7'}} onHide={toastHandler}/>
      <div className="mx-16 my-auto grid h-fit w-full grid-cols-4 gap-4 bg-BgSecondaryColor p-8 border rounded border-BorderColor">
        <div className="col-span-4 font-[600]">
            {id ? t("update_product") : t("create_product")}
        </div>
       <div className="col-span-4">
            <FileUpload 
                value={values?.image_url}
                name="image"
                isLabel={t("category_sub_image")} 
                onChange={(e)=> {
                  setFieldValue('image', e?.currentTarget?.files[0]);
                  setFieldValue('image_url', URL.createObjectURL(e?.target?.files[0]));
                }}
              />    
             <label htmlFor="file" className="error text-red-500">{errors?.file}</label>
        </div>
        <div className="col-span-2">
          <DropdownComponent 
            value={values?.subCategory}
            onChange={(field, value) => setFieldValue(field, value)}
            data= {categoryData}
            placeholder={t("select_sub_category")}
            name="subCategory"
            error={errors?.subCategory}
            touched={touched?.subCategory}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] custom-dropdown focus:outline-none"
            optionLabel="name"
          />
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.name}
            onChange={handleChange}
            type="text"
            placeholder={t("product_name")}
            name="name"
            isLabel={true}
            error={errors?.name}
            touched={touched?.name}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.description}
            onChange={handleChange}
            type="text"
            placeholder={t("description")}
            name="description"
            isLabel={true}
            error={errors?.description}
            touched={touched?.description}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.price}
            onChange={handleChange}
            type="number"
            placeholder={t("price")}
            name="price"
            isLabel={true}
            error={errors?.price}
            touched={touched?.price}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <DropdownComponent
            value={values?.weight}
            onChange={(field, value) => setFieldValue(field, value)}
            data={weightList}
            name="weight"
            placeholder={t("weight")}
            className="custom-dropdown col-span-2 w-full rounded border-[1px] border-[#ddd] focus:outline-none"
            optionLabel="name"
            error={errors?.weight}
            touched={touched?.weight}
          />
        </div>
        <div className="col-span-2">
           <InputTextComponent
            value={values?.shelfLife}
            onChange={handleChange}
            type="number"
            placeholder={t("shelf_life_in_days")}
            name="shelfLife"
            isLabel={true}
            error={errors?.shelfLife}
            touched={touched?.shelfLife}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
         {
            id && (
              <>
                <div className="col-span-2">
                <DropdownComponent
                    value={values?.status}
                    onChange={(field, value) => setFieldValue(field, value)}
                    data={statusList}
                    name="status"
                    placeholder={t("status")}
                    className="custom-dropdown col-span-2 w-full rounded border-[1px] border-[#ddd] focus:outline-none"
                    optionLabel="name"
                  />
                </div>
                <div className="col-span-2"></div>
              </>
            )
          }
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

export default ProductForm;
