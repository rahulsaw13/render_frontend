// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import { allApiWithHeaderToken } from "@api/api";
import { API_CONSTANTS } from "@constants/apiurl";
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import AdminPanelLoader from '@common/AdminPanelLoader';
import Dropdown from "@common/DropdownComponent";

// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";

const structure = {
  product: {},
  stockQty: ""
};

const InventoryForm = () => {
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [data, setData] = useState(structure);
  const [loader, setLoader] = useState(false);
  const [productList, setProductList] = useState([]); 
  const { id } = useParams();

  const validationSchema = yup.object().shape({
    product: yup.object()
    .test('non-empty-object', t("product_is_required"), (value) => {
      return value && Object.keys(value).length > 0;
    }),
    stockQty: yup.string().required(t("stock_qty_is_required"))
  });

  const onHandleSubmit = async (value) => {
    if (id) {
      // Update
      updateInventory(value);
    } else {
      // Create
      createInventory(value);
    }
  };

  const createInventory = (value) => {
    let data = {
      product_id: value?.product?.id,
      stock_quantity: value?.stockQty
    }
    setLoader(true);
    allApiWithHeaderToken(API_CONSTANTS.COMMON_INVENTORY_URL, data , "post")
      .then((response) => {
        if (response.status === 201) {
          navigate(ROUTES_CONSTANTS.INVENTORY);
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

  const updateInventory = (value) => {
    setLoader(true);
    let data = {
      product_id: value?.product?.id,
      stock_quantity: value?.stockQty
    }
  
    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_INVENTORY_URL}/${id}`, data, "put")
      .then((response) => {
        if (response.status === 200) {
          navigate(ROUTES_CONSTANTS.INVENTORY);
        } 
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err?.response?.data?.errors,
          life: 3000,
        });
      }).finally(()=>{
        setLoader(false);
      });
  };

  const handleBack = () => {
    navigate(ROUTES_CONSTANTS.INVENTORY);
  };

  const fetchProductList = async () => {
    setLoader(true); 
    try {
      let url = id ? API_CONSTANTS.COMMON_PRODUCTS_URL : `${API_CONSTANTS.COMMON_INVENTORY_URL}/inventory_product_list`;
      const productResponse = await allApiWithHeaderToken(url, "", "get");
      if (productResponse.status === 200) {  
        setProductList(productResponse?.data);
      } 
      if (productResponse.status === 200 && id) {
        // Fetch inventory data only if id exists
        const inventoryResponse = await allApiWithHeaderToken(`${API_CONSTANTS.COMMON_INVENTORY_URL}/${id}`, "", "get");
        if (inventoryResponse.status === 200) {
          const productId = inventoryResponse?.data?.product_id;
          const selectedProduct = productResponse.data.find((product) => product.id == productId);

          let data = {
            product: selectedProduct,
            stockQty: inventoryResponse?.data?.stock_quantity
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
            {id ? t("update_inventory") : t("create_inventory")}
        </div>
        <div className="col-span-2">
          <Dropdown
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
          <InputTextComponent
            value={values?.stockQty}
            onChange={handleChange}
            type="number"
            placeholder={t("stock_quantity")}
            name="stockQty"
            isLabel={true}
            error={errors?.stockQty}
            touched={touched?.stockQty}
            className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
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

export default InventoryForm;
