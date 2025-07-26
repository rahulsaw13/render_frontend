// Utils
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Components
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import Image from "@common/Image";

const CollectionCard = ({ data }) => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();

  const collectionDescription = (item) => {
    navigate(
      `${ROUTES_CONSTANTS.VIEW_COLLECTION_DESCRIPTION}/${item?.name}`,
      {
        state: {
          subCategoryId: item?.id,
          name: item?.name,
          subCategory: true
        }
      }
    );
  };

  return (
    <div className="flex flex-col cursor-pointer select-none pb-4 px-2 sm:px-3 md:px-4">
      <div className="flex-shrink-0 w-full h-[18rem] sm:h-[22rem] md:h-[28rem] lg:h-[30rem] rounded-lg overflow-hidden bg-white shadow-md">
        <Image
          src={data?.image_url}
          className="w-full object-cover object-center aspect-[9/12] transform transition-transform duration-1000 ease-in-out hover:scale-110 hover:cursor-pointer"
          alt={data?.name}
          draggable="false"
          onClick={() => collectionDescription(data)}
        />
      </div>
      <div className="p-3 sm:p-4">
        <div className="text-[#242323] text-center font-semibold text-lg sm:text-xl md:text-[1.3rem]">
          {data?.name}
        </div>
        <div className="text-center text-sm sm:text-base text-[#020202] line-clamp-2 mt-1">
          {data?.description}
        </div>
      </div>
      <div className="mt-2">
        <button
          onClick={() => collectionDescription(data)}
          className="w-full px-5 py-2 sm:py-3 text-sm sm:text-base text-[#242323] border border-gray-900 rounded-md transition-all duration-300 hover:bg-gray-900 hover:text-white"
        >
          {t("view_collection")}
        </button>
      </div>
    </div>
  );
};

export default CollectionCard;
