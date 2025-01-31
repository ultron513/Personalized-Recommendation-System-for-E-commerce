export interface Movie {
  id: string;
  title: string;
  genres: string[];
  description: string;
  imageUrl: string;
  rating: number;
}

export interface UserPreferences {
  favoriteGenres: string[];
  likedMovies: string[];
}

export interface RecommendationScore {
  movieId: string;
  score: number;
}