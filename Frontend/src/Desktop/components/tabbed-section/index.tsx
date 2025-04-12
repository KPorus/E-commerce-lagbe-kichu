import {
  Box,
  Button,
  Input,
  Tabs,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { LuVideo } from "react-icons/lu";
import RatingSvgIcons from "./RatingSvgIcons";
interface Review {
  name: string;
  comment: string;
  rating: number;
}
const ProductDetailsTabSection = ({
  previewVideo,
}: {
  previewVideo: string;
}) => {
  const [value, setValue] = useState<string | null>("previewVideo");
  const [rating, setRating] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewInput, setReviewInput] = useState<Review>({
    name: "",
    comment: "",
    rating: 0, // rating is now part of the reviewInput state
  });

  const handleReviewSubmit = () => {
    const { name, comment } = reviewInput;

    if (name.trim() && comment.trim()) {
      const newReview: Review = {
        name,
        comment,
        rating, // pull from external rating state
      };

      setReviews((prev) => [...prev, newReview]);

      // Reset name/comment only
      setReviewInput({ name: "", comment: "", rating: 0 });

      // Reset external rating
      setRating(0);
    }
  };

  console.log(reviews);
  return (
    <Tabs.Root mt={8} value={value} onValueChange={(e) => setValue(e.value)}>
      <Tabs.List gap={4}>
        <Tabs.Trigger
          value="previewVideo"
          background={"red.400"}
          fontWeight={"semibold"}
          p={4}
          color={"#F2F2F2"}
        >
          <LuVideo />
          Preview Video
        </Tabs.Trigger>
        <Tabs.Trigger
          value="review"
          background={"red.400"}
          fontWeight={"semibold"}
          p={4}
          color={"#F2F2F2"}
        >
          Review & Rating
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        value="previewVideo"
        inset="0"
        _open={{
          animationName: "fade-in, scale-in",
          animationDuration: "300ms",
        }}
        _closed={{
          animationName: "fade-out, scale-out",
          animationDuration: "120ms",
        }}
      >
        {previewVideo ? (
          <Box maxW="600px" mx="auto">
            <video
              width="100%"
              height="240px"
              controls
              style={{ borderRadius: "8px", objectFit: "cover" }}
            >
              <source src={previewVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        ) : (
          <Text color="gray.500">No preview video available.</Text>
        )}
      </Tabs.Content>
      <Tabs.Content
        value="review"
        inset="0"
        _open={{
          animationName: "fade-in, scale-in",
          animationDuration: "300ms",
        }}
        _closed={{
          animationName: "fade-out, scale-out",
          animationDuration: "120ms",
        }}
      >
        <Box>
          {/* Review Form */}
          <VStack align="start" mb={6}>
            <Text fontSize="lg" fontWeight="bold">
              Leave a Review
            </Text>
            <Input
              borderWidth="3px"
              borderColor="gray.600"
              p={4}
              placeholder="Your Name"
              value={reviewInput.name}
              onChange={(e) =>
                setReviewInput((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <Textarea
              borderWidth="3px"
              borderColor="gray.600"
              p={4}
              placeholder="Write your review..."
              value={reviewInput.comment}
              onChange={(e) =>
                setReviewInput((prev) => ({ ...prev, comment: e.target.value }))
              }
            />

            <RatingSvgIcons
              iconHeight={30}
              iconWidth={30}
              setRating={setRating}
              userReview={rating}
            />
            <Button colorScheme="red" onClick={handleReviewSubmit}>
              Submit Review
            </Button>
          </VStack>

          {/* Review List */}
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Reviews
            </Text>
            {reviews.length === 0 ? (
              <Text color="gray.500">No reviews yet.</Text>
            ) : (
              reviews.map((r, index) => (
                <Box
                  key={index}
                  borderWidth="1px"
                  borderRadius="md"
                  p={4}
                  mb={4}
                  bg="gray.50"
                >
                  <Text fontWeight="bold">{r.name}</Text>
                  <Text>⭐ {r.rating} / 5</Text>
                  <Text>{r.comment}</Text>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default ProductDetailsTabSection;
