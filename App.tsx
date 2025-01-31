import React, { useState } from 'react';
import { Film, Heart, ThumbsUp } from 'lucide-react';
import { Movie, UserPreferences } from './types';
import { RecommendationEngine } from './utils/recommendationEngine';
import { movies } from './data/movies';

function App() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    favoriteGenres: [],
    likedMovies: []
  });

  const recommendationEngine = new RecommendationEngine();
  const recommendations = recommendationEngine.getRecommendations(userPreferences);

  const allGenres = Array.from(
    new Set(movies.flatMap(movie => movie.genres))
  );

  const toggleGenre = (genre: string) => {
    setUserPreferences(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre]
    }));
  };

  const toggleLikedMovie = (movieId: string) => {
    setUserPreferences(prev => ({
      ...prev,
      likedMovies: prev.likedMovies.includes(movieId)
        ? prev.likedMovies.filter(id => id !== movieId)
        : [...prev.likedMovies, movieId]
    }));
  };

  const MovieCard = ({ movie }: { movie: Movie }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img 
        src={movie.imageUrl} 
        alt={movie.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{movie.title}</h3>
          <button
            onClick={() => toggleLikedMovie(movie.id)}
            className={`p-2 rounded-full ${
              userPreferences.likedMovies.includes(movie.id)
                ? 'text-red-500'
                : 'text-gray-400'
            }`}
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">{movie.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {movie.genres.map(genre => (
            <span
              key={genre}
              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
            >
              {genre}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center">
          <ThumbsUp className="w-4 h-4 text-yellow-500 mr-1" />
          <span className="text-sm text-gray-600">{movie.rating}/5</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Film className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Movie Recommendations</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Your Favorite Genres</h2>
          <div className="flex flex-wrap gap-2">
            {allGenres.map(genre => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${userPreferences.favoriteGenres.includes(genre)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;