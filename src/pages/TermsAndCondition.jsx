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

const TermsAndCondition = () => {
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

          <section className="container mx-auto px-4 py-8 items-center w-full mt-16">
              <div className="text-center mb-6">
                <h1 className="text-[2.1rem] sm:text-4xl text-[#1D2E43] font-[playfair] font-bold">
                    {t("terms_and_conditions")}
                </h1>
                <div className="text-xs sm:text-sm text-gray-600 mt-5">
                    <span
                    className="hover:cursor-pointer"
                    onClick={() => navigate("/")}
                    >
                    {t("home")}
                    </span>
                    <span className="mx-2">&gt;</span>
                    <span>{t("terms_and_conditions")}</span>
                </div>
              </div>
          </section>

          <section className='p-4'>
            <p className='text-[0.9rem] font-[600]'>{t("website_terms_policy")}</p>
            <p className='mt-8 uppercase font-[600] text-[#1D2E43]'>{t("introduction")}:</p>
            <p className='mt-4 text-[0.9rem] font-[500]'>
                {t("introduction_description_desc1")}
            </p>
            <p className='mt-4 text-[0.9rem] font-[500]'>
                {t("introduction_description_desc2")}
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-8 uppercase font-[600] text-[#1D2E43]'>{t("electronic_communication")}:</p>
            <p className='mt-4 text-[0.9rem] font-[500]'>{t("electronic_communication_description")}</p>
          </section>

          <section className='p-4'>
            <p className='mt-8 uppercase font-[600] text-[#1D2E43]'>{t("copyright")}</p>
            <p className='mt-4 text-[0.9rem] font-[500]'>{t("copyright_description")}</p>
          </section>

          <section className='p-4'>
            <p className='mt-8 uppercase font-[600] text-[#1D2E43]'>{t("trademarks")}:</p>
            <p className='mt-4 text-[0.9rem] font-[500]'>{t("trademarks_description")}</p>
          </section>

          <section className='p-4'>
            <p className='mt-8 uppercase font-[600] text-[#1D2E43]'>{t("your_login_account")}:</p>
            <p className='mt-4 text-[0.9rem] font-[500]'>
              {t("your_login_account_description")}
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-8 uppercase font-[600] text-[#1D2E43]'>{t("risk_of_loss")}:</p>
            <p className='mt-4 text-[0.9rem] font-[500]'>{t("risk_of_loss_description")}</p>
          </section>

          <section className='p-4'>
            <p className='mt-8 text-[0.9rem] font-[600]'>{t("terms_and_conditions")}:</p>
            <p className='mt-4 uppercase font-[600] text-[#1D2E43]'>{t("acceptance_of_your_order")}</p>
            <p className='mt-4 text-[0.9rem] font-[500]'>{t("acceptance_of_your_order_subheading")}:</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>
                {t("acceptance_of_your_order_desc1")} <br />
                {t("acceptance_of_your_order_desc2")} <br />
                {t("acceptance_of_your_order_desc3")} <br />
                {t("acceptance_of_your_order_desc4")} <br />
                {t("acceptance_of_your_order_desc5")}
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-8 uppercase font-[600] text-[#1D2E43]'>{t("online")}</p>
            <p className='mt-4 text-[0.9rem] font-[500]'>
                {t("online_desc1")} <br />
                {t("online_desc2")} <br />
                {t("online_desc3")} <br />
                {t("online_desc4")} <br />
                {t("online_desc5")}
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-8 uppercase font-[600] text-[#1D2E43]'>{t("order_cancellation")}</p>
            <p className='mt-4 text-[0.9rem] font-[500]'> 
              {t("order_cancellation_desc1")} <br />
              {t("order_cancellation_desc2")} <br />
              {t("order_cancellation_desc3")}
            </p>
          </section>

          <section className='p-4'>
            <p className='uppercase font-[600] text-[#1D2E43]'>{t("payment_and_refund_policy")}</p>
            <p className='mt-4 text-[0.9rem] font-[500]'>
                {t("payment_and_refund_policy_desc1")} <br />
                {t("payment_and_refund_policy_desc2")} <br />
                {t("payment_and_refund_policy_desc3")} <br />
                {t("payment_and_refund_policy_desc4")} <br />
                {t("payment_and_refund_policy_desc5")} <br />
                {t("payment_and_refund_policy_desc6")} <br />
                {t("payment_and_refund_policy_desc7")} <br />
                {t("payment_and_refund_policy_desc8")} <br />
                  {shopdata?.email} <br />
                {t("payment_and_refund_policy_desc9")}
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-8 uppercase font-[600] text-[#1D2E43]'>{t("pricing_policy")}</p>
            <p className='mt-4 text-[0.9rem] font-[500]'>
              {t("pricing_policy_desc1")} <br />
              {t("pricing_policy_desc2")} <br />
              {t("pricing_policy_desc3")}                 
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-8 uppercase font-[600] text-[#1D2E43]'>{t("product_availablity_information")}</p>
            <p className='mt-4 text-[0.9rem] font-[500]'>
              {t("product_availablity_information_desc1")} <br />
              {t("product_availablity_information_desc2")} <br />
              {t("product_availablity_information_desc3")} <br />
              {t("product_availablity_information_desc4")}
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-8 uppercase font-[600] text-[#1D2E43]'>{t("returns_refunds_and_title")}:</p>
            <p className='mt-4 font-[500] text-[0.9rem]'> 
              {t("returns_refunds_and_title_desc1")} <br />
              {t("returns_refunds_and_title_desc2")} <br />
              {t("returns_refunds_and_title_desc3")} <br />
              {t("returns_refunds_and_title_desc4")} 
            </p>
          </section>

          <Footer data={footerRangeList}/>
        </>
      }
    </>
  );
};

export default TermsAndCondition;