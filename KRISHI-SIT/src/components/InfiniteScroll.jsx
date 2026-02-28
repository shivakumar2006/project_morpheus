import React from "react";
import img1 from "../assets/images/img1.png";
import img2 from "../assets/images/img2.png";
import img3 from "../assets/images/img3.webp";
import img4 from "../assets/images/img4.png";
import img5 from "../assets/images/img5.png";
import img6 from "../assets/images/img6.png";

// const images = [
//   "/assets/images/img1.png",
//   "/assets/images/img2.png",
//   "/assets/images/img3.webp",
//   "/assets/images/img4.png",
//   "/assets/images/img5.png",
//   "/assets/images/img6.png",
// ];

const images = [img1, img2, img3, img4, img5, img6]

const InfiniteScroll = () => {
  return (
    <div className="overflow-hidden w-full bg-white">
      {/* Custom CSS for animation */}
      <style>
        {`
          @keyframes scrollRightToLeft {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0%); }
          }

          .scroll-animation {
            animation: scrollRightToLeft 5s linear infinite;
          }
        `}
      </style>

      <div className="flex whitespace-nowrap scroll-animation">
        {[...images, ...images].map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`img-${index}`}
            className="h-14 w-auto mx-4 inline-block"
          />
        ))}
      </div>
    </div>
  );
};

export default InfiniteScroll;