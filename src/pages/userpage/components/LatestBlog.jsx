import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Components
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import { refactorPrefilledDate } from '@helper';

const LatestBlog = ({data}) => {
    const { t } = useTranslation("msg");
    const navigate = useNavigate();

    const blogDescription = (item) => {
        navigate(
        ROUTES_CONSTANTS.VIEW_BLOG_DESCRIPTION, 
        { 
            state: { 
                image_url: item?.image_url, 
                heading: item?.heading, 
                description: item?.description,
                createdAt: item?.created_at
            } })
    }

    return (
        <>
        <section className="text-gray-600 body-font">
            <div className="w-full px-6 sm:px-10 py-5">
                <div className="flex flex-col w-full my-8">
                    <h1 className="text-[28px] sm:text-[36px] font-bold title-font text-[#1D2E43] font-[playfair]">{t("latest_blog")}</h1>
                </div>
                <div className="flex flex-wrap -m-4">
                    {
                    data?.map((item) => {
                        return (
                            <div className="p-4 sm:w-1/2 md:w-1/3 lg:w-1/3" key={item?.id}>
                                <div className="h-full border border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                                    <div className="overflow-hidden">
                                        <img
                                            onClick={() => {blogDescription(item)}}
                                            className="w-full object-cover object-center aspect-[16/9] transform transition-transform duration-1000 ease-in-out hover:scale-110 hover:cursor-pointer"
                                            src={item?.image_url}
                                            alt="blog"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">{refactorPrefilledDate(item?.created_at)}</h2>
                                        <h1 className="title-font text-[18px] sm:text-[20px] font-bold mb-3 font-[playfair] text-[#1D2E43] h-[56px]">{item?.heading}</h1>
                                        <div className="flex items-center flex-wrap">
                                            <a onClick={() => {blogDescription(item)}} className="hover:cursor-pointer inline-flex items-center md:mb-2 lg:mb-0 border-b-2 border-black text-black ">
                                                {t("read_more")}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                    }
                </div>
            </div>
        </section>
        </>
    );
}

export default LatestBlog;