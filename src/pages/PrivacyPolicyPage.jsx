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

const PrivacyPolicyPage = () => {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation("msg");
  const [footerRangeList, setFooterRangeList] = useState([]);
  const [menuList, setMenuList] = useState([]);
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
                    {t("privacy_policy")}
                </h1>
                <div className="text-xs sm:text-sm text-gray-600 mt-5">
                    <span
                    className="hover:cursor-pointer"
                    onClick={() => navigate("/")}
                    >
                    {t("home")}
                    </span>
                    <span className="mx-2">&gt;</span>
                    <span>{t("privacy_policy")}</span>
                </div>
              </div>
          </section>

          <section className='p-4'>
            <p className='text-[0.9rem] font-[500]'>
              {t('privacy_policy_desc1')}
            </p>
            <p className='text-[0.9rem] font-[500] mt-1'>
              {t('privacy_policy_desc2')}
            </p>
            <p className='text-[0.9rem] font-[500] mt-1'>
              {t('privacy_policy_desc3')}
            </p>
          </section>

          <section className='p-4'>
            <p className='captalize text-[1.8rem] font-[600] text-[#1D2E43] font-[playfair]'>{t("consent")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("consent_desc")}</p>
          </section>

          <section className='p-4'>
            <p className='captalize text-[1.8rem] font-[600] text-[#1D2E43] font-[playfair]'>{t("information_we_collect")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("information_we_collect_desc1")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("information_we_collect_desc2")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("information_we_collect_desc3")}</p>
          </section>

          <section className='p-4'>
            <p className='captalize text-[1.8rem] font-[600] text-[#1D2E43] font-[playfair]'>{t("how_we_use_your_information")}</p>
            <p className='mt-1 captalize text-[1.2rem] font-[600] text-[#1D2E43] font-[playfair]'>{t("how_we_use_your_information_desc1")}</p>
            <p className='ps-4 mt-4 text-[0.9rem] font-[500]'>{t("how_we_use_your_information_desc2")}</p>
            <p className='ps-4 mt-2 text-[0.9rem] font-[500]'>{t("how_we_use_your_information_desc3")}</p>
            <p className='ps-4 mt-2 text-[0.9rem] font-[500]'>{t("how_we_use_your_information_desc4")}</p>
            <p className='ps-4 mt-2 text-[0.9rem] font-[500]'>{t("how_we_use_your_information_desc5")}</p>
            <p className='ps-4 mt-2 text-[0.9rem] font-[500]'>{t("how_we_use_your_information_desc6")}</p>
            <p className='ps-4 mt-2 text-[0.9rem] font-[500]'>{t("how_we_use_your_information_desc7")}</p>
            <p className='ps-4 mt-2 text-[0.9rem] font-[500]'>{t("how_we_use_your_information_desc8")}</p>
          </section>

          <section className='p-4'>
            <p className='captalize text-[1.8rem] font-[600] text-[#1D2E43] font-[playfair]'>{t("log_files")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("log_files_desc")}</p>
          </section>

          <section className='p-4'>
            <p className='captalize text-[1.8rem] font-[600] text-[#1D2E43] font-[playfair]'>{t("cookies_web_beacons")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("cookies_web_beacons_desc1")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("cookies_web_beacons_desc2")}</p>
          </section>

          <section className='p-4'>
            <p className='captalize text-[1.8rem] font-[600] text-[#1D2E43] font-[playfair]'>{t("advertising_partners_privacy_policies")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("advertising_partners_privacy_policies_desc1")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("advertising_partners_privacy_policies_desc2")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("advertising_partners_privacy_policies_desc3")}</p>
          </section>

          <section className='p-4'>
            <p className='captalize text-[1.8rem] font-[600] text-[#1D2E43] font-[playfair]'>{t("third_party_privacy_policies")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("third_party_privacy_policies_desc1")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("third_party_privacy_policies_desc2")}</p>
          </section>

          <section className='p-4'>
            <p className='captalize text-[1.8rem] font-[600] text-[#1D2E43] font-[playfair]'>{t("CCPA_privacy_rights")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("CCPA_privacy_rights_desc1")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("CCPA_privacy_rights_desc2")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("CCPA_privacy_rights_desc3")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("CCPA_privacy_rights_desc4")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("CCPA_privacy_rights_desc5")}</p>
          </section>

          <section className='p-4'>
            <p className='captalize text-[1.8rem] font-[600] text-[#1D2E43] font-[playfair]'>{t("GDPR_data_protection_rights")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("GDPR_data_protection_rights_desc1")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("GDPR_data_protection_rights_desc2")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("GDPR_data_protection_rights_desc3")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("GDPR_data_protection_rights_desc4")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("GDPR_data_protection_rights_desc5")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("GDPR_data_protection_rights_desc6")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("GDPR_data_protection_rights_desc7")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("GDPR_data_protection_rights_desc8")}</p>
          </section>

          <section className='p-4'>
            <p className='captalize text-[1.8rem] font-[600] text-[#1D2E43] font-[playfair]'>{t("children_information")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("children_information_desc1")}</p>
            <p className='mt-2 text-[0.9rem] font-[500]'>{t("children_information_desc2")}</p>
          </section>

          <Footer data={footerRangeList}/>
        </>
      }
    </>
  );
};

export default PrivacyPolicyPage;