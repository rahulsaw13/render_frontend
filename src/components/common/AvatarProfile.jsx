// Utils
import { useRef, useState } from "react";
import { TieredMenu } from "primereact/tieredmenu";
import { Avatar } from "primereact/avatar";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

// Components
import { API_CONSTANTS } from "@constants/apiurl";
import { allApiWithHeaderToken } from "@api/api";

const AvatarProfile = ({ size, shape, userDetails }) => {
  const data = JSON.parse(localStorage.getItem("userDetails"));
  const menu = useRef(null);
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const [toastType, setToastType] = useState(''); 
  const navigate = useNavigate();

  const items = [
    {
      label: t("my_profile"),
      icon: "ri-id-card-line",
      command: () => {
        navigate(`/profile/${data?.id}`)
      }
    },
    {
      label: t("help"),
      icon: "ri-questionnaire-line",
      command: () => {
        navigate('/help')
      }
    },
    {
      label: t("languages"),
      icon: "ri-global-line",
      items: [
        {
          label: t("english"),
          command: () => {
            localStorage.setItem("i18nextLng", "en");
            window.location.reload();
          },
        },
        {
          label: t("hindi"),
          command: () => {
            localStorage.setItem("i18nextLng", "hi");
            window.location.reload();
          },
        },
        {
          label: t("gujrati"),
          command: () => {
            localStorage.setItem("i18nextLng", "gj");
            window.location.reload();
          },
        },
      ],
    },
    {
      label: t("logout"),
      icon: "ri-logout-circle-r-line",
      command: () => {
        logout();
        let theme = localStorage.getItem("theme");
        localStorage.clear();
        localStorage.setItem("theme", theme);
      },
    },
  ];

  const logout=()=>{
    allApiWithHeaderToken(API_CONSTANTS.LOGOUT, "" , "delete")
      .then((response) => {
        if (response.status === 200){
          navigate("/login", { 
          state: { 
                  isLogout: "success"
              } 
          });
        } 
        else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Something went wrong",
            life: 3000,
          });
        }
      })
      .catch((err) => {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Something went wrong",
            life: 3000,
        });
      });
  }

  return (
    <div className="card justify-content-center flex text-TextPrimaryColor">
      <div className="me-4">
        <div className="text-[0.8rem] capitalize">{userDetails?.name || '-'}</div>
        <div className="text-[0.6rem] capitalize">{t("admin")}</div>
      </div>
      <Toast ref={toast} position="top-right" style={{scale: '0.7'}}/>
      <Avatar
        image={data?.image_url ? data?.image_url : "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"}
        className="mr-2"
        size={size}
        shape={shape}
        onClick={(e) => menu.current.toggle(e)}
      />
      <TieredMenu
        model={items}
        popup
        ref={menu}
        breakpoint="767px"
        className="w-44 p-0 text-[0.8rem] bg-BgTertiaryColor avatar-menu"
      />
    </div>
  );
};

export default AvatarProfile;
