import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { toast } from "react-toastify";

export default function AppLayout({ children }) {
  const { flash } = usePage().props;

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
    if (flash?.warning) toast.warn(flash.warning);
    if (flash?.info) toast.info(flash.info);
  }, [flash]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {children}
    </div>
  );
}
