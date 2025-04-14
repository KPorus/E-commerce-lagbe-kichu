import HeroBanner from "@/Desktop/common/hero-bannner";
import SellerOrderTable from "@/Desktop/components/seller-order-table";
import React from "react";

const SellerOrder = () => {
  return (
    <>
      <HeroBanner title="My Orders" />
      <SellerOrderTable />
    </>
  );
};

export default SellerOrder;
