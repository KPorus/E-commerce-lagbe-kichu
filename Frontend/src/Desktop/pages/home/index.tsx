import React from "react";
import Hero from "@/Desktop/components/hero";
import Feature from "@/Desktop/components/feature";
import LatestProducts from "@/Desktop/components/tabbed products";
import OfferService from "@/Desktop/components/offer service";
import NewsSection from "@/Desktop/components/news section";
import Ad from "@/Desktop/components/ad";

const HomePage = () => {
  return (
    <>
      <Hero />
      <Feature/>
      <LatestProducts/>
      <OfferService/>
      <NewsSection/>
      <Ad/>
    </>
  );
};

export default HomePage;
