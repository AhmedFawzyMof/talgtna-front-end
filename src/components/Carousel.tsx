import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IMAGE_BASE_URL } from "../config/config";

function CarouselComponent({ offers }: { offers: Offer[] }) {
  const [width, setWidth] = useState(window.innerWidth);

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: width > 1023 ? 2 : 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "linear",
    arrows: false,
  };

  return (
    <div className="w-[95%] mx-auto my-6">
      <Slider {...settings}>
        {offers.map((offer: Offer) => (
          <Link
            to={
              offer.product
                ? `/product/${offer.product}`
                : `/company/${offer.company}`
            }
            key={offer.id}
            className="w-full h-44 sm:h-56 md:h-72 pl-1 pr-1"
          >
            <img
              src={IMAGE_BASE_URL + offer.image}
              alt={offer.product ? "" : `${offer.company}`}
              className="w-full h-full object-fit rounded shadow-md"
            />
          </Link>
        ))}
      </Slider>
    </div>
  );
}

export default CarouselComponent;
