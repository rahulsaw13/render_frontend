import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Components
import { ROUTES_CONSTANTS } from "@constants/routesurl";
import useCartStore from "@store";
import Image from "@common/Image";

const ProductBuyCard = ({ data, imageHeight }) => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();

  const initialVariant =
    data?.variants?.find((v) => v.inventory_count > 0) || data?.variants?.[0];

  const getInitialQuantity = (productId, weight) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemInCart = cart.find((item) => item.id === productId && item.weight === weight);
    return itemInCart?.quantity || 1;
  };

  const [discountedPrice, setDiscountedPrice] = useState(initialVariant?.discountedPrice);
  const [actualPrice, setActualPrice] = useState(initialVariant?.actualPrice);
  const [productId, setProductId] = useState(initialVariant?.product_id);
  const [weight, setWeight] = useState(initialVariant?.weight);
  const [quantity, setQuantity] = useState(getInitialQuantity(initialVariant?.product_id, initialVariant?.weight));

  const setTrigger = useCartStore((state) => state.setTrigger);

  const selectedVariant = data?.variants?.find((v) => v.weight === weight);
  const isOutOfStock = selectedVariant?.inventory_count === 0;
  const maxQuantity = selectedVariant?.inventory_count || 0;

  const changeHandler = (e) => {
    const selectedWeight = e.target.value;
    const obj = data?.variants?.find((item) => item?.weight === selectedWeight);
    if (obj && obj.inventory_count > 0) {
      setProductId(obj?.product_id);
      setWeight(selectedWeight);
      setDiscountedPrice(obj?.discountedPrice);
      setActualPrice(obj?.actualPrice);
      const newQty = getInitialQuantity(obj?.product_id, selectedWeight);
      setQuantity(newQty);
    }
  };

  const productDescription = (item) => {
    navigate(`${ROUTES_CONSTANTS.VIEW_PRODUCT_DESCRIPTION}/${item?.name}`, {
      state: {
        id: item?.id,
        name: item?.name,
        description: item?.description,
        image_url: item?.image_url,
        variants: item?.variants,
        shelf_life: item?.shelf_life,
        subCategoryName: item?.subCategoryName,
      },
    });
  };

  const addCartHandler = (item) => {
    const product = {
      id: productId,
      name: item?.name,
      weight,
      image: item?.image_url,
      quantity,
      actualPrice,
      discountedPrice,
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProductIndex = cart.findIndex(
      (p) => p.id === product.id && p.weight === product.weight
    );

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setTrigger();
  };

  const decreaseQty = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQty = () => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  return (
    <div className="flex min-w-0 select-none flex-col p-2 sm:p-3">
      <div
        style={{ height: imageHeight ? `${imageHeight}` : "18rem" }}
        className="card relative aspect-[0.7171875] w-full flex-shrink-0 overflow-hidden rounded-lg bg-white shadow-md"
      >
        <Image
          src={data?.image_url}
          className="aspect-[9/12] w-full transform object-cover object-center transition-transform duration-1000 ease-in-out hover:scale-110 hover:cursor-pointer"
          alt={data?.name}
          height={100}
          onClick={() => productDescription(data)}
        />
        {isOutOfStock && (
          <span className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            Out of Stock
          </span>
        )}
      </div>

      <div className="mt-3">
        <div className="truncate text-[1.1rem] font-semibold text-[#242323]">
          {data?.name}
        </div>

        <div className="mt-1 font-[Tektur] text-[1rem] font-semibold text-[#242323]">
          <span>₹ {discountedPrice}</span>
          {discountedPrice < actualPrice && (
            <span className="ms-4 font-thin text-gray-500 line-through">
              ₹ {actualPrice}
            </span>
          )}
        </div>
      </div>

      <select
        onChange={changeHandler}
        value={weight}
        className="mt-3 w-full rounded-md border border-[#caa446] bg-[#fffaf0] px-4 py-2 font-[Tektur] text-sm text-gray-700 hover:cursor-pointer focus:outline-none sm:text-base"
      >
        {data?.variants?.map((item, idx) => (
          <option
            key={idx}
            value={item.weight}
            disabled={item.inventory_count === 0}
          >
            {item.weight} {item.inventory_count === 0 ? "(Out of Stock)" : ""}
          </option>
        ))}
      </select>

      <div className="mt-3 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <div className="flex min-w-[107px] items-center overflow-hidden rounded-md border border-[#caa446]">
          <button
            className="px-3 py-2 text-base hover:cursor-pointer hover:bg-gray-200 disabled:opacity-50"
            onClick={decreaseQty}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-2 font-[Tektur] text-base">{quantity}</span>
          <button
            className={`px-3 py-2 text-base ${
              quantity >= maxQuantity ? "hover:cursor-not-allowed" : "hover:cursor-pointer"
            } hover:bg-gray-200 disabled:opacity-50`}
            onClick={increaseQty}
            disabled={quantity >= maxQuantity}
          >
            +
          </button>
        </div>

        <button
          onClick={() => addCartHandler(data)}
          disabled={isOutOfStock}
          className={`w-full rounded-md border border-black bg-[#caa446] px-4 py-2 text-base font-semibold text-white hover:bg-[#b29238] ${
            isOutOfStock ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {t("add_to_cart")}
        </button>
      </div>
    </div>
  );
};

export default ProductBuyCard;