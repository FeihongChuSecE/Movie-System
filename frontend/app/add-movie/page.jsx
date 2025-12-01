"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMovie() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    language: "",
    genres: "",
    status: "",
    runtime: "",
    premiered: "",
    ended: "",
    image: "",
    officialSite: "",
    summary: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare the data for submission
      const movieData = {
        ...formData,
        genres: formData.genres
          ? formData.genres.split(",").map((g) => g.trim())
          : [],
        runtime: formData.runtime ? parseInt(formData.runtime) : null,
        id: Date.now(), // Generate a unique ID
      };

      const res = await fetch("http://localhost:3000/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const newMovie = await res.json();
      alert("Movie added successfully!");
      router.push("/"); // Redirect back to main page
    } catch (error) {
      console.error("Error adding movie:", error);
      alert("Error adding movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };
  return (
    <div className="add-movie-container">
      <div className="add-movie-wrapper">
        <div className="add-movie-header">
          <h1>Add New Movie</h1>
          <p>Fill in the details to add a new movie to your collection</p>
        </div>

        <form onSubmit={handleSubmit} className="add-movie-form">
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-section">
              <h3>Basic Information</h3>

              <div className="form-group">
                <label htmlFor="name" className="required">
                  Movie Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter movie name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select type</option>
                  <option value="Scripted">Scripted</option>
                  <option value="Reality">Reality</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Animation">Animation</option>
                  <option value="News">News</option>
                  <option value="Talk Show">Talk Show</option>
                  <option value="Variety">Variety</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="language">Language</label>
                <input
                  type="text"
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  placeholder="e.g., English, Spanish, French"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="genres">Genres</label>
                <input
                  type="text"
                  id="genres"
                  name="genres"
                  value={formData.genres}
                  onChange={handleInputChange}
                  placeholder="Drama, Action, Comedy (comma-separated)"
                  className="form-input"
                />
                <small className="form-help">
                  Separate multiple genres with commas
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select status</option>
                  <option value="Running">Running</option>
                  <option value="Ended">Ended</option>
                  <option value="To Be Determined">To Be Determined</option>
                  <option value="In Development">In Development</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-section">
              <h3>Additional Details</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="runtime">Runtime (minutes)</label>
                  <input
                    type="number"
                    id="runtime"
                    name="runtime"
                    value={formData.runtime}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="60"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="premiered">Premiered Date</label>
                  <input
                    type="date"
                    id="premiered"
                    name="premiered"
                    value={formData.premiered}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ended">Ended Date</label>
                  <input
                    type="date"
                    id="ended"
                    name="ended"
                    value={formData.ended}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="officialSite">Official Website</label>
                <input
                  type="url"
                  id="officialSite"
                  name="officialSite"
                  value={formData.officialSite}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Summary - Full Width */}
          <div className="form-group full-width">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter a brief summary of the movie..."
              className="form-textarea"
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Adding Movie...
                </>
              ) : (
                "Add Movie"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
