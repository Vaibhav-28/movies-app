import { X } from "lucide-react";
import MovieCard from "./MovieCard";
import { Movie } from "../types/Movie";

interface FavoriteMoviesDialogProps {
  favorites: Movie[];
  onClose: () => void;
  toggleFavorite: (movie: Movie) => void;
}

const FavoritesDialog: React.FC<FavoriteMoviesDialogProps> = ({
  favorites,
  onClose,
  toggleFavorite,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-xl max-w-5xl w-[95%] max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Favorite Movies ({favorites.length})
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg 
                hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                You haven't added any favorite movies yet.
              </p>
              <p className="text-gray-400 mt-2">
                Click the heart icon on any movie to add it to your favorites.
              </p>
            </div>
          ) : (
            <div className=" gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavorite={true}
                  onToggleFavorite={() => toggleFavorite(movie)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesDialog;
