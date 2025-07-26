// components
import ButtonComponent from "@common/ButtonComponent";
import PicklistComponent from "@common/PicklistComponent";
import { allApiWithHeaderToken } from "@api/api";
import InputTextComponent from "@common/InputTextComponent";
import { API_CONSTANTS } from "@constants/apiurl";
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import AdminPanelLoader from '@common/AdminPanelLoader';
import FileUpload from "@common/FileUpload";
import Dropdown from "@common/DropdownComponent";

// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLayoutEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";

const structure = {
  name: "",
  products: [],
  status: "",
  image: ""
};

const statusList = [
  { name: "Active", value: "1"},
  { name: "Inactive", value: "0"}
];

const FestivalSpecialForm = () => {
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [data, setData] = useState(structure);
  const [loader, setLoader] = useState(false);
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const { id } = useParams();

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("name_is_required"))
  });

  const onHandleSubmit = async (value) => {
    if (id) {
      // Update
      updateFestProducts(value);
    } else {
      // Create
      createFestProducts(value);
    }
  };

  const createFestProducts = (value) => {
    let data = {
        name: value?.name,
        status: 0,
        products: value?.products,
        image: value?.image
      }
    setLoader(true);
    allApiWithHeaderToken(API_CONSTANTS.COMMON_FEST_PRODUCTS_URL, data , "post", 'multipart/form-data')
      .then((response) => {
        if (response.status === 201) {
        navigate(ROUTES_CONSTANTS.FEST);
      }
    })
    .catch((err) => {
      setLoader(false);
    }).finally(()=>{
      setLoader(false);
    });
  };

  const updateFestProducts = (value) => {
    setLoader(true);
    let body = {
      name: value?.name,
      products: value?.products,
      status: Number(value?.status),
    }
    if(value?.image){
      body['image'] = value?.image
    }

    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_FEST_PRODUCTS_URL}/${id}`, body, "put", 'multipart/form-data')
      .then((response) => {
        if (response.status === 200) {
          navigate(ROUTES_CONSTANTS.FEST);
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
    navigate(ROUTES_CONSTANTS.FEST);
  };

  const fetchProductList = async () => {
    setLoader(true); 
    try {
      const productResponse = await allApiWithHeaderToken(`${API_CONSTANTS.COMMON_PRODUCTS_URL}/active_product`, "", "get");
      if (productResponse.status === 200) {  
        setSource(productResponse?.data);
        setLoader(false); 
      } 
      if (productResponse.status === 200 && id) {
        // Fetch inventory data only if id exists
        const festResponse = await allApiWithHeaderToken(`${API_CONSTANTS.COMMON_FEST_PRODUCTS_URL}/${id}`, "", "get");
        if (festResponse.status === 200) {
          // For Source/Target Picklist
          let sourceData = [];
          let targetData = [];
          productResponse?.data?.forEach((item)=>{
            if(festResponse?.data?.product_ids?.includes(Number(item?.id))){
              targetData?.push(item);
            }
            else{
              sourceData?.push(item);
            }
          });
          setSource(sourceData);
          setTarget(targetData);

          // Other Data
          let resData = {
            name: festResponse?.data?.name,
            products: festResponse?.data?.product_ids,
            status: festResponse?.data?.status,
            image_url: festResponse?.data?.image_url,
          };
          setData(resData);
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

  useLayoutEffect(() => {
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
    <div className="flex h-screen bg-BgPrimaryColor text-TextPrimaryColor py-5 overflow-y-scroll">
      {loader && <AdminPanelLoader/>}
      <Toast ref={toast} position="top-right" />
      <div className="mx-16 my-auto grid h-fit w-full grid-cols-4 gap-4 bg-BgSecondaryColor p-8 border rounded border-BorderColor">
        <div className="col-span-4 font-[600]">
            {id ? t("update_fest_product") : t("create_fest_product")}
        </div>
        <div className="col-span-4">
            <FileUpload 
                value={values?.image_url}
                name="image"
                isLabel={t("fest_special_image")} 
                onChange={(e)=> {
                  setFieldValue('image', e?.currentTarget?.files[0]);
                  setFieldValue('image_url', URL.createObjectURL(e?.target?.files[0]));
                }}
              />    
             <label htmlFor="file" className="error text-red-500">{errors?.file}</label>
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.name}
            onChange={handleChange}
            type="text"
            placeholder={t("name")}
            name="name"
            isLabel={true}
            error={errors?.name}
            touched={touched?.name}
            className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4">
          <PicklistComponent 
            value={values?.products}
            name="products"
            placeholder={t("fest_products")}
            onChange={(event) => {
              setSource(event.source);
              setTarget(event.target);
              setFieldValue('products', event?.target?.map(product => Number(product.id)));
            }}
            source={source}
            target={target}
            error={errors?.products}
            touched={touched?.products}
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

export default FestivalSpecialForm;
