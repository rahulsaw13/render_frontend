// components
import Image from "@common/Image";

const ProductCard = ({ data }) => {
    const hasHoverImage = !!data?.hoverUrl;

    return (
        <div className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px] h-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="w-full h-[200px] relative">
                <Image
                    src={hasHoverImage ? data.hoverUrl : data.defaultImage}
                    alt="Product"
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                        hasHoverImage ? "hover:scale-100" : "hover:scale-105"
                    }`}
                />
            </div>
        </div>
    );
}

export default ProductCard;
