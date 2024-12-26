import { useEffect, useRef, useState } from "react";
import "./App.css";
import MovieCard from "./components/MovieCard";
import { Movie } from "./types/Movie";
import Header from "./components/Header";
import { FiltersType } from "./types/FilterType";

function App() {
  const TMDB_BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Array<Movie>>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const loaderRef = useRef(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isInitialSearchMount = useRef(1);
  const isInitialFilterMount = useRef(1);

  const [filters, setFilters] = useState<FiltersType>({
    genres: [],
    yearStart: "",
    yearEnd: "",
    ratingMin: "",
    ratingMax: "",
  });

  useEffect(() => {
    if (isInitialSearchMount.current <= 2) {
      isInitialSearchMount.current++;
      return;
    }
    if (isInitialFilterMount.current <= 2) {
      isInitialFilterMount.current++;
      return;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    window.scrollTo(0, 0);
    setPage(1);
    setMovies([]);
    setHasMore(true);
  }, [searchQuery, filters]);

  useEffect(() => {
    const fetchMovies = async (
      currentPage: number,
      searchQuery: string,
      filters: FiltersType
    ) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      let url;
      if (searchQuery) {
        url = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=${currentPage}`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=popularity.desc`;
      }

      const apiFilters = [];

      if (filters.yearStart || filters.yearEnd) {
        if (filters.yearStart)
          apiFilters.push(
            `primary_release_date.gte=${filters.yearStart}-01-01`
          );
        if (filters.yearEnd)
          apiFilters.push(`primary_release_date.lte=${filters.yearEnd}-12-31`);
      }

      if (filters.ratingMin || filters.ratingMax) {
        if (filters.ratingMin)
          apiFilters.push(`vote_average.gte=${filters.ratingMin}`);
        if (filters.ratingMax)
          apiFilters.push(`vote_average.lte=${filters.ratingMax}`);
      }

      if (filters.genres && filters.genres.length > 0) {
        apiFilters.push(`with_genres=${filters.genres.join(",")}`);
      }

      if (apiFilters.length > 0) {
        url += "&" + apiFilters.join("&");
      }
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        },
        signal: abortControllerRef.current.signal,
      };

      try {
        const res = await fetch(url, options);
        const data = await res.json();
        if (data.results?.length > 0) {
          if (currentPage === 1) {
            setMovies(data.results);
          } else {
            setMovies((prevMovies) => [...prevMovies, ...data.results]);
          }
          setLoading(false);
        }
        setHasMore(data.page < data.total_pages && data.results.length > 0);
      } catch (error) {
        console.error(error);
        setHasMore(false);
        setLoading(false);
      }
    };

    fetchMovies(page, searchQuery, filters);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [TMDB_BEARER_TOKEN, filters, page, searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    const currentLoaderRef = loaderRef.current;
    return () => {
      if (currentLoaderRef) observer.unobserve(currentLoaderRef);
    };
  }, [hasMore]);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("movie_app_favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (newMovie: Movie) => {
    const movieInFavorites = favorites?.some(
      (movie: Movie) => movie?.id === newMovie?.id
    );
    const updatedFavorites = movieInFavorites
      ? favorites.filter((movie: Movie) => movie?.id !== newMovie?.id)
      : [...favorites, newMovie];
    setFavorites(updatedFavorites);
    localStorage.setItem(
      "movie_app_favorites",
      JSON.stringify(updatedFavorites)
    );
  };

  return (
    <>
      <Header
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={loading}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="mb-4 text-gray-600" role="status" aria-live="polite">
            {movies?.length} movies loaded
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie?.id}
                movie={movie}
                isFavorite={favorites.some((m: Movie) => m?.id == movie?.id)}
                onToggleFavorite={() => toggleFavorite(movie)}
              />
            ))}
          </div>

          {movies?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No movies found matching your criteria
            </div>
          )}
          <div ref={loaderRef} className="text-center py-4">
            {hasMore ? "Loading more movies..." : "No more movies to load"}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
