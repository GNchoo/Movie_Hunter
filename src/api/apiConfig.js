const apiConfig = {
  baseUrl: "https://api.themoviedb.org/3/",
  apiKey: "6e20482ba3b125890b997f629e8d56db",

  originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`,
};

export default apiConfig;
