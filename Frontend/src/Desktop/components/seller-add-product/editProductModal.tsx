import {
  Button,
  Input,
  Textarea,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { toaster } from "@/components/ui/toaster";
import styles from "./modal.module.scss";

interface FormData {
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: "ELECTRONICS" | "CLOTHING" | "FURNITURE" | "BEAUTY";
  newProduct: boolean;
  bestArrival: boolean;
  discount: number;
  featured: boolean;
  specialDiscount: boolean;
  discountEndTime?: string; // ISO string for datetime-local
  images: File[]; // New images to upload
  video: File | null;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: "ELECTRONICS" | "CLOTHING" | "FURNITURE" | "BEAUTY";
    quantity: number;
    discount: number;
    specialDiscount: boolean;
    images: string[];
    rating?: number;
    Owner: string;
    newProduct: boolean;
    bestArrival: boolean;
    featured: boolean;
    discountEndTime?: Date | null;
  };
  refetch: () => void; // Added refetch prop
}

const EditProductModal = ({
  isOpen,
  onClose,
  product,
  refetch,
}: EditProductModalProps) => {
  const token = useAppSelector((state) => state.auth.token);

  const [formData, setFormData] = useState<FormData>({
    title: product.title,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    category: product.category,
    newProduct: product.newProduct,
    bestArrival: product.bestArrival,
    discount: product.discount || 0,
    featured: product.featured,
    specialDiscount: product.specialDiscount || false,
    discountEndTime: product.discountEndTime
      ? new Date(product.discountEndTime).toISOString().slice(0, 16)
      : "",
    images: [], // Start with no new images
    video: null,
  });

  const [existingImages] = useState<string[]>(
    product.images
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value as FormData["category"],
    }));
  };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const selectedFiles = Array.from(files);
//       const totalImages = selectedFiles.length + existingImages.length;

//       if (totalImages > 5) {
//         toaster.warning({
//           title: "Image Limit",
//           description: "You can have a maximum of 5 images.",
//         });
//         return;
//       }

//       if (totalImages < 1) {
//         toaster.warning({
//           title: "Image Required",
//           description: "At least one image is required.",
//         });
//         return;
//       }

//       setFormData((prev) => ({ ...prev, images: selectedFiles }));
//     }
//   };

//   const handleRemoveExistingImage = (index: number) => {
//     setExistingImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setFormData((prev) => ({ ...prev, video: file }));
//   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (existingImages.length + formData.images.length < 1) {
      toaster.error({
        title: "Image Required",
        description: "At least one image is required.",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", String(formData.price));
    formDataToSend.append("quantity", String(formData.quantity));
    formDataToSend.append("category", formData.category);
    formDataToSend.append("newProduct", String(formData.newProduct));
    formDataToSend.append("bestArrival", String(formData.bestArrival));
    formDataToSend.append("discount", String(formData.discount));
    formDataToSend.append("featured", String(formData.featured));
    formDataToSend.append("specialDiscount", String(formData.specialDiscount));
    if (formData.discountEndTime) {
      formDataToSend.append("discountEndTime", formData.discountEndTime);
    }
    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    if (formData.video) {
      formDataToSend.append("video", formData.video);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/update-product/${product._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
          },
          body: formDataToSend,
        }
      );
      const data = await res.json();
      console.log(data);
      toaster.success({
        title: "Product Updated",
        description: "The product has been successfully updated.",
      });
      refetch();
      onClose();
    } catch (error) {
      toaster.error({
        title: "Update Failed",
        description: "There was an error updating the product.",
      });
      console.error("Error updating product:", error);
    }
  };

  return (
    isOpen && (
      <Box
        overflow={"auto"}
        position="fixed"
        zIndex={1}
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blackAlpha.600"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          bg="white"
          p={6}
          borderRadius="md"
          width="90%"
          maxWidth="600px"
          maxHeight="90vh"
          overflowY="auto"
        >
          <Flex
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize="lg" mb={4} fontWeight={"semibold"}>
              Add New Product
            </Text>
            <Button onClick={onClose} textStyle={"lg"}>
              X
            </Button>
          </Flex>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Title</label>
              <Input
                borderWidth="3px"
                borderColor="gray.600"
                p={4}
                placeholder="Username"
                mb={2}
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                borderWidth="3px"
                borderColor="gray.600"
                p={4}
                placeholder="Write your review..."
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="price">Price</label>
              <Input
                borderWidth="3px"
                borderColor="gray.600"
                p={4}
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min={1}
              />
            </div>

            <div>
              <label htmlFor="discount">Discount</label>
              <Input
                borderWidth="3px"
                borderColor="gray.600"
                p={4}
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min={0}
                max={100}
              />
            </div>

            <div>
              <label htmlFor="quantity">Quantity</label>
              <Input
                borderWidth="3px"
                borderColor="gray.600"
                p={4}
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min={1}
              />
            </div>

            <div>
              <label htmlFor="category">Category</label>
              <select
                style={{
                  width: "100%",
                  background: "white",
                  padding: "0.8rem",
                  border: "2px solid gray",
                }}
                id="category"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
              >
                <option value="ELECTRONICS">Electronics</option>
                <option value="CLOTHING">Clothing</option>
                <option value="FURNITURE">Furniture</option>
                <option value="BEAUTY">Beauty</option>
              </select>
            </div>

            <div>
              <label htmlFor="newProduct">New Product</label>
              <input
                type="checkbox"
                id="newProduct"
                name="newProduct"
                checked={formData.newProduct}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="bestArrival">Best Arrival</label>
              <input
                type="checkbox"
                id="bestArrival"
                name="bestArrival"
                checked={formData.bestArrival}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="featured">Featured</label>
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="specialDiscount">Special Discount</label>
              <input
                type="checkbox"
                id="specialDiscount"
                name="specialDiscount"
                checked={formData.specialDiscount || false}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="discountEndTime">Discount End Time</label>
              <Input
                borderWidth="3px"
                borderColor="gray.600"
                p={4}
                className={styles.customDatePicker}
                type="datetime-local"
                id="discountEndTime"
                name="discountEndTime"
                value={
                  formData.discountEndTime ||
                  ""
                }
                onChange={handleInputChange}
              />
            </div>

            {/* File Upload Fields */}
            {/* <div>
              <label htmlFor="images">Images</label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              <p>{formData.images.length} images selected</p>
            </div>

            <div>
              <label htmlFor="video">Preview Video</label>
              <input
                type="file"
                id="video"
                name="video"
                onChange={handleVideoChange}
              />
            </div> */}

            <Box justifyContent={"center"}>
              <Button
                background={"#FB2E86"}
                py={4}
                px={4}
                mb={2}
                color={"#F2F2F2"}
                type="submit"
              >
                Update Product
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    )
  );
};

export default EditProductModal;
