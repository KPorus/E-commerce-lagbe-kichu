"use client";
import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import Button from "../button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCartProducts } from "@/lib/features/cartSlice";
import { toaster } from "@/components/ui/toaster";
import { useDeleteProductMutation } from "@/lib/api/apiSlice";
import { useRouter } from "next/navigation";
import EditProductModal from "@/Desktop/components/seller-add-product/editProductModal";

interface ProductCardBtnProps {
  _id: string;
  image: string;
  title: string;
  price: number;
  Owner: string;
  specialDiscount: boolean;
  discountEndTime?: number;
  rating?: number;
  discount?: number;
  refetch?: () => void;
  description: string;
  category?: "ELECTRONICS" | "CLOTHING" | "FURNITURE" | "BEAUTY";
  quantity?: number;
  newProduct?: boolean;
  bestArrival?: boolean;
  featured?: boolean;
}

const ProductCardBtn = ({
  _id,
  image,
  title,
  price,
  rating,
  Owner,
  specialDiscount,
  discountEndTime,
  discount,
  refetch,
  description,
  category,
  quantity,
  newProduct,
  bestArrival,
  featured,
}: ProductCardBtnProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const addCart = () => {
    dispatch(
      setCartProducts({
        _id,
        image,
        quantity: 1,
        title,
        price,
        Owner,
        rating,
        specialDiscount,
        discountEndTime,
        discount: discount || 0,
      })
    );
    toaster.success({ title: "Item Added!" });
  };

  const handleBuyNow = () => {
    addCart();
    router.push("/checkout");
  };

  const handleDeleteProduct = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await deleteProduct({ id: _id, token });
    if (res.data) {
      refetch?.();
      toaster.success({
        title: "Item Deleted!",
        description: "Product has been removed.",
      });
    } else {
      toaster.error({
        title: "Delete Failed",
        description: "Could not delete the product.",
      });
    }
  };

  return (
    <>
      <Flex gap={2} mt={4}>
        {user?.role === "SELLER" || user?.role === "ADMIN" ? (
          <>
            <Button
              intent="addCart"
              text={isDeleting ? "Deleting..." : "Delete"}
              onClick={handleDeleteProduct}
              disabled={isDeleting}
            />
            <Button
              intent="buyNow"
              text="Edit"
              onClick={() => setIsEditModalOpen(true)}
            />
          </>
        ) : (
          <>
            <Button intent="buyNow" text="Buy now" onClick={handleBuyNow} />
            <Button intent="addCart" text="Add to cart" onClick={addCart} />
          </>
        )}
      </Flex>

      {user?.role === "SELLER" || user?.role === "ADMIN" ? (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            refetch?.();
            setIsEditModalOpen(false);
          }}
          product={{
            _id,
            title,
            description,
            price,
            category: category || "BEAUTY",
            quantity: quantity || 1,
            discount: discount || 0,
            specialDiscount,
            rating,
            Owner,
            newProduct: newProduct || false,
            bestArrival: bestArrival || false,
            featured: featured || false,
            discountEndTime,
          }}
          refetch={refetch || (() => {})}
        />
      ) : null}
    </>
  );
};

export default ProductCardBtn;
