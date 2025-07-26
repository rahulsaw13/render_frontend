import { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Components
import Navbar from "@userpage/Navbar";
import Footer from "@userpage/Footer";
import CustomerReview from "@userpage-components/CustomerReview";
import ShopOurSnackRange from '@userpage-components/ShopOurSnackRange';
import { allApi } from "@api/api";
import { API_CONSTANTS } from "@constants/apiurl";
import Loading from '@common/Loading';

const ProductDescription = () => {
  const location = useLocation();
  const { id, image_url, name, variants, shelf_life } = location?.state || {};
  const [discountedPrice, setDiscountedPrice] = useState(variants?.[0]?.discountedPrice);
  const [actualPrice, setActualPrice] = useState(variants?.[0]?.actualPrice);
  const [productWeight, setProductWeight] = useState(variants?.[0]?.weight);
  const [features, setFeatures] = useState([]);
  const [loader, setLoader] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const [menuList, setMenuList] = useState([]);
  const [snacksRangeData, setSnacksRangeData] = useState([]);
  const [footerRangeList, setFooterRangeList] = useState([]);
  const [productReviews, setProductReviews] = useState({
    rating: 0,
    overallReviews: 0
  });
  const { t } = useTranslation("msg");

  const reviewData = (rating, overallReviews) => {
    setProductReviews({
      rating: rating,
      overallReviews: overallReviews
    });
  }

  useLayoutEffect(() => {
    prefilledData[0].text = shelf_life + " " + "Days shelf life";
    let data = prefilledData;
    setFeatures(data); 
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoader(true);
    const promises = [
      getSnackData(),
      fetchMenuList(),
      getProductReview()
    ];
    const settledResults = await Promise.allSettled(promises);
    if (settledResults) {
      setLoader(false);
    }
  }

  const prefilledData = [
    {
      icon: "ri-archive-line text-[14px]",
      text: t("25_days_shelf_life"),
    },
    {
      icon: "ri-map-pin-line text-[14px]",
      text: t("5days_delivery_pan_india"),
    },
    {
      icon: "ri-earth-line text-[14px]",
      text: t("international_shipping_available"),
    },
  ];

  const getSnackData = () => {
    return allApi(API_CONSTANTS.SNACK_RANGE_URL, "", "get")
      .then((response) => {
        if (response?.status === 200) {
          setSnacksRangeData(response?.data);
        }
      })
      .catch((err) => {})
      .finally(() => {});
  }

  const changeHandler = (weight) => {
    let obj = variants?.find((item) => item?.weight === weight);
    setDiscountedPrice(obj?.discountedPrice);
    setActualPrice(obj?.actualPrice);
    setProductWeight(obj?.weight);
  };

  const fetchMenuList = () => {
    return allApi(API_CONSTANTS.MENU_LIST_URL, "", "get")
      .then((response) => {
        if (response.status === 200) {
          let data = response?.data.filter((item, index) => index <= 6);
          setFooterRangeList(data);
          data.push({ name: "About Us" });
          setMenuList(data);
        }
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const getProductReview = () => {
    let data = {
      id: id
    }
    return allApi(API_CONSTANTS.PRODUCT_REVIEW_BY_ID_URL, data, "post")
      .then((response) => {
        if (response?.status === 200) {
          let averageRating = 0;
          response?.data?.forEach((item, index) => {
            averageRating = averageRating + item?.rating;
          });
          const roundedRating = Math.round(averageRating / response?.data?.length);
          setOverallRating(roundedRating);
          reviewData(roundedRating, response?.data?.length);
          setReviews(response?.data);
        }
      })
      .catch((err) => {})
      .finally(() => {});
  };

  return (
    <>
      {loader ? <Loading /> :
        <>
          <Navbar data={menuList} />
          <div className="mx-4 md:mx-16 p-4 mt-20">
            {/* Product Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side - Image */}
              <div>
                <img
                  src={image_url}
                  alt="Mysore Pak"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              {/* Right Side - Details */}
              <div>
                <h2 className="text-2xl font-semibold">{name} - {productWeight}</h2>
                <div className="flex items-center space-x-2 text-yellow-500 mt-2">
                  {[...Array(5)].map((item, index) => {
                    if (productReviews?.rating <= index) {
                      return (<i className="ri-star-line" key={index}></i>);
                    }
                    else {
                      return (<i className="ri-star-fill" key={index}></i>);
                    }
                  })}
                  <span className="text-gray-500 ps-4">({productReviews?.overallReviews} {t("reviews")})</span>
                </div>
                <p className="text-lg font-bold mt-1">₹ {discountedPrice} {discountedPrice < actualPrice ? <span className='ms-4 text-gray-500 font-[600] line-through'>₹ {actualPrice}</span> : null}</p>

                <div className="flex flex-col mt-8 md:flex-row justify-center gap-8 text-center">
                  {features?.map((feature, index) => (
                    <div key={feature?.id} className="flex flex-col items-center w-full md:w-[30%]">
                      <div className="w-8 h-8 flex items-center justify-center bg-[#cca438] text-white rounded-full text-2xl">
                        <i className={feature?.icon}></i>
                      </div>
                      <p className="mt-2 text-gray-700 text-sm">{feature?.text}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-lg font-bold mt-1">{t("weight")}</p>
                  <div className='flex gap-2 mt-2 flex-wrap'>
                    {variants?.map((item) => {
                      const isSelected = productWeight === item?.weight;
                      return (
                        <div key={item?.id} onClick={() => { changeHandler(item?.weight) }}  className={`hover:cursor-pointer font-[600] border border-[#caa446] rounded-md overflow-hidden w-[100px] h-[50px] flex items-center justify-center transition-all duration-300
                          ${isSelected ? 'bg-[#caa446] text-white' : 'bg-white text-black hover:bg-[#caa446] hover:text-white'}`}>
                          {item?.weight}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full mt-12">
                  <div className='flex flex-wrap gap-4'>
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#caa446] rounded-md overflow-hidden min-w-[113px]">
                      <button className="px-3 py-2 text-lg hover:bg-gray-200 w-fit h-full" onClick="decreaseQty()">−</button>
                      <span id="quantity" className="px-4 py-2 text-lg font-[Tektur] w-fit">1</span>
                      <button className="px-3 py-2 text-lg hover:bg-gray-200 w-fit h-full" onClick="increaseQty()">+</button>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="w-full bg-[#cca438] text-white font-medium py-3 rounded-md transition-all duration-300 border hover:bg-white hover:text-[#cca438] hover:border hover:border-[#caa446]">
                      {t("add_to_cart")}
                    </button>
                  </div>

                  {/* Buy it now Button */}
                  <button className="w-full bg-[#cca438] text-white font-medium py-3 rounded-md mt-2 transition-all duration-300 border hover:bg-white hover:text-[#cca438] hover:border hover:border-[#caa446]">
                    {t("buy_it_now")}
                  </button>

                  {/* Info Section */}
                  <div className="mt-4 p-8 rounded-md">
                    {[{ icon: "ri-heart-line", text: t("freshly_made_to_order") },
                    { icon: "ri-leaf-line", text: t("preservation_free_day_shelf_life", { days: shelf_life }) },
                    { icon: "ri-gift-line", text: t("premium_safe_packaging") },
                    ].map((item, index) => (
                      <div key={item?.id} className="flex items-center gap-2 mb-2 text-gray-800">
                        <i className={`${item?.icon} text-red-600 text-xl`}></i>
                        <span className="text-[14px]">{item?.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-10 text-center">
              <h3 className="text-[#1D2E43] font-[playfair] text-[36px] font-bold">Elevating The Culinary Experience</h3>
              <p className="text-gray-500">By exquisite sourcing, impeccable craftsmanship</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                {[{ title: "Quality Assurance", desc: "Certified, sourced ingredients, unparalleled authenticity.", icon: "" },
                { title: "Purity in Every Bite", desc: "All products are free of artificial flavours or added preservatives.", icon: "" },
                { title: "Crafting Authenticity", desc: "We hire our karigars, maintaining our high standards for product excellence", icon: "" },
                { title: "Worldwide Shipping", desc: "We adhere to global hygiene standards.", icon: "" }].map((item, index) => (
                  <div key={item?.id} className="flex flex-col items-center">
                    <div className="text-4xl"><i className={`${item?.icon}`}></i></div>
                    <h4 className="font-[playfair] text-[#1D2E43] text-[1.3rem]">{item?.title}</h4>
                    <p className="text-gray-500 text-sm">{item?.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 p-4">
            <CustomerReview id={id} getProductReview={getProductReview} reviews={reviews} overallRating={overallRating} />
          </div>

          <div className="mt-24">
            <ShopOurSnackRange title="Shop Our Snack Range" data={snacksRangeData} />
          </div>

          <div>
            <Footer data={footerRangeList}/>
          </div>
        </>
      }
    </>
  );
}

export default ProductDescription;