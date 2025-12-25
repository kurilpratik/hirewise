import React from "react";
import { Navbar, Hero } from "../components/landing";
import Gallery from "@/components/landing/Gallery";
import Features from "@/components/landing/Features";
import ParallaxImage from "@/components/landing/ParallaxImage";
import Footer from "@/components/landing/Footer";

const galleryImages = [
  "https://i.pinimg.com/1200x/bf/dd/29/bfdd29fb63909b9f6e07c32ddbd489e8.jpg",
  "https://i.pinimg.com/1200x/7e/60/4d/7e604d8bcd695db15a7ed94ff6ed1fa3.jpg",
  "https://i.pinimg.com/1200x/b6/ba/b3/b6bab37baf5ccf6929f20b3d0b747551.jpg",
  "https://i.pinimg.com/1200x/e6/b1/7b/e6b17b85fbc61031e982e3c3ab96d84a.jpg",
  "https://i.pinimg.com/1200x/bf/dd/29/bfdd29fb63909b9f6e07c32ddbd489e8.jpg",

  // more URLs
];

const LandingPage = () => {
  return (
    <div className="bg-base min-h-screen bg-amber-50">
      <Navbar />
      <main>
        <Hero />
        <Gallery images={galleryImages} />
        <Features />
        <ParallaxImage />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
