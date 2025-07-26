// utils
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';

const Speciality = ({ data }) => {
  const { t } = useTranslation("msg");

  return (
    <div className="w-full bg-white my-12 relative lg:h-[500px] pt-[4rem]">
      <div className="flex flex-col rounded-md overflow-hidden">
        {/* Left Section */}
        <div className="w-full bg-[#ede9dd] h-[385px] py-10 px-6 sm:py-14 sm:px-10">
          <div className="flex flex-col justify-start items-start border-[#af2037] border-l-4 sm:border-l-8 rounded-md p-6 sm:p-8">
            <img
              src="https://cdn.shopify.com/s/files/1/0569/3456/4001/files/Guilt_Free_Sweets_top_icon_8e04c652-9c48-4fdd-92ed-440d9ef25c5d.svg?v=1709719757"
              alt="design"
              className="w-[11rem] h-10 mb-4"
            />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold pb-2 text-[#1D2E43] font-[playfair]">
              {t("our_speciality")}
            </h1>
            <p className="mb-4 w-[300px] text-sm sm:text-base text-black">
              {t("our_speciality_desc")}
            </p>
            <button className="px-6 py-2 text-sm sm:text-base text-white bg-[#caa446] rounded-md transition-all duration-300 border border-transparent hover:bg-transparent hover:text-yellow-600 hover:border-yellow-600">
              {t("see_all")}
            </button>
          </div>
        </div>
      </div>
      <div className="w-[70%] absolute right-0 top-0">
          <Swiper
            spaceBetween={10}
            breakpoints={{
              320: { slidesPerView: 1.1 },
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2.5 },
            }}
            allowTouchMove={true}
            loop={true}
          >
            {data.map((item) => (
              <SwiperSlide key={item?.id}>
                <div className="flex flex-col cursor-pointer select-none px-2">
                  <div className="h-[350px] sm:h-[420px] lg:h-[500px] relative rounded-lg overflow-hidden bg-white shadow-md">
                    <img
                      src={item?.image_url}
                      className="w-full h-full object-cover"
                      alt={item?.name}
                      draggable="false"
                    />
                    <h1 className="absolute w-full text-center bottom-0 left-1/2 transform -translate-x-1/2 text-white text-lg sm:text-xl font-bold bg-black bg-opacity-15 py-3">
                      {item?.name}
                    </h1>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
      </div>
    </div>
  );
};

export default Speciality;