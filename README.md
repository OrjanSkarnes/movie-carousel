# Movie Carousel

A responsive movie carousel web application built using React, Next.js, and TypeScript. This application fetches movies from the OMDB API and displays them in a carousel. Users can add movies to their favorites, generate a new list of random movies, and more.

## Features

- Fetches movies from the OMDB API
- Displays movies in a responsive carousel
- Adds movies to a separate "Favourites" carousel
- Generates a list of new random movies
- WCAG-compliant design and interactions

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Set OMDB API key so you can fetch movies from the api, needs to be added in .env file, can get one [here](https://www.omdbapi.com/apikey.aspx)

```
OMDB_API_KEY=your_api_key
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
