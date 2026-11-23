import { ApiError } from "./http";
import {
  getMovieDetails,
  searchMovies,
  toMovie,
  toMovieDetails,
  type OmdbMovie,
} from "./omdb";

const darkKnight: OmdbMovie = {
  imdbID: "tt0468569",
  Title: "The Dark Knight",
  Year: "2008",
  Poster: "https://example.com/poster.jpg",
  Rated: "PG-13",
  Runtime: "152 min",
  Genre: "Action, Crime, Drama",
  Director: "Christopher Nolan",
  Actors: "Christian Bale, Heath Ledger",
  Plot: "Batman faces the Joker.",
  imdbRating: "9.1",
};

function mockFetch(status: number, body: unknown) {
  return jest.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

beforeEach(() => {
  process.env.EXPO_PUBLIC_OMDB_API_KEY = "test-key";
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("mapping", () => {
  it("maps a full OMDb movie into MovieDetails", () => {
    expect(toMovieDetails(darkKnight)).toEqual({
      id: "tt0468569",
      title: "The Dark Knight",
      year: "2008",
      posterUrl: "https://example.com/poster.jpg",
      rated: "PG-13",
      runtime: "152 min",
      genres: ["Action", "Crime", "Drama"],
      director: "Christopher Nolan",
      actors: ["Christian Bale", "Heath Ledger"],
      plot: "Batman faces the Joker.",
      imdbRating: 9.1,
    });
  });

  it('turns "N/A" into null or an empty list', () => {
    const details = toMovieDetails({
      ...darkKnight,
      Poster: "N/A",
      Rated: "N/A",
      Genre: "N/A",
      Plot: "N/A",
      imdbRating: "N/A",
    });

    expect(details.posterUrl).toBeNull();
    expect(details.rated).toBeNull();
    expect(details.genres).toEqual([]);
    expect(details.plot).toBeNull();
    expect(details.imdbRating).toBeNull();
    expect(toMovie({ ...darkKnight, Poster: "N/A" }).posterUrl).toBeNull();
  });
});

describe("requests", () => {
  it("searches movies and maps the results", async () => {
    const fetchSpy = mockFetch(200, {
      Response: "True",
      Search: [darkKnight],
      totalResults: "1",
    });

    await expect(searchMovies("batman")).resolves.toEqual([
      toMovie(darkKnight),
    ]);

    const url = String(fetchSpy.mock.calls[0][0]);
    expect(url).toContain("s=batman");
    expect(url).toContain("type=movie");
    expect(url).toContain("apikey=test-key");
  });

  it('throws OMDb\'s message when it answers HTTP 200 with Response "False"', async () => {
    mockFetch(200, { Response: "False", Error: "Movie not found!" });

    await expect(searchMovies("zzzz")).rejects.toThrow(
      new ApiError("Movie not found!"),
    );
  });

  it("throws OMDb's message for an invalid key (HTTP 401)", async () => {
    mockFetch(401, { Response: "False", Error: "Invalid API key!" });

    await expect(getMovieDetails("tt0468569")).rejects.toThrow(
      "Invalid API key!",
    );
  });

  it("keeps the status for other HTTP errors", async () => {
    mockFetch(500, undefined);

    await expect(getMovieDetails("tt0468569")).rejects.toMatchObject({
      status: 500,
    });
  });

  it("fails clearly when the API key is missing, without calling OMDb", async () => {
    delete process.env.EXPO_PUBLIC_OMDB_API_KEY;
    const fetchSpy = mockFetch(200, {});

    await expect(searchMovies("batman")).rejects.toThrow(
      "Missing EXPO_PUBLIC_OMDB_API_KEY",
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
