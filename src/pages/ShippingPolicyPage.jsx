// utils
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Components
import Loading from '@common/Loading';
import Navbar from '@userpage/Navbar';
import Footer from '@userpage/Footer';
import { allApi } from "@api/api";
import { API_CONSTANTS } from "@constants/apiurl";
import { shopdata } from '@constants/shopdata.js';

const ShippingPolicyPage = () => {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation("msg");
  const [menuList, setMenuList] = useState([]);
  const [footerRangeList, setFooterRangeList] = useState([]);
  const navigate = useNavigate();

  const fetchMenuList = () => {
    setLoader(true);
    allApi(API_CONSTANTS.MENU_LIST_URL, "", "get")
      .then((response) => {
        if (response.status === 200) {
          let data = response?.data?.filter((item, index) => index <= 6);
          setFooterRangeList(data);
          data.push({ name: "About Us" });
          setMenuList(data);
        }
      })
      .catch(() => setLoader(false))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    fetchMenuList();
  }, []);

  return (
    <>
      {loader ? <Loading /> :
        <>
          <Navbar data={menuList} />

          <section className="container mx-auto mt-16 px-4 py-8 items-center w-full">
              <div className="text-center mb-6">
                <h1 className="text-[2.1rem] sm:text-4xl text-[#1D2E43] font-[playfair] font-bold">
                    {t("shipping_policy")}
                </h1>
                <div className="text-xs sm:text-sm text-gray-600 mt-5">
                    <span
                    className="hover:cursor-pointer"
                    onClick={() => navigate("/")}
                    >
                    {t("home")}
                    </span>
                    <span className="mx-2">&gt;</span>
                    <span>{t("shipping_policy")}</span>
                </div>
              </div>
          </section>

          <section className='p-4'>
            <p className='mt-4 text-[0.9rem] font-[500]'>
              {t("shipping_policy_introduction")}
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-1 capitalize font-[600] text-[#1D2E43]'>{t("1_general")}:</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("general_description")}</p>
          </section>

          <section className='p-4'>
            <p className='mt-1 capitalize font-[600] text-[#1D2E43]'>{t("2_shipping_costs")}</p>
            <p className='mt-1 capitalize font-[600] text-[#1D2E43]'>{t("2.1_domestic_shipping")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("domestic_shipping_description")}</p>
          </section>

          <section className='p-4'>
            <p className='mt-1 capitalize font-[600] text-[#1D2E43]'>{t("2.2_international_shipping")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("2.2_international_shipping_description")}</p>
          </section>

          <section className='p-4'>
            <p className='mt-1 capitalize font-[600] text-[#1D2E43]'>{t("3.delivery_terms")}</p>
            <p className='mt-1 capitalize font-[600] text-[#1D2E43]'>{t("3.1_transit_time_domestically")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>
              {t("3.1_transit_time_domestically_description")}
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-1 capitalize font-[600] text-[#1D2E43]'>{t("3.2_dispatch_time")}:</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("3.2_dispatch_time_description")}</p>
          </section>

          <section className='p-4'>
            <p className='mt-1 font-[600] text-[#1D2E43]'>{t("3.3_chnage_of_delivery_address")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>
              {t("3.3_chnage_of_delivery_address_desc")}
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-1 capitalize font-[600] text-[#1D2E43]'>{t("3.4_items_out_of_stock")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>
                {t("3.4_items_out_of_stock_desc")}
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-1 capitalize font-[600] text-[#1D2E43]'>{t("3.5_items_out_of_stock")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'> 
              {t("3.5_items_out_of_stock_desc")}
            </p>
          </section>

          <section className='p-4'>
            <p className='capitalize font-[600] text-[#1D2E43]'>{t("4_tracking_notification")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>
                {t("4_tracking_notification_desc")}
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-1 capitalize font-[600] text-[#1D2E43]'>{t("5_pracels_damaged_transit")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>
              {t("5_pracels_damaged_transit_desc")}             
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-1 capitalize font-[600] text-[#1D2E43]'>{t("6_duties_and_taxes")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>
              {t("6_duties_and_taxes_desc")}
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-1 capitalize font-[600] text-[#1D2E43]'>{t("7_cancellation")}:</p>
            <p className='mt-2 text-[0.9rem] font-[500]'> 
              {t("7_cancellation_desc")}
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-1 capitalize font-[600] text-[#1D2E43]'>{t("8_customer_service")}:</p>
            <p className='mt-2 text-[0.9rem] font-[500]'> 
              {t("8_customer_service_desc")} <a className='underline' href={`mailto:${shopdata?.email}`}>{shopdata?.email}</a>
            </p>
          </section>

          <Footer data={footerRangeList}/>
        </>
      }
    </>
  );
};

export default ShippingPolicyPage;