import { Box, Button, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import styles from "./modal.module.scss";
import { toaster } from "@/components/ui/toaster";
import { useAddProductMutation } from "@/lib/api/apiSlice";
import { useAppSelector } from "@/lib/hooks";
// Define the types for the form data
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
  specialDiscount?: boolean;
  discountDurationInDays?: Date | null;
  images: File[];
  video: File | null;
}

const AddProductModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [addProduct] = useAddProductMutation();
  const token = useAppSelector((state) => state.auth.token);
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "ELECTRONICS",
    newProduct: false,
    bestArrival: false,
    discount: 0,
    featured: false,
    specialDiscount: false,
    discountDurationInDays: null,
    images: [],
    video: null,
  });

  // Handle input change for text and number fields
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: Number(value),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  console.log(formData);
  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      category: e.target.value as
        | "ELECTRONICS"
        | "CLOTHING"
        | "FURNITURE"
        | "BEAUTY",
    });
  };

  // Handle file input for images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const selectedFiles = Array.from(files);

      if (selectedFiles.length > 5) {
        toaster.warning({
          title: "Image Requirement",
          description: "You can upload a maximum of 5 images.",
        });
        return;
      }

      if (selectedFiles.length < 1) {
        toaster.warning({
          title: "Image Requirement",
          description: "You must select at least 1 image.",
        });
        return;
      }

      console.log(
        "Selected images:",
        selectedFiles.map((f) => ({ name: f.name, size: f.size }))
      );
      setFormData((prevState) => ({
        ...prevState,
        images: selectedFiles,
      }));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      console.log("Selected video:", {
        name: files[0].name,
        size: files[0].size,
      });
      setFormData((prevState) => ({
        ...prevState,
        video: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        video: null,
      }));
    }
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData to send files
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

    // Append files as proper file fields
    formData.images.forEach((image, index) => {
      formDataToSend.append("images", image); // Match FileFieldsInterceptor name
      console.log(`Appending image ${index}:`, image.name, image.size);
    });

    if (formData.video) {
      formDataToSend.append("video", formData.video); // Match FileFieldsInterceptor name
      console.log("Appending video:", formData.video.name, formData.video.size);
    }

    // Optional: Append specialDiscount and discountDurationInDays if present
    if (formData.specialDiscount) {
      formDataToSend.append(
        "specialDiscount",
        String(formData.specialDiscount)
      );
    }
    if (formData.discountDurationInDays) {
      formDataToSend.append(
        "discountDurationInDays",
        formData.discountDurationInDays.toISOString()
      );
    }

    // Send the data to the backend
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/upload-product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
        },
        body: formDataToSend,
      });
      console.log(await res.json());
      onClose();
    } catch (error) {
      console.error("Error uploading product:", error);
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
                  formData.discountEndTime?.toISOString().slice(0, 16) || ""
                }
                onChange={handleInputChange}
              />
            </div>

            {/* File Upload Fields */}
            <div>
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
            </div>

            <Box justifyContent={"center"}>
              <Button
                background={"#FB2E86"}
                py={4}
                px={4}
                mb={2}
                color={"#F2F2F2"}
                type="submit"
              >
                Add Product
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    )
  );
};

export default AddProductModal;
