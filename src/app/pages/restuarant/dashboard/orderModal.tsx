import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { CircleAlert, Download, Loader2 } from "lucide-react";
import { handleBillPdfDownload, handleFetchBillPath } from "./restuarantService";

interface MenuItem {
  _id: string;
  name: string;
  type: string;
  price: number;
}

interface OrderItem {
  _id: string;
  menuId: MenuItem;
  quantity: number;
}

interface OrderProps {
  order: {
    _id: string;
    order: OrderItem[];
    totalAmount: number;
    remarks?: string;
  };
}

const OrderModal: React.FC<OrderProps> = ({ order }) => {

  const [isLoading, setIsLoading] = useState(false);

  const handleBillDownload = async (orderId: string) => {
      setIsLoading(true);
      const billPdfPath = await handleFetchBillPath(orderId);
      if (!billPdfPath?.billPath) {
        setIsLoading(false);
        toast.success('Bill Generation Failed', {
          icon: <CircleAlert color="#fc3419"/>,
        });
        return;
      }

      const response = await handleBillPdfDownload(billPdfPath.billPath);
      if (!response) {
        toast.success('Bill Generation Failed', {
          icon: <CircleAlert color="#fc3419"/>,
        });
        setIsLoading(false);
        return;
      }
      const pdfBlob = new Blob([response], { type: "application/pdf"});
      const url = window.URL.createObjectURL(pdfBlob);
      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.setAttribute(
        "download",
        `bill_${order._id}.pdf`
      );
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Item Id</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Item</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Quantity</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Unit Price</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {order.order.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">
                  {item.menuId?._id.slice(-6)}
                </td>
                <td className="px-4 py-3 text-sm font-medium">{item.menuId?.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{item.menuId?.type}</td>
                <td className="px-4 py-3 text-sm text-center">{item.quantity}</td>
                <td className="px-4 py-3 text-sm text-right">₹{item.menuId?.price}</td>
                <td className="px-4 py-3 text-sm font-medium text-right">
                  ₹{(item.menuId?.price || 0) * item.quantity}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td colSpan={4} className="px-4 py-3 text-sm font-medium text-right">
                Total Amount
              </td>
              <td colSpan={2} className="px-4 py-3 text-sm font-bold text-right">
                ₹{order.totalAmount} 
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end mt-3">
          <Button onClick={()=> handleBillDownload(order._id)} className="rounded-none w-full bg-orange-600 hover:bg-orange-400">
            {
              isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>Download Bill <Download /></>
              )
            }
          </Button>
        </div>
      </div>

      {order.remarks && (
        <div className="border-t w-full">
          <p className="text-sm text-gray-600 w-full md:w-[900px] break-words">
            <span className="font-medium">Note: </span>
            <span className="italic">{order.remarks}</span>
          </p>
        </div>
      )}
      <Toaster/>
    </div>
  );
};

export default OrderModal;
