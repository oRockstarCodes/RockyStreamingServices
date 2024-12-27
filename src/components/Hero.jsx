import { useRef } from "react";
import "./Hero.css";

function Hero() {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;
    const scrollAmount = carousel.offsetWidth;
    carousel.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="hero">
      <div className="movie-carousel-container">
        <button className="scroll-btn left" onClick={() => scrollCarousel("left")}>&#10094;</button>
        <div className="movie-carousel" ref={carouselRef}>
          <img src="/assets/rocky.jpg" alt="Rocky 1" />
          <img src="/assets/rocky2.jpg" alt="Rocky 2" />
          <img src="/assets/rocky3.jpg" alt="Rocky 3" />
          <img src="/assets/rocky4.jpg" alt="Rocky 4" />
          <img src="/assets/rocky5.jpg" alt="Rocky 5" />
          <img src="/assets/rockybalboa.jpg" alt="Rocky Balboa" />
        </div>
        <button className="scroll-btn right" onClick={() => scrollCarousel("right")}>&#10095;</button>
      </div>
    </section>
  );
}

export default Hero;
