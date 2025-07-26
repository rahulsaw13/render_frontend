// utils
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

// components
import Breadcrum from "@common/Breadcrum";
import DataTable from "@common/DataTable";
import ButtonComponent from "@common/ButtonComponent";
import Confirmbox from "@common/Confirmbox";
import { allApiWithHeaderToken } from "@api/api";
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import { API_CONSTANTS } from "@constants/apiurl";
import { CheckboxComponent } from "@common/CheckboxComponent";

const FestivalSpecialList = ({search}) => {
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [isConfirm, setIsConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  const item = {
    heading: t("festival_special"),
    routes: [
      { label: t("dashboard"), route: ROUTES_CONSTANTS.DASHBOARD },
      { label: t("festival_special"), route: ROUTES_CONSTANTS.CATEGORIES },
    ],
  };

  const [data, setData] = useState([]);

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex">
        <ButtonComponent
          icon="ri-pencil-line"
          className="text-[1rem]"
          onClick={() => editFestProducts(rowData)}
        />
        <ButtonComponent
          icon="ri-delete-bin-line"
          className="text-[1rem]"
          onClick={() => confirmDeleteFestProducts(rowData)}
        />
      </div>
    );
  };

  const productBodyTemplate=(rowData)=>{
    return (
      <div className="flex items-center gap-4">
        {rowData?.products}
      </div>
    );
  };

  const statusChangedHandler=(id)=>{
    setLoader(true);
    let body = {
      id: id
    }
  
    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_FEST_PRODUCTS_URL}/update_status`, body, "post")
      .then((response) => {
        if (response.status === 200) {
          fetchFestProductsList();
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

  const festivalNameBodyTemplate=(rowData)=>{
    return (
      <div className="flex items-center gap-4">
        <CheckboxComponent onChange={()=> {statusChangedHandler(rowData?.id)}} checked={rowData?.status}/>
        {rowData?.name}
      </div>
    );
  };

  const columns = [
    { header: t("festival_name"), body: festivalNameBodyTemplate},
    { header: t("products"), body: productBodyTemplate },
    { header: t("action"), body: actionBodyTemplate, headerStyle: { paddingLeft: '3%'} },
  ];

  const editFestProducts = (item) => {
    navigate(`${ROUTES_CONSTANTS.EDIT_FEST_PRODUCT}/${item?.id}`);
  };

  const confirmDeleteFestProducts = (item) => {
    setIsConfirm(!isConfirm);
    setDeleteId(item?.id);
  };

  const closeDialogbox = () => {
    setDeleteId(null);
    setIsConfirm(!isConfirm);
  };

  const confirmDialogbox = () => {
    setIsConfirm(!isConfirm);
    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_FEST_PRODUCTS_URL}/${deleteId}`, '', "delete")
      .then((response) => {
        if (response.status === 200) {
          fetchFestProductsList();
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
  };

  const fetchFestProductsList = () => {
    setLoader(true);
    let body = {
      search: search,
      skip: 0,
      limit:10
    }
    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_FEST_PRODUCTS_URL}/filter`, body , "post")
      .then((response) => {
        if (response.status === 200) {
          setData(response?.data?.data);
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

  useEffect(() => {
    fetchFestProductsList();
  }, [search]);

  const createFestProducts = () => {
    navigate(ROUTES_CONSTANTS.CREATE_FEST_PRODUCT);
  };

  const paginationChangeHandler = (skip, limit) => {
    setSkip(skip);
    setLimit(limit);
    fetchFestProductsList(skip, limit);
  };

  return (
    <div className="text-TextPrimaryColor">
      <Toast ref={toast} position="top-right" />
      <Confirmbox
        isConfirm={isConfirm}
        closeDialogbox={closeDialogbox}
        confirmDialogbox={confirmDialogbox}
      />
      <Breadcrum item={item} />
      <div className="mt-4 flex justify-end bg-BgSecondaryColor border rounded border-BorderColor p-2">
        <ButtonComponent
          onClick={() => createFestProducts()}
          type="submit"
          label={t("create_fest_special")}
          className="rounded bg-TextPrimaryColor px-6 py-2 text-[12px] text-white"
        />
      </div>
      <div className="mt-4">
        <DataTable
          className="bg-BgPrimaryColor border rounded border-BorderColor"
          columns={columns}
          data={data}
          skip={skip}
          rows={limit}
          total={total}
          paginationChangeHandler={paginationChangeHandler}
          loader={loader}
          showGridlines={true}
        />
      </div>
    </div>
  );
};

export default FestivalSpecialList;
