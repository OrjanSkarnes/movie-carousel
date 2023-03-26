import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/carousel.module.scss';
import MovieCard, { Movie } from './MovieCard';

interface CarouselProps {
  movies: Movie[];
  favoriteMovies: Movie[];
  onToggleFavorite: (movie: Movie) => void;
}

const Carousel: React.FC<CarouselProps> = ({ movies, favoriteMovies, onToggleFavorite  }) => {
  // cardWidthInPixels should dynamically figure the width based on th width of the screen
  const carouselRef = useRef<HTMLDivElement>(null);
  const [cardWidthInPixels, setCardWidthInPixels] = useState(295); // Card width (270px) + margin-inline (30px)
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    carouselRef.current?.addEventListener('scroll', checkButtonsVisibility)
    checkButtonsVisibility();
    // Run each time the movies array changes
  }, [movies]);


  const checkButtonsVisibility = () => {
    if (!carouselRef.current) return;
    const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth; // Calculate the maximum scroll position
    setShowLeftButton(carouselRef.current.scrollLeft > 0); // Show left button if scroll position is greater than 0
    setShowRightButton(carouselRef.current.scrollLeft + (cardWidthInPixels / 2) < maxScroll); // Show right button if scroll position is less than the maximum scroll position
  };

  // Function to scroll the carousel using buttons
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth / 2;
      const nearestCard = Math.round(scrollAmount / cardWidthInPixels) * cardWidthInPixels;
      carouselRef.current.scrollBy({
        left: direction === 'right' ? nearestCard : -nearestCard,
        behavior: 'smooth',
      });
    }
  };

  // Event handlers for drag-based scrolling
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true); // Set dragging state to true
    setStartPosition(e.pageX - carouselRef.current!.offsetLeft); // Record initial cursor position
    setInitialScrollLeft(carouselRef.current!.scrollLeft); // Record initial scroll position
  };

  const handleMouseLeave = () => {
    smoothScrollToNearestCard(); // Smoothly scroll to the nearest card when mouse button is released
    setIsDragging(false); // Set dragging state to false when cursor leaves the carousel
  };

  const handleMouseUp = () => {
    smoothScrollToNearestCard(); // Smoothly scroll to the nearest card when mouse button is released
    setIsDragging(false); // Set dragging state to false when mouse button is released
  };


  // Function to calculate the width of the card based on the width of the screen
  const calculatedWidth = () => {
    const width = window.innerWidth;
    if (width < 480) {
      setCardWidthInPixels(165); // Card width (150px) + margin-inline (15px)
    } else if (width < 768) {
      setCardWidthInPixels(220); // Card width (200px) + margin-inline (20px)
    } else {
      setCardWidthInPixels(295); // Card width (270px) + margin-inline (25px)
    }
  }

  const smoothScrollToNearestCard = () => {
    calculatedWidth()
    if (carouselRef.current && cardWidthInPixels > 0) { // Card width (270px) + margin-inline (30px)
      const currentScroll = carouselRef.current.scrollLeft;
      let nearestCard;
      if (scrollDirection === 'left') {
        nearestCard = Math.ceil(currentScroll / cardWidthInPixels); // Calculate the nearest to the right
      } else {
        nearestCard = Math.floor(currentScroll / cardWidthInPixels); // Calculate the nearest card to the left when scrolling 
      }
      // Smoothly scroll to the nearest card
      carouselRef.current.scrollTo({
        left: nearestCard * cardWidthInPixels,
        behavior: 'smooth',
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return; // Only move when dragging state is true
    e.preventDefault(); // Prevent default browser behavior
    const x = e.pageX - carouselRef.current!.offsetLeft; // Calculate new cursor position on the x axis
    const scrollDistance = (x - startPosition) * 1.5; // Calculate scroll distance based on cursor position and initial cursor position
    setScrollDirection(scrollDistance > 0 ? 'right' : 'left') // Set scroll direction based on scroll distance
    carouselRef.current!.scrollLeft = initialScrollLeft - scrollDistance; // Update scroll position based on scroll distance
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
    if (e.key === 'ArrowLeft') {
      scroll('left');
    }
    if (e.key === 'ArrowRight') {
      scroll('right');
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${styles.left} ${showLeftButton ? styles.show : ''}`}
        onClick={() => scroll('left')}
        type="button"
        aria-label="Scroll left"
      >
        &lt;
      </button>
      <div className={`${styles.carousel} ${isDragging ? styles.grabbing : ''}`}
        ref={carouselRef}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        tabIndex={0}
        role="list" aria-label="Movie carousel"
        >
        {movies && movies.map((movie, index) => (
          <MovieCard key={index} {...movie} isFavorited={favoriteMovies.some((favMovie) => favMovie.imdbID === movie.imdbID)} onToggleFavorite={() => onToggleFavorite(movie)} />
        ))}
      </div>
      <button
        className={`${styles.button} ${styles.right} ${showRightButton ? styles.show : ''}`}
        onClick={() => scroll('right')}
        type="button"
        aria-label="Scroll right"
      >
        &gt;
      </button>
    </div>
  );
};

export default Carousel;
