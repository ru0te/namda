import { useState, type SubmitEvent, type ChangeEvent } from "react";

import type { DiscoverFilters, MediaType } from "../types/types";
import Results from "./Results";

const GENRES: Record<MediaType, Record<string, number>> = {
  movie: {
    Action: 28,
    Comedy: 35,
    Drama: 18,
    Horror: 27,
    Romance: 10749,
    "Sci-Fi": 878,
  },
  tv: {
    Action: 10759,
    Comedy: 35,
    Drama: 18,
    "Sci-Fi": 10765,
    Crime: 80,
    Animation: 16,
  },
};

const PROVIDERS: Record<string, number> = {
  Netflix: 8,
  "Prime Video": 9,
  "Disney+": 337,
  Max: 1899,
  Hulu: 15,
  "Apple TV+": 350,
};

function Form() {
  const [type, setType] = useState<MediaType>("movie");
  const [filters, setFilters] = useState<DiscoverFilters | null>(null);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget)) as Omit<
      DiscoverFilters,
      "type"
    >;
    setFilters({ ...values, type });
  }

  function handleTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    setType(e.target.value as MediaType);
  }
  return (
    <div className="form-section">
      <div className="form-heading">
        <h1>Stop scrolling. Start watching.</h1>
        <p>
          Tell us what you're in the mood for and we'll find the perfect movie,
          only from the streaming platforms you already have.
        </p>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="">Media Type</label>
              <select value={type} onChange={handleTypeChange}>
                <option value="movie">Movie</option>
                <option value="tv">TV Show</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="">Genre</label>
              <select name="genre" key={type}>
                <option value="">Any genre</option>
                {Object.entries(GENRES[type]).map(([name, id]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="">Streaming Platform</label>
              <select name="provider">
                <option value="">Any platform</option>
                {Object.entries(PROVIDERS).map(([name, id]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="">Rating</label>
              <select name="minRating">
                <option value="">Any rating</option>
                <option value="6">6+</option>
                <option value="7">7+</option>
                <option value="8">8+</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="">Runtime</label>
              <select name="maxRuntime">
                <option value="">Any length</option>
                <option value="90">Under 90 min</option>
                <option value="120">Under 2 hrs</option>
                <option value="150">Under 2.5 hrs</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Find something to watch
          </button>
        </form>

        <Results filters={filters} />
      </div>
    </div>
  );
}

export default Form;
