// components
import AdminPanelLoader from '@common/AdminPanelLoader';
import ButtonComponent from "@common/ButtonComponent";
import { ROUTES_CONSTANTS } from "@constants/routesurl";

// external libraries
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { allApiWithHeaderToken } from "@api/api";
import { API_CONSTANTS } from "@constants/apiurl";

const OrderView = () => {
  const { t } = useTranslation("msg");
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchOrderById();
  }, [id]);

  const fetchOrderById=()=>{
    setLoader(true);
    allApiWithHeaderToken(`${API_CONSTANTS.COMMON_ORDER_URL}/${id}`, "" , "get")
      .then((response) => {
        if (response.status === 200) {
            setData(response?.data?.data);
        } 
      })
      .catch((err) => {
        setLoader(false);
      }).finally(()=>{
        setLoader(false);
      });
  }

  return (
    <div className="h-screen bg-BgPrimaryColor text-TextPrimaryColor py-4 overflow-y-scroll">
    {loader && <AdminPanelLoader/>}
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <div>
        <ButtonComponent
            icon="ri-arrow-go-back-line"
            onClick={() => navigate(ROUTES_CONSTANTS.ORDERS)}
            type="button"
            className="rounded bg-TextPrimaryColor px-6 py-2 text-[12px] text-white"
          />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Invoice</h1>

      {/* Header */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
        <div>
          <p><strong>Invoice ID:</strong> #{data.id}</p>
          <p><strong>Date:</strong> {new Date(data.created_at).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p><strong>Status:</strong> {data?.order_status}</p>
          <p><strong>Payment:</strong> {data?.payment_status} ({data?.payment_mode})</p>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-6 text-sm text-gray-700 mb-6">
        <div>
          <h2 className="font-semibold text-gray-800 mb-2">Billing Address</h2>
          <p>{data?.billing_address}</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-800 mb-2 text-right">Shipping Address</h2>
          <p className='text-right'>{data?.shipping_address}</p>
        </div>
      </div>

      {/* User Info */}
      <div className="text-sm text-gray-700 mb-6">
        <h2 className="font-semibold text-gray-800 mb-2">Customer</h2>
        <p>{data?.user?.name}</p>
        <p>{data?.user?.email}</p>
      </div>

      {/* Products */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border-b p-2">#</th>
              <th className="border-b p-2">Product</th>
              <th className="border-b p-2">Qty</th>
              <th className="border-b p-2">Price (INR)</th>
              <th className="border-b p-2">Subtotal</th>
            </tr>
             {data?.products?.map((item, index) => (
              <tr key={item.product_id} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{parseFloat(item.price).toFixed(2)}</td>
                <td className="p-2">
                  {(item.quantity * parseFloat(item.price)).toFixed(2)}
                </td>
              </tr>
            ))}
          </thead>
        </table>
      </div>

      {/* Summary */}
      <div className="text-right text-sm text-gray-800">
        <div className="mb-2"><strong>Tax:</strong> ₹{parseFloat(data?.tax_price).toFixed(2)}</div>
        <div className="mb-2"><strong>Handling Fee:</strong> ₹{parseFloat(data?.handling_fee).toFixed(2)}</div>
        <div className="text-lg font-bold border-t pt-2 mt-8"><strong>Total:</strong> ₹{parseFloat(data?.total_price).toFixed(2)}</div>
      </div>
    </div>
    </div>
  );
};

export default OrderView;