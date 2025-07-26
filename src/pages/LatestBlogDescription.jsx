import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { API_CONSTANTS } from "@constants/apiurl";
import { allApi } from "@api/api";

// Components
import { refactorPrefilledDate } from '@helper';
import Navbar from "@userpage/Navbar";
import Footer from "@userpage/Footer";

const LatestBlogDescription = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("msg");
  const [menuList, setMenuList] = useState([]);
  const [footerRangeList, setFooterRangeList] = useState([]);
  const { image_url, heading, description, createdAt } = location.state || {};

  const fetchMenuList = () => {
    return allApi(API_CONSTANTS.MENU_LIST_URL, "", "get")
      .then((response) => {
        if (response.status === 200) {
          let data = response?.data.filter((item, index)=> index <= 6);
          setFooterRangeList(data);
          data.push({name: "About Us"});
          setMenuList(data);
        }
      })
      .catch((err) => {
        // handle error
      });
  };

  useEffect(() => {
    fetchMenuList();
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <Navbar data={menuList} />

      {/* Header image and blog info */}
      <div className="relative px-4 sm:px-8 md:px-16 lg:px-24">
        <img src={image_url} alt="blog-img" className="w-full max-h-[500px] object-cover rounded-md" />

        <div className="bg-white shadow-lg p-4 sm:p-6 md:px-12 md:py-6 absolute left-1/2 -translate-x-1/2 top-[85%] w-[90%] sm:w-[80%] md:w-[70%] text-center rounded-md">
          <div className="uppercase text-xs sm:text-sm text-gray-500">{t("blogs")}</div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-[#1D2E43] font-[playfair]">{heading}</div>
          <div className="text-sm text-gray-500">{refactorPrefilledDate(createdAt)}</div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-40 px-4 sm:px-8 md:px-16 lg:px-32 leading-relaxed tracking-wide text-justify">
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>

      {/* Divider */}
      <div className="my-10 px-4 sm:px-8 md:px-16 lg:px-32">
        <hr />
      </div>

      {/* Back button */}
      <div className="flex items-center gap-2 mb-10 px-4 sm:px-8 md:px-16 lg:px-32">
        <i
          className="ri-corner-down-left-line text-xl hover:cursor-pointer"
          onClick={() => navigate("/")}
        ></i>
        <span
          className="text-sm sm:text-base hover:cursor-pointer"
          onClick={() => navigate("/")}
        >
          {t("previous")}
        </span>
      </div>

      <Footer data={footerRangeList}/>
    </div>
  );
};

export default LatestBlogDescription;