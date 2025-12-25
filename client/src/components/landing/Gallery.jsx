import React, { useRef } from "react";

const Gallery = ({ images = [] }) => {
  const scroller = useRef(null);

  const scrollBy = (dir = 1) => {
    if (!scroller.current) return;
    const step = scroller.current.clientWidth * 0.6;
    scroller.current.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="relative w-full pb-24">
      <button
        aria-label="previous"
        onClick={() => scrollBy(-1)}
        className="absolute top-1/2 left-3 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl shadow-md sm:flex"
      >
        ‹
      </button>

      <div
        ref={scroller}
        className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 py-8"
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="h-[420px] min-w-[280px] flex-shrink-0 snap-center overflow-hidden rounded-xl bg-white shadow-lg sm:min-w-[320px]"
          >
            <img
              src={src}
              alt={`gallery-${i}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <button
        aria-label="next"
        onClick={() => scrollBy(1)}
        className="absolute top-1/2 right-3 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl shadow-md sm:flex"
      >
        ›
      </button>
    </div>
  );
};

export default Gallery;
