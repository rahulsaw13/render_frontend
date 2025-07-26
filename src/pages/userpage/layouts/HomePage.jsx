// utils
import { useState, useLayoutEffect } from 'react';
import { useTranslation } from "react-i18next";

// components
import LatestBlog from '@userpage-components/LatestBlog';
import OurStory from '@userpage-components/OurStory';
import ShopOurSnackRange from '@userpage-components/ShopOurSnackRange';
import TrustUs from '@userpage-components/TrustUs';
import Speciality from '@userpage-components/Speciality';
import ShopOurRange from '@userpage-layouts/ShopOurRange';
import FestivalSpecial from '@userpage-layouts/FestivalSpecial';
import AvailablityPlatform from '@userpage-layouts/AvailablityPlatform';
import Benifits from '@userpage-layouts/Benifits';
import DashboardProducts from '@userpage-layouts/DashboardProducts';
import Collection from '@userpage-layouts/Collection';
import Navbar from '@userpage/Navbar';
import Footer from '@userpage/Footer';
import { allApi } from "@api/api";
import { API_CONSTANTS } from "@constants/apiurl";
import Loading from '@common/Loading';
import SmoothScrolling from "@userpage-components/SmoothScrolling";
import SweetShopBannerImage from "@assets/sweet_shop_banner.webp";

const HomePage = () => {
  const [loader, setLoader] = useState(false);
  const [snacksRangeData, setSnacksRangeData] = useState([]);
  const [specialityData, setSpecialityData] = useState([]);
  const [giftingCollectionData, setGiftingCollectionData] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [festSpecialList, setFestSpecialList] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [footerRangeList, setFooterRangeList] = useState([]);
  let imageIndices = [];
  const { t } = useTranslation("msg");

  useLayoutEffect(()=>{
    fetchData();
  },[]);

  const fetchData = async () => {
    setLoader(true);
  
    try {
      await getFestSpecialData();
      await Promise.all([
        fetchMenuList(),
        getAllCategoryData(),
        getAllProducts(),
        getGiftingCollectionData(),
        getSpecialityData(),
        getSnackData(),
        getBlogsData()
      ]);
    } catch (error) {
    } finally {
    }
  };

  const getAllCategoryData=()=>{
    return allApi(API_CONSTANTS.ALL_CATEGORY_URL, "", "get")
    .then((response) => {
      if(response?.status === 200){
        setAllCategories(response?.data)
      }
    })
    .catch((err) => {
    }).finally(()=> {
    });
  };

  const getSpecialityData=()=>{
    return allApi(API_CONSTANTS.SPECIALITY_CATEGORY_URL, "", "get")
    .then((response) => {
      if(response?.status === 200){
        setSpecialityData(response?.data)
      }
    })
    .catch((err) => {
    }).finally(()=> {
    });
  };

  const getSnackData=()=>{
    return allApi(API_CONSTANTS.SNACK_RANGE_URL, "", "get")
    .then((response) => {
      if(response?.status === 200){
        setSnacksRangeData(response?.data)
      }
    })
    .catch((err) => {
    }).finally(()=> {
    });
  };

  const getGiftingCollectionData=()=>{
    return allApi(API_CONSTANTS.GIFTING_CATEGORY_URL, "", "get")
    .then((response) => {
      if(response?.status === 200){
        setGiftingCollectionData(response?.data)
      }
    })
    .catch((err) => {
    }).finally(()=> {
    });
  };

  const getAllProducts=()=>{
    return allApi(API_CONSTANTS.ALL_PRODUCTS_URL, "", "get")
    .then((response) => {
      if(response?.status === 200){
        setAllProducts(response?.data)
      }
    })
    .catch((err) => {
    }).finally(()=> {
    });
  };

  const fetchMenuList = () => {
    return allApi(API_CONSTANTS.MENU_LIST_URL, "" , "get")
    .then((response) => {
      if (response.status === 200) {
          let data = response?.data.filter((item, index)=> index <= 6);
          setFooterRangeList(data);
          data.push({name: "About Us"});
          setMenuList(data)
      } 
    })
    .catch((err) => {
    }).finally(()=>{
    });
  };

  const getFestSpecialData = () => {
    return allApi(API_CONSTANTS.ACTIVE_FEST_SPECIAL, "", "get")
    .then((response) => {
      if(response?.status === 200){
        let localShopTemplate = {
          id: 2,
          image_url: SweetShopBannerImage,
          name: "Sweet Banner Image",
          products: ""
        };
        let updatedData = [...response?.data, localShopTemplate];
        setFestSpecialList(updatedData);
      }
    })
    .catch((err) => {
    }).finally(()=> {
    });
  };

  const getBlogsData = () => {
    return allApi(API_CONSTANTS.BLOGS_URL, "", "get")
    .then((response) => {
      if(response?.status === 200){
        setBlogData(response?.data)
      }
    })
    .catch((err) => {
    }).finally(()=> {
    });
  };
  
  return (
    <>
    <SmoothScrolling>
      <Navbar data={menuList} />
      <FestivalSpecial 
        data={festSpecialList} 
        onload={(item) => {
          imageIndices.push(item);
          if(JSON.stringify(imageIndices) === JSON.stringify([0])){
            setLoader(false);
          }
        }}
      />
      <ShopOurRange data={allCategories} />
      <Benifits />
      <DashboardProducts data={allProducts} />
      <Collection data={giftingCollectionData} />
      <Speciality data={specialityData} />
      <TrustUs />
      <ShopOurSnackRange title={t("shop_our_snack_range")} data={snacksRangeData} />
      <OurStory />
      <LatestBlog data={blogData} />
      <AvailablityPlatform />
      <Footer data={footerRangeList} />
    </SmoothScrolling>

    {/* Loader always rendered on top */}
    {loader && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
        <Loading />
      </div>
    )}
  </>
  )
}

export default HomePage;