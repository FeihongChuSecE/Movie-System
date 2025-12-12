"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./movie-system.css";

export default function Home() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch movies from backend - Updated to port 5000
  const fetchMovies = async () => {
    try {
      const res = await fetch("http://localhost:5000/movies");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      // Silent fail on initial load - backend might not be ready
      console.log("Backend movies will load when available");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMovies();
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(
        (movie) =>
          movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (movie.summary &&
            movie.summary.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredMovies(filtered);
    }
  }, [searchTerm, movies]);

  // Add a new movie
  const addMovie = async () => {
    router.push("/add-movie");
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("Logged out successfully!");
  };

  // Delete a movie - Updated to port 5000 with authentication
  const deleteMovie = async (id) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/movies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Please login to delete movies");
          return;
        }
        throw new Error("Delete failed");
      }

      setMovies((prev) => prev.filter((m) => m.id !== id));
      alert("Movie deleted successfully!");
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Error deleting movie. Please try again.");
    }
  };

  return (
    <div>
      <div>
        {/* Title */}
        <h1 className="text-yellow-400 font-extrabold text-5xl text-center mt-8">
          Movie System
        </h1>

        {/* Search Bar - Available for all users */}
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <input
            type="text"
            placeholder="Search movies by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "16px",
              marginRight: "10px",
            }}
          />
          <button
            onClick={() => setSearchTerm("")}
            style={{
              padding: "10px 15px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>

        {/* Auth Buttons - Different based on login status */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          {isLoggedIn ? (
            <>
              <button onClick={addMovie}>Add New Movie</button>
              <button
                onClick={handleLogout}
                style={{ backgroundColor: "#dc3545", color: "white" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/signup")}>Sign Up</button>
              <button onClick={() => router.push("/login")}>Login</button>
            </>
          )}
        </div>

        {/* Status Message */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {isLoggedIn ? (
            <p style={{ color: "#28a745", fontWeight: "bold" }}>
              Logged in! You can add or delete movies.
            </p>
          ) : (
            <p style={{ color: "#6c757d" }}>Login to manage movies</p>
          )}
        </div>

        {/* Movies List */}
        <div>
          {loading ? (
            <p>Loading movies...</p>
          ) : filteredMovies.length === 0 ? (
            <p>
              {searchTerm
                ? `No movies found matching "${searchTerm}"`
                : "No movies found."}
            </p>
          ) : (
            <div className="movies-grid">
              {filteredMovies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  {/* Movie Image */}
                  <div className="movie-image-container">
                    <img
                      src={
                        // Primary: Check if image is object with medium
                        movie.image &&
                        typeof movie.image === "object" &&
                        movie.image.medium
                          ? movie.image.medium
                          : // Secondary: Check if image is string
                            (typeof movie.image === "string"
                              ? movie.image
                              : null) ||
                            // Fallback: Placeholder
                            "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={movie.name || "Movie poster"}
                      className="movie-image"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        backgroundColor: "#f3f4f6", // Gray background for placeholders
                      }}
                      onError={(e) => {
                        // Multiple fallback attempts
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                        e.target.style.backgroundColor = "#f3f4f6";
                      }}
                      onLoad={(e) => {
                        e.target.style.backgroundColor = "transparent";
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

                    {/* Delete Button - Only for logged-in users */}
                    {isLoggedIn && (
                      <div className="movie-actions">
                        <button
                          onClick={() => deleteMovie(movie.id)}
                          className="delete-btn"
                        >
                          Delete Movie
                        </button>
                      </div>
                    )}
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
