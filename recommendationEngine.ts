import { Movie, UserPreferences, RecommendationScore } from '../types';
import { movies } from '../data/movies';

export class RecommendationEngine {
  private calculateGenreSimilarity(movieGenres: string[], userPreferences: UserPreferences): number {
    const matchingGenres = movieGenres.filter(genre => 
      userPreferences.favoriteGenres.includes(genre)
    );
    return matchingGenres.length / Math.max(movieGenres.length, userPreferences.favoriteGenres.length);
  }

  private calculateMovieSimilarity(movie: Movie, userPreferences: UserPreferences): number {
    const genreSimilarity = this.calculateGenreSimilarity(movie.genres, userPreferences);
    const isLiked = userPreferences.likedMovies.includes(movie.id) ? 1 : 0;
    
    // Weight different factors
    const weights = {
      genreSimilarity: 0.6,
      rating: 0.2,
      isLiked: 0.2
    };

    return (
      genreSimilarity * weights.genreSimilarity +
      (movie.rating / 5) * weights.rating +
      isLiked * weights.isLiked
    );
  }

  public getRecommendations(userPreferences: UserPreferences): Movie[] {
    const scores: RecommendationScore[] = movies.map(movie => ({
      movieId: movie.id,
      score: this.calculateMovieSimilarity(movie, userPreferences)
    }));

    // Sort by score and get top recommendations
    const sortedMovieIds = scores
      .sort((a, b) => b.score - a.score)
      .map(score => score.movieId);

    return sortedMovieIds
      .map(id => movies.find(movie => movie.id === id)!)
      .filter(movie => !userPreferences.likedMovies.includes(movie.id));
  }
}