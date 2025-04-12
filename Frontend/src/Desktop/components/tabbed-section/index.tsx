import { Box, Button, Tabs, Text, Textarea, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { LuVideo } from "react-icons/lu";
import RatingSvgIcons from "./RatingSvgIcons";
import { useGetReviewQuery, usePostReviewMutation } from "@/lib/api/apiSlice";
import { useAppSelector } from "@/lib/hooks";

interface Review {
  name: string;
  comment: string;
  rating: number;
}
interface ReviewInput {
  comment: string;
  rating: number;
}

const ProductDetailsTabSection = ({
  previewVideo,
  id,
}: {
  previewVideo: string;
  id: string;
}) => {
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, refetch } = useGetReviewQuery({ id });
  const [postReview] = usePostReviewMutation();

  const [value, setValue] = useState<string | null>("previewVideo");
  const [rating, setRating] = useState<number>(0);

  const [reviewInput, setReviewInput] = useState<ReviewInput>({
    comment: "",
    rating: 0,
  });
  const reviews: Review[] = data || [];

  useEffect(() => {
    if (value === "review" && data) {
    }
  }, [data, value]);

  const handleReviewSubmit = async () => {
    const { comment } = reviewInput;

    if (!user) {
      alert("Please login to submit a review.");
      return;
    }

    console.log('rating: ',rating);
    if (!comment.trim() || rating <= 0) {
      alert("Please provide both a comment and a rating.");
      return;
    }
    try {
      await postReview({ id, comment, rating }).unwrap();

      setReviewInput({ comment: "", rating });
      setRating(0);
      await refetch();
    } catch (error) {
      console.error("Review submission failed:", error);
    }
  };

  return (
    <Tabs.Root mt={8} value={value} onValueChange={(e) => setValue(e.value)}>
      <Tabs.List gap={4}>
        <Tabs.Trigger
          value="previewVideo"
          background="red.400"
          fontWeight="semibold"
          p={4}
          color="#F2F2F2"
        >
          <LuVideo />
          Preview Video
        </Tabs.Trigger>
        <Tabs.Trigger
          value="review"
          background="red.400"
          fontWeight="semibold"
          p={4}
          color="#F2F2F2"
        >
          Review & Rating
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="previewVideo">
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

      <Tabs.Content value="review">
        <Box>
          {/* Review Form */}
          <VStack align="start" mb={6}>
            <Text fontSize="lg" fontWeight="bold">
              Leave a Review
            </Text>
            <Textarea
              borderWidth="3px"
              borderColor="gray.600"
              p={4}
              placeholder="Write your review..."
              value={reviewInput.comment}
              onChange={(e) =>
                setReviewInput((prev) => ({
                  ...prev,
                  comment: e.target.value,
                }))
              }
            />

            <RatingSvgIcons
              iconHeight={30}
              iconWidth={30}
              setRating={setRating}
              userReview={rating}
            />
            <Button
              loading={isLoading}
              onClick={handleReviewSubmit}
            >
              Submit Review
            </Button>
          </VStack>

          {/* Review List */}
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Reviews
            </Text>
            {isLoading ? (
              <Text color="gray.500">Loading...</Text>
            ) : reviews.length === 0 ? (
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
