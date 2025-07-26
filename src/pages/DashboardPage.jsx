// Utils
import { Suspense, useState, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Components
import { Topbar, ReviewList, Sidebar, CategoryList, ProductList, DashboardStats, SubCategoryList, InventoryList, OrderList, CouponList, DiscountList, UserList, BlogList, FestivalSpecialList, SubscriberList, CustomerEnquiryList } from "@adminpage-components/index";
import Loading from "@common/Loading";

const CategoryForm = lazy(() => import("@adminpage-layouts/Category/CategoryForm"));
const SubCategoryForm = lazy(() => import("@adminpage-layouts/SubCategory/SubCategoryForm"));
const ProductForm = lazy(() => import("@adminpage-layouts/Product/ProductForm"));
const InventoryForm = lazy(() => import("@adminpage-layouts/Inventory/InventoryForm"));
const OrderForm = lazy(() => import("@adminpage-layouts/Order/OrderForm"));
const OrderView = lazy(() => import("@adminpage-layouts/Order/OrderView"));
const CouponForm = lazy(() => import("@adminpage-layouts/Coupon/CouponForm"));
const DiscountForm = lazy(() => import("@adminpage-layouts/Discount/DiscountForm"));
const BlogForm = lazy(() => import("@adminpage-layouts/Blog/BlogForm"));
const FestivalSpecialForm = lazy(() => import("@adminpage-layouts/FestivalSpecial/FestivalSpecialForm"));
const UserForm = lazy(() => import("@adminpage-layouts/User/UserForm"));

const DashboardPage = () => {
  const [toggle, setToggle] = useState(true);
  const { t } = useTranslation("msg");
  const location = useLocation(); // Get the current route
  const [searchField, setSearchField] = useState("");

  const toggleExpansionSwitch = (key) => {
    setToggle(key);
  };

  const searchChangeHandler=(data)=>{
    setSearchField(data);
  }

  // Check if the current route is an edit or create route
  const isCreateOrEditPage = /\/(create|edit|view)-/.test(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-BgPrimaryColor">
      {/* Conditionally render sidebar */}
      {!isCreateOrEditPage && (
        <div className={`sidebar ${toggle ? "w-[300px]" : "w-[103px]"} h-full overflow-hidden`}>
          <Sidebar toggle={toggle} />
        </div>
      )}
      <div className="w-full">
        {/* Conditionally render topbar */}
        {!isCreateOrEditPage && <Topbar toggleExpansionSwitch={toggleExpansionSwitch} searchChangeHandler={searchChangeHandler} searchField={searchField}/>}
        <div className={`${isCreateOrEditPage ? "": "h-full bg-BgPrimaryColor px-5 py-2"}`}>
          <Suspense fallback={<Loading loadingText={t("loading")} />}>
            <Routes>
              <Route path="/" element={<DashboardStats />} />

              {/* Listings */}
              <Route path="/categories" element={<CategoryList search={searchField}/>} />
              <Route path="/sub-categories" element={<SubCategoryList search={searchField}/>} />
              <Route path="/products" element={<ProductList search={searchField}/>} />
              <Route path="/inventories" element={<InventoryList search={searchField}/>} />
              <Route path="/orders" element={<OrderList search={searchField}/>} />
              <Route path="/coupons" element={<CouponList search={searchField}/>} />
              <Route path="/discounts" element={<DiscountList search={searchField}/>} />
              <Route path="/addresess" element={<CouponList search={searchField}/>} />
              <Route path="/users" element={<UserList search={searchField}/>} />
              <Route path="/blogs" element={<BlogList search={searchField}/>} />
              <Route path="/fests" element={<FestivalSpecialList search={searchField}/>} />
              <Route path="/reviews" element={<ReviewList search={searchField}/>} />
              <Route path="/subscribers" element={<SubscriberList search={searchField}/>} />
              <Route path="/customer-enquiries" element={<CustomerEnquiryList search={searchField}/>} />

              {/* Create / Update forms */}
              <Route path="/create-category" element={<CategoryForm />} />
              <Route path="/edit-category/:id" element={<CategoryForm />} />
              <Route path="/create-sub-category" element={<SubCategoryForm />} />
              <Route path="/edit-sub-category/:id" element={<SubCategoryForm />} />
              <Route path="/create-product" element={<ProductForm />} />
              <Route path="/edit-product/:id" element={<ProductForm />} />
              <Route path="/create-inventory" element={<InventoryForm />} />
              <Route path="/edit-inventory/:id" element={<InventoryForm />} />
              <Route path="/create-order" element={<OrderForm />} />
              <Route path="/view-order/:id" element={<OrderView />} />
              <Route path="/create-coupon" element={<CouponForm />} />
              <Route path="/edit-coupon/:id" element={<CouponForm />} />
              <Route path="/create-discount" element={<DiscountForm />} />
              <Route path="/edit-discount/:id" element={<DiscountForm />} />
              <Route path="create-blog" element={<BlogForm />} />
              <Route path="/edit-blog/:id" element={<BlogForm />} />
              <Route path="/edit-fest-product/:id" element={<FestivalSpecialForm />} />
              <Route path="/create-fest-product" element={<FestivalSpecialForm />} />
              <Route path="/edit-user/:id" element={<UserForm />} />
              <Route path="/create-user" element={<UserForm />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;