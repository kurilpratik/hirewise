import React from "react";
import Logo from "../Logo";

const ParallaxImage = () => {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/7710183/pexels-photo-7710183.jpeg')",
        }}
      />

      {/* Optional overlay content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <h1 className="text-4xl font-semibold text-white sm:text-8xl">
          HireWise
        </h1>
      </div>
    </div>
  );
};

export default ParallaxImage;
