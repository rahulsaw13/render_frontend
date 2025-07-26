// Utils
import { useNavigate } from 'react-router-dom';
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import { useTranslation } from "react-i18next";

const RangeCard = ({ data }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("msg");

  const collectionDescription=(item)=>{
      navigate(`${ROUTES_CONSTANTS.VIEW_CATEGORY_DESCRIPTION}/${item?.name}`);
  };

  return (
    <div className="flex flex-col cursor-pointer select-none">
    {/* Image Card */}
    <div className="relative w-full h-[280px] sm:h-[300px] md:h-[360px] lg:h-[380px] rounded-lg overflow-hidden bg-white shadow-md">
      {/* Diagonal Banner */}
      {data?.products_count === 0 && (
        <div className="absolute left-[-3.4rem] top-[2rem] w-[200px] transform -rotate-45 bg-red-500 text-white text-[0.75rem] sm:text-[0.75rem] font-semibold text-center py-1 shadow-lg z-10">
          {t("no_product_available")}
        </div>
      )}
  
      <img
        src={data?.category?.image_url}
        className="w-full h-full object-cover"
        alt={data?.category?.name}
        onClick={() => {
          if(data?.products_count !== 0){
            collectionDescription(data?.category);
          };
        }}
        draggable="false"
      />
    </div>
  
    {/* Content */}
    <div className="pt-3 px-2 text-center">
      <div className="text-[#242323] font-semibold text-base sm:text-lg md:text-[1.1rem]">
        {data?.category?.name}
      </div>
      <div className="text-[#020202] text-sm sm:text-base">
        {data?.products_count} {t("products")}
      </div>
    </div>
  </div>
  
  );
};

export default RangeCard;
