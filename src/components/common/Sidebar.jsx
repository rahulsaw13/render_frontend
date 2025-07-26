// Utils
import { useState } from "react";
import { Menu } from "primereact/menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Components
import { ROUTES_CONSTANTS } from "@constants/routesurl";

const Sidebar = ({ toggle }) => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const location = useLocation();

  const [hoveredItem, setHoveredItem] = useState(null);

  // Define menu items with their corresponding routes
  const items = [
    {
      label: t("dashboard"),
      icon: "ri-dashboard-line",
      filledIcon: "ri-dashboard-fill",
      route: ROUTES_CONSTANTS.DASHBOARD,
    },
    {
      label: t("categories"),
      icon: "ri-folder-6-line",
      filledIcon: "ri-folder-6-fill",
      route: ROUTES_CONSTANTS.CATEGORIES,
    },
    {
      label: t("sub_categories"),
      icon: "ri-folders-line",
      filledIcon: "ri-folders-fill",
      route: ROUTES_CONSTANTS.SUB_CATEGORIES,
    },
    {
      label: t("products"),
      icon: "ri-instance-line",
      filledIcon: "ri-instance-fill",
      route: ROUTES_CONSTANTS.PRODUCTS,
    },
    {
      label: t("inventory"),
      icon: "ri-store-2-line",
      filledIcon: "ri-store-2-fill",
      route: ROUTES_CONSTANTS.INVENTORY,
    },
    {
      label: t("orders"),
      icon: "ri-typhoon-line",
      filledIcon: "ri-typhoon-fill",
      route: ROUTES_CONSTANTS.ORDERS,
    },
    {
      label: t("users"),
      icon: "ri-group-line",
      filledIcon: "ri-group-fill",
      route: ROUTES_CONSTANTS.USERS,
    },
    {
      label: t("discounts"),
      icon: "ri-booklet-line",
      filledIcon: "ri-booklet-fill",
      route: ROUTES_CONSTANTS.DISCOUNT,
    },
    {
      label: t("coupons"),
      icon: "ri-receipt-line",
      filledIcon: "ri-receipt-fill",
      route: ROUTES_CONSTANTS.COUPONS,
    },
    {
      label: t("reviews"),
      icon: "ri-draft-line",
      filledIcon: "ri-draft-fill",
      route: ROUTES_CONSTANTS.REVIEWS,
    },
    {
      label: t("blogs"),
      icon: "ri-blogger-line",
      filledIcon: "ri-blogger-fill",
      route: ROUTES_CONSTANTS.BLOGS,
    },
    {
      label: t("fest_special"),
      icon: "ri-flower-line",
      filledIcon: "ri-flower-fill",
      route: ROUTES_CONSTANTS.FEST,
    },
    {
      label: t("subscribers"),
      icon: "ri-flower-line",
      filledIcon: "ri-flower-fill",
      route: ROUTES_CONSTANTS.SUBSCRIBER,
    },
    {
      label: t("customer_enquiries"),
      icon: "ri-question-line",
      filledIcon: "ri-question-fill",
      route: ROUTES_CONSTANTS.CUSTOMER_ENQUIRIES,
    },
  ];

  const isActive = (route) => location.pathname === route;

  const handleMouseEnter = (item) => {
    setHoveredItem(item.route);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const removeFocusClass = () => {
    const firstFocusedItem = document.querySelector(".p-menuitem.p-focus");
    if (firstFocusedItem) {
      firstFocusedItem.classList.remove("p-focus");
    }
  };

  return (
    <div className="bg-BgTertiaryColor text-TextPrimaryColor h-screen">
      {/* Logo & Title */}
      <div
        className={`p-5 flex items-center gap-3 ${
          toggle ? "" : "justify-center"
        }`}
      >
        <i
          className="ri-shopping-bag-3-line text-[24px] hover:cursor-pointer"
          onClick={() => {
            navigate(ROUTES_CONSTANTS.DASHBOARD);
          }}
        ></i>
        {toggle && (
          <div>
            <div>{t("ecommerce")}</div>
            <div className="text-[0.6rem]">{t("management_system")}</div>
          </div>
        )}
      </div>

      {!toggle && (
        <div className="flex w-full justify-center">
          <hr className="w-[90%]" />
        </div>
      )}

      {/* Sidebar Menu */}
      <div className="px-4 h-[88vh] overflow-y-scroll overflow-x-hidden">
        <Menu
          model={items.map((item, index) => {
            const active = isActive(item.route);
            const hovered = hoveredItem === item.route;
            const showFilledIcon = active || hovered;

            return {
              ...item,
              icon: showFilledIcon ? item.filledIcon : item.icon,
              className: "",
              template: (
                <div
                  key={item.route}
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    navigate(item.route);
                    setTimeout(() => {
                      if (item.route !== ROUTES_CONSTANTS.DASHBOARD) {
                        removeFocusClass();
                      }
                    }, 0);
                  }}
                  className={`p-menuitem-content group sidebar-menu-content flex items-center transition-all duration-200 ease-in-out rounded-md cursor-pointer ${
                    active
                      ? "bg-TextPrimaryColor text-white"
                      : "hover:bg-TextPrimaryColor hover:text-white"
                  } ${toggle ? "w-full px-3 py-2" : "w-[57px] justify-center p-2"}`}
                >
                  <i
                    className={`${showFilledIcon ? item.filledIcon : item.icon} text-[1.2rem] custom-target-icon-${index}`}
                  ></i>
                  {toggle && (
                    <span className="ml-3">{item.label}</span>
                  )}
                </div>
              ),
            };
          })}
          className="custom-menu-container bg-BgTertiaryColor p-0 text-[0.8rem]"
        />
      </div>
    </div>
  );
};

export default Sidebar;