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

const Register = () => {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [menuList, setMenuList] = useState([]);
  const [footerRangeList, setFooterRangeList] = useState([]);

  const fetchMenuList = () => {
    setLoader(true);
    allApi(API_CONSTANTS.MENU_LIST_URL, "" , "get")
    .then((response) => {
      if (response.status === 200) {
          let data = response?.data.filter((item, index)=> index <= 6);
          setFooterRangeList(data);
          data.push({name: "About Us"});
          setMenuList(data)
      } 
    })
    .catch((err) => {
      setLoader(false);
    }).finally(()=>{
      setLoader(false);
    });
  };

  useEffect(()=>{
    fetchMenuList();
  },[]);

  return (
    <>
      {loader ? <Loading/> : 
      <>
        <Navbar data={menuList}/>
        <div className="mt-[8rem] flex flex-col items-center justify-center bg-white px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-[#1D2E43] font-[playfair] font-bold">{t("help_desk")}</h1>
          <div className="text-sm text-gray-600 mt-2">
            <span className="hover:cursor-pointer" onClick={()=>{ navigate("/") }}>{t("home")}</span> <span className="mx-1 text-[11px]">&gt;</span> <span>{t("help_desk")}</span>
          </div>
        </div>

        <div className="w-full max-w-md">
            <div className="text-2xl text-[#1D2E43] mb-1 font-[playfair] text-center">
                {t("for_any_assitance_email_us_at")}
            </div>
            <div className='w-full text-center'>
                <a href={`mailto:${shopdata?.email}`} className="text-blue-600 text-[1rem] underline">
                    {shopdata?.email}
                </a>    
            </div>
        </div>
        </div>
        <Footer data={footerRangeList}/>
      </>
      }
    </>
  )
}

export default Register