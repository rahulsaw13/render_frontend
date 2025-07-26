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
import { refactorPrefilledDate } from '@helper';

const OrderList = ({search}) => {
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
    heading: t("order"),
    routes: [
      { label: t("dashboard"), route: ROUTES_CONSTANTS.DASHBOARD },
      { label: t("order"), route: ROUTES_CONSTANTS.ORDERS },
    ],
  };

  const [data, setData] = useState([]);
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex">
        <ButtonComponent
          icon="ri-eye-line"
          className="text-[1rem]"
          onClick={() => viewOrder(rowData)}
        />
        <ButtonComponent
          icon="ri-delete-bin-line"
          className="text-[1rem]"
          onClick={() => confirmDeleteOrder(rowData)}
        />
      </div>
    );
  };

  const orderStatusBodyTemplate= (rowData) => {
    return (
      <div className="flex items-center gap-4">
        {rowData?.order_status === "Delivered" ? <span className="text-[green]">{rowData?.order_status}</span> : <span className="text-[grey]">{rowData?.order_status}</span>}
      </div>
    );
  };

  const paymentStatusBodyTemplate= (rowData) => {
    return (
      <div className="flex items-center gap-4">
        {rowData?.payment_status === "Approved" ? <span className="text-[green]">{rowData?.payment_status}</span> : <span className="text-[grey]">{rowData?.payment_status}</span>}
      </div>
    );
  };

  const columns = [
    { field: "id", header: t("order_no"), style: { width: "100px"}},
    { field: "total_price", header: t("total_price"), style: { width: "100px"}},
    { field: "shipping_address", header: t("shipping_address")},
    { field: "billing_address", header: t("billing_address")},
    { field: "created_at", header: t("created_at")},
    { header: t("payment_status"), body: paymentStatusBodyTemplate},
    { header: t("order_status"), body: orderStatusBodyTemplate, style: { width: "100px"} },
    { header: t("action"), body: actionBodyTemplate, headerStyle: { paddingLeft: '3%'} },
  ];

  const viewOrder = (item) => {
    navigate(`${ROUTES_CONSTANTS.VIEW_ORDER}/${item?.id}`);
  };

  const confirmDeleteOrder = (item) => {
    setIsConfirm(!isConfirm);
    setDeleteId(item?.id);
  };

  const closeDialogbox = () => {
    setDeleteId(null);
    setIsConfirm(!isConfirm);
  };

  const confirmDialogbox = () => {
    setLoader(true);
    setIsConfirm(!isConfirm);
    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_ORDER_URL}/${deleteId}`, '', "delete")
      .then((response) => {
        if (response.status === 200) {
          fetchOrderList();
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
      })
  };

  const fetchOrderList = (sk=skip, li=limit) => {
    setLoader(true);
    let body = {
      search: search,
      skip: sk,
      limit: li
    }
    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_ORDER_URL}/filter`, body , "post")
      .then((response) => {
        if (response.status === 200) {
           let updatedArray = [];
            response?.data.data?.forEach((item)=>{
              let obj = {
                ...item, 
                created_at: refactorPrefilledDate(item?.created_at)
              }
              updatedArray.push(obj)
            })
            setData(updatedArray);
            setTotal(response?.data?.total);
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

  const paginationChangeHandler = (skip, limit) => {
    setSkip(skip);
    setLimit(limit);
    fetchOrderList(skip, limit);
  };

  useEffect(() => {
    fetchOrderList(0,5);
  }, [search]);

  const createOrder = () => {
    navigate(ROUTES_CONSTANTS.CREATE_ORDER);
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
          onClick={() => createOrder()}
          type="submit"
          label={t("create_order")}
          className="rounded bg-TextPrimaryColor px-6 py-2 text-[12px] text-white"
          icon="pi pi-arrow-right"
          iconPos="right"
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

export default OrderList;
