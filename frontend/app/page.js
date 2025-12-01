"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./movie-styles.css";

export default function Home() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch movies from backend
  const fetchMovies = async () => {
    try {
      const res = await fetch("http://localhost:3000/movies");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      alert("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMovies();
  }, []);

  // Add a new movie
  const addMovie = async () => {
    router.push("/add-movie");
  };

  // Delete a movie
  const deleteMovie = async (_id) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    try {
      await fetch(`http://localhost:3000/movies/${_id}`, {
        method: "DELETE",
      });
      setMovies((prev) => prev.filter((m) => m._id !== _id));
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Error deleting movie");
    }
  };

  return (
    <div>
      <div>
        {/* Title */}
        <h1 className="text-yellow-400 font-extrabold text-5xl text-center mt-8">
          Movie System
        </h1>

        {/* Add Movie Button */}
        <div>
          <button onClick={addMovie}>Add New Movie</button>
        </div>

        {/* Movies List */}
        <div>
          {loading ? (
            <p>Loading movies...</p>
          ) : movies.length === 0 ? (
            <p>No movies found.</p>
          ) : (
            <div className="movies-grid">
              {movies.map((movie) => (
                <div key={movie._id} className="movie-card">
                  {/* Movie Image */}
                  <div className="movie-image-container">
                    <img
                      src={movie.image?.medium}
                      alt={movie.name}
                      className="movie-image"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <div>{movie.name}</div>
                  </div>

                  {/* Movie Details */}
                  <div className="movie-details">
                    <h3 className="movie-name">{movie.name}</h3>

                    <div className="movie-info">
                      <div className="info-row">
                        <span className="info-label">Type:</span>
                        <span className="info-value">
                          {movie.type || "N/A"}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Language:</span>
                        <span className="info-value">
                          {movie.language || "N/A"}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Premiered:</span>
                        <span className="info-value">
                          {movie.premiered
                            ? new Date(movie.premiered).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Ended:</span>
                        <span className="info-value">
                          {movie.ended
                            ? new Date(movie.ended).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="movie-actions">
                      <button
                        onClick={() => deleteMovie(movie._id)}
                        className="delete-btn"
                      >
                        Delete Movie
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
