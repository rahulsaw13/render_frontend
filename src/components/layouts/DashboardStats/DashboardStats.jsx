// Utils
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

// Components
import { API_CONSTANTS } from "@constants/apiurl";
import { allApiWithHeaderToken } from "@api/api";
import { Toast } from "primereact/toast";
import  CategoriesSvg from "@assets/categories_purple.webp";
import  SubCategoriesSvg from "@assets/subcategories_purple.webp";
import  OrderSvg from "@assets/order_purple.webp";
import  ProductSvg from "@assets/product_purple.webp";
import  RevenueSvg from "@assets/revenue_purple.webp";
import  CustomersSvg from "@assets/customers_purple.webp";

const DashboardStats = () => {
  const toast = useRef(null);
  const location = useLocation();
  const { isLogin } = location?.state || {};
  const { t } = useTranslation("msg");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    productCounts: 0,
    categoryCounts: 0,
    subCategoryCounts: 0,
    customerCount: 0,
    orderCount: 0,
    totalRevenue: 0
  });

  let revenueByMonth = {
    options: {
      chart: {
        id: "basic-bar",
        toolbar: {
          show: false
        }
      },
      title: {
        text: 'Revenue By Month',
        align: 'left'
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      }
    },
    series: [
      {
        name: "series-1",
        data: [30000, 40000, 500000, 80000, 490000, 550000, 700000, 910000, 500000, 80000, 490000, 500000]
      }
    ]
  }

  let transactionByMonth = {
    options: {
      series: [{
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }],
      chart: {
        type: 'line',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false,
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Transaction By Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      }
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }
    ]
  }

  let comarisonOfRevenue = {
    series: [{
      name: 'series1',
      data: [31, 40, 28, 51, 42, 109, 100]
    }, {
      name: 'series2',
      data: [11, 32, 45, 32, 34, 52, 41]
    }],
    options: {
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false,
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Comparison Of Revneues(Offline / Online)',
        align: 'left'
      },
      xaxis: {
        type: 'datetime',
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      }
    }
  }

  let yearWiseRevenue = {
    options: {
      title: {
        text: 'Product Wise Revenue(Yearly)',
        align: 'left'
      },
      labels: ['A', 'B', 'C', 'D', 'E'],
      chart: {
        toolbar: {
          show: false
        }
      },
    },
    series: [44, 55, 41, 17, 15]
  }

  let winterReasonRevenue = {
    options: {
      legend: {
        show: false
      },
      title: {
        text: 'Product Wise Revenue (Winter)',
        align: 'left'
      },
      chart: {
        toolbar: {
          show: false
        }
      },
    },
    series: [44, 55, 41, 17, 15],
    chartOptions: {
      labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
    },
  }

  let rainyReasonRevenue = {
    options: {
      title: {
        text: 'Product Wise Revenue (Rainy)',
        align: 'left'
      },
      legend: {
        show: false
      },
      chart: {
        toolbar: {
          show: false
        }
      }
    },
    series: [44, 55, 41, 17, 15],
    chartOptions: {
      labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
    }
  }

  let summerReasonRevenue = {
    options: {
      title: {
        text: 'Product Wise Revenue (Summer)',
        align: 'left'
      },
      legend: {
        show: false
      },
      chart: {
        toolbar: {
          show: false
        }
      }
    },
    series: [44, 55, 41, 17, 15],
    chartOptions: {
      labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
    }
  }

  const fetchCounts = () => {
    setLoader(true);
    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_ADMIN_DASHBOARD_URL}/counts`, "" , "get")
      .then((response) => {
        if (response.status === 200) {
          let obj = {
            productCounts: response?.data?.product_count,
            categoryCounts: response?.data?.category_count,
            subCategoryCounts: response?.data?.sub_category_count,
            customerCount: response?.data?.customer_count,
            orderCount: response?.data?.order_count,
            totalRevenue: response?.data?.total_revenue
          }
          setCounts({...counts, ...obj});
        } 
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err?.response?.data?.errors,
          life: 3000,
        });
        setLoader(false);
      }).finally(()=>{
        setLoader(false);
      });
  };

  useEffect(() => {
      if(isLogin){
        toast.current.show({
          severity: "success",
          summary: t("success"),
          detail: "You have successfully login",
          life: 2000
        });
      };
      navigate(location.pathname, { replace: true }); 

      fetchCounts();
  }, []);

  return (
    <div className="overflow-y-scroll h-[88vh] custom-scroll" style={{
        overflow: 'scroll',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
      <Toast ref={toast} position="top-right" />
      <div className="flex gap-10 text-TextPrimaryColor">
        <div className="mt-4 flex w-[25%] bg-BgSecondaryColor border rounded border-BorderColor p-6">
          <div className="flex gap-5">
          <img src={CategoriesSvg} alt="img" width="35" height="20"/>
            <div>
                <div className="font-bold">{counts?.categoryCounts}+</div>
                <div className="text-[0.8rem]">{t("total_categories")}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-[25%] bg-BgSecondaryColor border rounded border-BorderColor p-6">
          <div className="flex gap-5">
          <img src={SubCategoriesSvg} alt="img" width="35" height="20"/>
            <div>
                <div className="font-bold">{counts?.subCategoryCounts}+</div>
                <div className="text-[0.8rem]">{t("total_subcategories")}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-[25%] bg-BgSecondaryColor border rounded border-BorderColor p-6">
          <div className="flex gap-5">
          <img src={ProductSvg} alt="img" width="35" height="20"/>
            <div>
                <div className="font-bold">{counts?.productCounts}+</div>
                <div className="text-[0.8rem]">{t("total_products")}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-[25%] bg-BgSecondaryColor border rounded border-BorderColor p-6">
          <div className="flex gap-5">
            <img src={CustomersSvg} alt="img" width="35" height="20"/>
            <div>
                <div className="font-bold">{counts?.customerCount}+</div>
                <div className="text-[0.8rem]">{t("total_customers")}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-10 text-TextPrimaryColor">
        <div className="mt-4 flex w-[25%] bg-BgSecondaryColor border rounded border-BorderColor p-6">
          <div className="flex gap-5">
          <img src={OrderSvg} alt="img" width="35" height="20"/>
            <div>
                <div className="font-bold">{counts?.orderCount}+</div>
                <div className="text-[0.8rem]">{t("total_orders")}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-[25%] bg-BgSecondaryColor border rounded border-BorderColor p-6">
          <div className="flex gap-5">
          <img src={RevenueSvg} alt="img" width="35" height="20"/>
            <div>
                <div className="font-bold">₹ {counts?.totalRevenue}</div>
                <div className="text-[0.8rem]">{t("total_revenue")}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-[25%] p-6">
        </div>
        <div className="mt-4 flex w-[25%] p-6">
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-12">
        <div className="relative flex justify-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <Chart
            options={revenueByMonth.options}
            series={revenueByMonth.series}
            type="bar"
            width="500"
          />

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/70 z-10">
            <span className="text-[1rem] font-semibold text-gray-600">{t("coming_soon")}</span>
          </div>
        </div>
        <div className="relative flex justify-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <Chart 
            options={yearWiseRevenue.options} 
            series={yearWiseRevenue.series} 
            type="donut" 
            width="400" 
          />

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/70 z-10">
            <span className="text-[1rem] font-semibold text-gray-600">{t("coming_soon")}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-12">
        {/* Season Wise Revenue */}
        <div className="relative flex justify-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <Chart 
            options={winterReasonRevenue.options} 
            series={winterReasonRevenue.series} 
            type="donut" 
            width="340" 
          />

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/70 z-10">
            <span className="text-[1rem] font-semibold text-gray-600">{t("coming_soon")}</span>
          </div>
        </div>
        <div className="relative flex justify-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <Chart 
            options={rainyReasonRevenue.options} 
            series={rainyReasonRevenue.series} 
            type="donut" 
            width="340" 
          />

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/70 z-10">
            <span className="text-[1rem] font-semibold text-gray-600">{t("coming_soon")}</span>
          </div>
        </div>
        <div className="relative flex justify-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <Chart 
            options={summerReasonRevenue.options} 
            series={summerReasonRevenue.series} 
            type="donut" 
            width="340" 
          />

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/70 z-10">
            <span className="text-[1rem] font-semibold text-gray-600">{t("coming_soon")}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-16 mb-4">
        <div className="relative flex justify-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <Chart
            options={transactionByMonth.options}
            series={transactionByMonth.series}
            type="line"
            width="500" 
          />

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/70 z-10">
            <span className="text-[1rem] font-semibold text-gray-600">{t("coming_soon")}</span>
          </div>
        </div>
        <div className="relative flex justify-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <Chart
            options={comarisonOfRevenue.options}
            series={comarisonOfRevenue.series}
            type="area"
            width="500" 
          />

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/70 z-10">
            <span className="text-[1rem] font-semibold text-gray-600">{t("coming_soon")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardStats;