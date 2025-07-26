// Libraries
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import 'swiper/css/bundle';

// Components
import ProductBuyCard from '@userpage-components/ProductBuyCard';

const DashboardProducts = ({ data }) => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();

  const moreProducts=()=>{
    navigate("/products")
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 py-10">
      <h1 className="text-[1.8rem] sm:text-[2.2rem] md:text-[2.5rem] font-bold text-left mb-6 text-[#1D2E43] font-[playfair]">
        {t("wide_products_range")}
      </h1>

      <Swiper
        spaceBetween={16}
        loop={true}
        allowTouchMove={true}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
          },
          480: {
            slidesPerView: 1.5,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {data?.map((item) => (
          <SwiperSlide key={item?.id}>
            <ProductBuyCard data={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-16 flex justify-center">
        <button onClick={moreProducts} className="relative px-6 text-[1.1rem] py-2 text-white bg-black rounded-md transition-all duration-300 border-[3px] border-transparent hover:border-yellow-500">
          {t("explore_now")}
        </button>
      </div>
    </div>
  );
};

export default DashboardProducts;