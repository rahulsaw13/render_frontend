// Libraries
import { useEffect, useState, lazy } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import 'swiper/css/bundle';

// Components
import ProductBuyCard from '@userpage-components/ProductBuyCard';
import { API_CONSTANTS } from "@constants/apiurl";
import { allApi } from "@api/api";
import Loading from '@common/Loading';

const Navbar = lazy(() => import("@userpage/Navbar"));
const Footer = lazy(() => import("@userpage/Footer"));

const ProductsPage = () => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [footerRangeList, setFooterRangeList] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const getAllProducts=()=>{
    allApi(API_CONSTANTS.ALL_PRODUCTS_URL, "", "get")
    .then((response) => {
    if(response?.status === 200){
        setAllProducts(response?.data)
    }
    })
    .catch((err) => {
    }).finally(()=> {
    });
  };

  useEffect(()=>{
    fetchData();
  },[]);

  const fetchData = async () => {
    setLoader(true);
    const promises = [
      getAllProducts(),
      fetchMenuList()
    ]
    const settledResults = await Promise.allSettled(promises);
    if(settledResults){
      setLoader(false);
    }
  };

  const fetchMenuList = () => {
    return allApi(API_CONSTANTS.MENU_LIST_URL, "" , "get")
    .then((response) => {
      if (response.status === 200) {
          let data = response?.data.filter((item, index) => index <= 6);
          setFooterRangeList(data);
          data.push({name: "About Us"});
          setMenuList(data)
      } 
    })
    .catch((err) => {
    }).finally(()=>{
    });
  };

  return (
   <>
   { loader ? <Loading/> : 
    <>
        <Navbar data={menuList}/>
        <div className="px-4 sm:px-6 md:px-10 py-10 mt-16">
            <h1 className="text-center text-[1.8rem] sm:text-[2.2rem] md:text-[2.5rem] font-bold mb-6 text-[#1D2E43] font-[playfair]">
                {t("wide_products_range")}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allProducts?.map((item) => (
                    <ProductBuyCard key={item.id} data={item} />
                ))}
            </div>
        </div>
        <Footer data={footerRangeList}/>
    </>
   }
   </>
  );
};

export default ProductsPage;