import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import Carousel from '@/components/Carousel'
import { useEffect, useState } from 'react'
import { Movie } from '@/components/MovieCard'
import axios from 'axios'

// import { printT } from '../../tshape'

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    fetchMovies().then(() => {
      const item = window.localStorage.getItem('favorites');
      setFavoriteMovies(item ? JSON.parse(item) : []);
      // Setting fetched so that we dont save anything to favorites in local storage before we have fetched the movies
      setFetched(true)
    })
  }, []);

  // Save favorites to local storage so that we can keep them when we refresh the page
  useEffect(() => {
    if (!fetched) return;
    window.localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
  }, [favoriteMovies]);

  // fetch movies from the API
  const fetchMovies = async () => {
    axios.get('/api/movies?count=40').then((response) => {
      const movies = response.data
      setMovies(movies);
    });
  }

  // Used to test the tshape function
  // printT(5)

  const toggleFavoriteMovie = (movie: Movie) => {
    const movieExists = favoriteMovies.some((favorite) => favorite.imdbID === movie.imdbID);
    if (movieExists) {
      setFavoriteMovies(favoriteMovies.filter((favorite) => favorite.imdbID !== movie.imdbID));
    } else {
      setFavoriteMovies([...favoriteMovies, movie]);
    }
  };

  return (
    <>
      <Head>
        <title>Movie carousel</title>
        <meta name="description" content="Movie carousel application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1>Movie Carousel</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.carouselrow}>
          <h2>Movies</h2>
          <Carousel movies={movies} favoriteMovies={favoriteMovies} onToggleFavorite={toggleFavoriteMovie} />
        </div>
        <button onClick={fetchMovies} type="button" className={styles.generate}>Generate New Movies</button>


        {favoriteMovies && favoriteMovies.length > 0 && (
          <div className={styles.carouselrow}>
            <h2>Favorite movies</h2>
            <Carousel movies={favoriteMovies} favoriteMovies={favoriteMovies} onToggleFavorite={toggleFavoriteMovie} />
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Movie Carousel. All rights reserved.</p>
      </footer>
    </>
  )
}
