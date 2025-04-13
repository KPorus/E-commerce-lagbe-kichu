import HeroBanner from '@/Desktop/common/hero-bannner';
import SellerAddProduct from '@/Desktop/components/seller-add-product';
import React from 'react';

const AddProductsPage = () => {
    return (
        <>
        <HeroBanner title="Add Products" />
        <SellerAddProduct />
      </>
    );
};

export default AddProductsPage;