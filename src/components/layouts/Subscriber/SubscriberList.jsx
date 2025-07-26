// hooks
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// components
import Breadcrum from "@common/Breadcrum";
import DataTable from "@common/DataTable";
import { allApiWithHeaderToken } from "@api/api";
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import { API_CONSTANTS } from "@constants/apiurl";
import { refactorPrefilledDate } from '@helper';

const SubscriberList = ({search}) => {
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const [loader, setLoader] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  const item = {
    heading: t("subscribers"),
    routes: [
      { label: t("dashboard"), route: ROUTES_CONSTANTS.DASHBOARD },
      { label: t("subscribers"), route: ROUTES_CONSTANTS.SUBSCRIBER },
    ],
  };

  const [data, setData] = useState([]);

  const dateBodyTemplate= (rowData) => {
    return (
      <>
        {refactorPrefilledDate(rowData?.created_at)}
      </>
    );
  };

  const columns = [
    { field: "email", header: t("user_email")},
    { header: t("subscribed_date"), body: dateBodyTemplate}
  ];

  const fetchSubscriberList = (sk=skip, li=limit) => {
    setLoader(true);
    let body = {
      search: search,
      skip: sk,
      limit: li
    }
    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_SUBSCIBER_URL}/filter`, body , "post")
      .then((response) => {
        if (response.status === 200) {
          setData(response?.data?.data);
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

  useEffect(() => {
    fetchSubscriberList(0,5);
  }, [search]);

  const paginationChangeHandler = (skip, limit) => {
    setSkip(skip);
    setLimit(limit);
    fetchSubscriberList(skip, limit);
  };

  return (
    <div className="text-TextPrimaryColor">
      <Breadcrum item={item} />
      <div className="mt-4 flex justify-start bg-BgSecondaryColor border rounded border-BorderColor p-2 py-3">
        <span className="text-[13px] text-TextPrimaryColor ms-[4px] font-[600]">
          {t("subscribed_users")}  
        </span> 
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

export default SubscriberList;