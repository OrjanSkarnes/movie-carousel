import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Movie } from '@/components/MovieCard';

const movieCache: Record<string, Movie[]> = {};

function generateCacheKey(search: string, page: number): string {
  return `${search}-${page}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { search = "the a", count = 20} = req.query;
  const movies: Movie[] = [];
  /// There is a limit of 10 movies per page in the api response
  const pages = Math.ceil(Number(count) / 10);
  
  let promises = Array.from({ length: pages }, (_, i) => i + 1).map(_i => {
    const random = Math.floor(Math.random() * 40) + 1;
    const cacheKey = generateCacheKey(search as string, random);

    if (movieCache[cacheKey]) {
      return Promise.resolve({ data: { Search: movieCache[cacheKey] } });
    }

    return axios.get(`https://www.omdbapi.com/?s=${search}&apikey=${process.env.OMDB_API_KEY}&plot=short&page=${random}`)
      .then(response => {
        movieCache[cacheKey] = response.data.Search;
        return response;
      });
  });
  // Wait for all promises to resolve can also fail but we only care about the fulfilled ones
  await Promise.allSettled(promises)
    .then(results => {
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          movies.push(...result.value.data.Search);
        }
      });
      res.status(200).json(movies);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to fetch movies.' + error });
    });
}