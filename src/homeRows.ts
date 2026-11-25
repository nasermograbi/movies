// OMDb has no genre, trending or category endpoints, so each home row is a curated search.
export const HOME_ROWS = [
  { title: "Batman Universe", query: "batman" },
  { title: "Star Wars Saga", query: "star wars" },
  { title: "Wizarding World", query: "harry potter" },
  { title: "Avengers Assemble", query: "avengers" },
  { title: "Mission: Impossible", query: "mission impossible" },
  { title: "Jurassic Adventures", query: "jurassic" },
  { title: "Pixar Favourites", query: "toy story" },
];

export type HomeRowConfig = (typeof HOME_ROWS)[number];

export const FEATURED_MOVIE_ID = "tt15239678"; // Dune: Part Two
