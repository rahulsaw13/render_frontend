import { useNavigate } from 'react-router-dom';
import { ROUTES_CONSTANTS } from "@constants/routesurl";

const ShopOurSnackRange = ({ title, data }) => {
    const navigate = useNavigate();

    const collectionDescription=(item)=>{
        navigate(`${ROUTES_CONSTANTS.VIEW_SUB_CATEGORY_DESCRIPTION}/${title}`);
    };

    return (
        <section className="relative h-full">
            <div className="absolute w-full h-full z-0 inset-0 bg-[#ede9dd]"></div>
            <div className="relative flex flex-col justify-center items-center">
                <h1 className="text-[#1D2E43] font-[playfair] text-[2.25rem] sm:text-[36px] font-bold text-center mt-10 px-6 sm:px-10">{title}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 px-6 sm:px-10 py-10 justify-center items-center z-10">
                    {data?.map((item) => {
                        return (
                            <a
                                key={item?.id}
                                className="grid-cols-1 flex flex-col items-center justify-center hover:cursor-pointer"
                            >
                                <div className="w-full h-auto">
                                    <img src={item?.image_url} alt="Snacks" className="w-full h-auto" onClick={() => { collectionDescription(item?.category) }}/>
                                </div>
                                <div className="mt-4">
                                    <p className="font-bold text-xl text-center my-4">{item?.name}</p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ShopOurSnackRange;