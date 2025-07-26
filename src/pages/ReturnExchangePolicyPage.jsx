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

const ReturnExchangePolicyPage = () => {
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

          <section className="container mx-auto px-4 mt-16 py-8 items-center w-full">
              <div className="text-center mb-6">
                <h1 className="text-[2.1rem] sm:text-4xl text-[#1D2E43] font-[playfair] font-bold">
                    {t("return_and_exchange_policy")}
                </h1>
                <div className="text-xs sm:text-sm text-gray-600 mt-5">
                    <span
                    className="hover:cursor-pointer"
                    onClick={() => navigate("/")}
                    >
                    {t("home")}
                    </span>
                    <span className="mx-2">&gt;</span>
                    <span>{t("return_and_exchange_policy")}</span>
                </div>
              </div>
          </section>

          <section className='p-4'>
            <p className='mt-4 text-[0.9rem] leading-10 font-[500]'>
              {t("return_policy_introduction_desc1")} {shopdata?.email} <br />
              {t("return_policy_introduction_desc2")} <br />
              {t("return_policy_introduction_desc3")} <br />
            </p>
          </section>

          <section className='p-4'>
            <p className='mt-2 uppercase font-[600] text-[1.3rem] text-[#1D2E43]'>{t("interpretation_and_defination")}:</p>
          </section>

          <section className='p-4'>
            <p className='uppercase font-[600] text-[#1D2E43]'>{t("interpretation")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("interpretation_desc")}</p>
          </section>

          <section className='p-4'>
            <p className='uppercase font-[600] text-[#1D2E43]'>{t("definition")}</p>
            <p className='mt-2 text-[0.9rem] leading-10 font-[500]'>
              {t("definition_desc1")} <br />
              {t("definition_desc2")} <br />
              {t("definition_desc3")} <br />
              {t("definition_desc4")} <br />
              {t("definition_desc5")} <br />
              {t("definition_desc6")} <br />
              {t("definition_desc7")}
            </p>
          </section>

          <section className='p-4'>
            <p className='uppercase font-[600] text-[#1D2E43]'>{t("general_return_policy")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>
              {t("general_return_policy_desc")}
            </p>
          </section>

          <section className='p-4'>
            <p className='uppercase font-[600] text-[#1D2E43]'>{t("refund_policy")}:</p>
            <p className='mt-2 text-[0.9rem] leading-10 font-[500]'>
              {t("refund_policy_desc")} <br />
              {t("refund_policy_desc1")} <br />
              {t("refund_policy_desc2")} <br />
              {t("refund_policy_desc3")} <br />
              {t("refund_policy_desc4")} <br />
              {t("refund_policy_desc5")}
            </p>
          </section>

          <section className='p-4'>
            <p className='uppercase font-[600] text-[#1D2E43]'>{t("how_to_initiate_a_return")}</p>
            <p className='mt-2 text-[0.9rem] leading-10 font-[500]'>
              {t("how_to_initiate_a_return_desc")} <br/>
              {t("email_address")} <a className='underline' href={`mailto:${shopdata?.email}`}>{shopdata?.email}</a> <br/>
              {t("you_will_be_updated_for_return_desc")} 
            </p>
          </section>

          <Footer data={footerRangeList}/>
        </>
      }
    </>
  );
};

export default ReturnExchangePolicyPage;