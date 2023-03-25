import React, { useState } from 'react';
import styles from '../styles/carousel.module.scss';
export interface Movie {
  Title: string;
  Poster: string;
  Plot: string;
  imdbID: string;
  onToggleFavorite: () => void;
  isFavorited: boolean;
}

const MovieCard: React.FC<Movie> = ({ Title, Poster, Plot, isFavorited, onToggleFavorite }) => {
  return (
    <div className={styles.card} role="listitem" aria-label={`${Title} movie card`} tabIndex={1} >
      <div
        className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ''}`}
        onClick={onToggleFavorite}
        role="button"
        aria-label={`${isFavorited ? 'Remove from' : 'Add to'} favorites`}
      >
        ★
      </div>
      <img src={Poster} alt={`${Title} poster`} loading="lazy"/>
    </div>
  );
};

export default MovieCard;
