import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Filter, Search, X, Heart, Loader } from "lucide-react";
import { FiltersType } from "../types/FilterType";
import { Movie } from "../types/Movie";
import FavoritesDialog from "./FavoritesDialog";

interface HeaderProps {
  filters: FiltersType;
  setFilters: Dispatch<SetStateAction<FiltersType>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  favorites: Movie[];
  toggleFavorite: (arg0: Movie) => void;
}

interface Genre {
  id: number;
  name: string;
}

const Header = ({
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
  loading,
  setLoading,
  favorites,
  toggleFavorite,
}: HeaderProps) => {
  const TMDB_BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [debouncedFilters, setDebouncedFilters] = useState<FiltersType>({
    genres: [],
    yearStart: "",
    yearEnd: "",
    ratingMin: "",
    ratingMax: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      const url =
        "https://api.themoviedb.org/3/genre/movie/list?language=en-US";
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        },
      };
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        setAllGenres(data.genres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };

    fetchGenres();
  }, [TMDB_BEARER_TOKEN]);

  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setSearchQuery(debouncedQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedQuery, setLoading, setSearchQuery]);

  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setFilters(debouncedFilters);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedFilters, setFilters, setLoading]);

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.yearStart ||
    filters.yearEnd ||
    filters.ratingMin ||
    filters.ratingMax;

  const clearFilters = () => {
    setDebouncedFilters({
      genres: [],
      yearStart: "",
      yearEnd: "",
      ratingMin: "",
      ratingMax: "",
    });
  };

  return (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg md:text-2xl font-bold flex-shrink-0">
          My Movies
        </h1>
        <div className="relative flex-1 min-w-[300px] w-full md:order-none order-last">
          <input
            type="text"
            placeholder="Search movies..."
            value={debouncedQuery}
            onChange={(e) => setDebouncedQuery(e.target.value)}
            className="w-full p-3 pl-10 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search movies"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => setDebouncedQuery("")}
              className="absolute right-10 top-3 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          {loading && (
            <Loader className="absolute right-3 top-3 h-5 w-5 text-blue-500 animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 ">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="relative p-2 text-sm font-medium text-gray-600 hover:text-red-500 transition"
            aria-label="View favorites"
          >
            <Heart className="h-5 w-5" />
            {favorites?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 pt-0.5">
                {favorites?.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 p-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
            aria-expanded={isOpen}
          >
            <Filter className="h-5 w-5" />
            <span className="hidden md:inline">Filters</span>
          </button>
        </div>
      </div>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 md:bg-transparent"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed md:absolute left-0 md:left-auto right-0 md:right-1 top-0 md:top-auto mt-0 md:mt-2 w-full md:w-[30rem] h-screen md:h-auto bg-white md:rounded-lg shadow-xl border-l md:border border-gray-200 z-50 flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  Filter Options
                </h3>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="md:hidden p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Year
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={debouncedFilters.yearStart}
                      onChange={(e) =>
                        setDebouncedFilters((prev) => ({
                          ...prev,
                          yearStart: e.target.value,
                        }))
                      }
                      placeholder="From"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      min="1900"
                      max="2999"
                    />
                    <input
                      type="number"
                      value={debouncedFilters.yearEnd}
                      onChange={(e) =>
                        setDebouncedFilters((prev) => ({
                          ...prev,
                          yearEnd: e.target.value,
                        }))
                      }
                      placeholder="To"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      min="1900"
                      max="2999"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={debouncedFilters.ratingMin}
                      onChange={(e) =>
                        setDebouncedFilters((prev) => ({
                          ...prev,
                          ratingMin: e.target.value,
                        }))
                      }
                      placeholder="Min"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      min="0"
                      max="10"
                      step="0.1"
                    />
                    <input
                      type="number"
                      value={debouncedFilters.ratingMax}
                      onChange={(e) =>
                        setDebouncedFilters((prev) => ({
                          ...prev,
                          ratingMax: e.target.value,
                        }))
                      }
                      placeholder="Max"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      min="0"
                      max="10"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Genres</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allGenres.map((genre) => (
                    <label
                      key={genre?.id}
                      className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition p-2 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={debouncedFilters.genres.includes(genre?.id)}
                        onChange={(e) => {
                          setDebouncedFilters((prev) => ({
                            ...prev,
                            genres: e.target.checked
                              ? [...prev.genres, genre.id]
                              : prev.genres.filter((g) => g !== genre?.id),
                          }));
                        }}
                        className="accent-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {genre?.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {isPopupOpen && (
        <FavoritesDialog
          favorites={favorites}
          onClose={() => setIsPopupOpen(false)}
          toggleFavorite={toggleFavorite}
        />
      )}
    </header>
  );
};

export default Header;
