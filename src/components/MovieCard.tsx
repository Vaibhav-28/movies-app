import { Movie } from "../types/Movie";
import { Heart } from "lucide-react";

const BASE_URL = "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const MovieCard = ({ movie, isFavorite, onToggleFavorite }: MovieCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 relative">
      <button
        onClick={onToggleFavorite}
        aria-label="Add to favorites"
        className="z-10 absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition"
      >
        <Heart
          className={`w-6 h-6 transition-colors ${
            isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"
          }`}
          fill={isFavorite ? "currentColor" : "none"}
        />
      </button>
      <div className="relative w-full aspect-w-2 aspect-h-3">
        <img
          src={BASE_URL + movie?.poster_path}
          alt={`${movie?.title} poster`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h2 className="text-base font-bold mb-1 line-clamp-1">
          {movie?.title}
        </h2>
        <div className="flex items-center mb-1">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
            {movie?.vote_average?.toFixed(1)}
          </span>
          <span className="ml-2 text-gray-600 text-xs">
            {movie?.release_date?.split("-")[0]}
          </span>
        </div>
        <p className="text-gray-600 text-xs line-clamp-4">{movie?.overview}</p>
      </div>
    </div>
  );
};

export default MovieCard;
