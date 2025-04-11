import axios from "axios";

interface CheckoutData {
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
}

export const checkout = async (data: CheckoutData, token: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/users/checkout`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};
