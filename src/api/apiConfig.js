const apiConfig = {
  baseUrl: "https://api.themoviedb.org/3/",
  apiKey: "75a6c8f84bc2121753d3b8f055268c1b",

  originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`,
};

export default apiConfig;
