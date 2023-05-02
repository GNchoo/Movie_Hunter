import axiosClient from "./axiosClient";

export const category = {
  //사용할 api 카테고리
  movie: "movie",
  tv: "tv",
};

export const movieType = {
  upcoming: "upcoming", // 출시 예정
  popular: "popular", // 인기
  top_rated: "top_rated", //최고 평점
  now_playing: "now_playing", //현재 방영중
};

export const tvType = {
  popular: "popular", // 출시 예정
  top_rated: "top_rated", // 인기
  on_the_air: "on_the_air", //방영중
};

const tmdbApi = {
  getMoviesList: (type, params) => {
    const url = "movie/" + movieType[type] + "?&language=ko-KR&region=KR";
    return axiosClient.get(url, params);
  },
  getTvList: (type, params) => {
    const url = "tv/" + tvType[type] + "?&language=ko-KR&region=KR";
    return axiosClient.get(url, params);
  },
  getVideos: (cate, id) => {
    const url = category[cate] + "/" + id + "/videos?&language=ko-KR&region=KR";
    return axiosClient.get(url, { params: {} });
  },
  search: (cate, params) => {
    const url = "search/" + category[cate] + "?&language=ko-KR&region=KR";
    return axiosClient.get(url, params);
  },
  detail: (cate, id, params) => {
    const url = category[cate] + "/" + id + "?&language=ko-KR&region=KR";
    return axiosClient.get(url, params);
  },
  credits: (cate, id) => {
    const url = category[cate] + "/" + id + "/credits?&language=ko-KR&region=KR";
    return axiosClient.get(url, { params: {} });
  },
  similar: (cate, id) => {
    const url = category[cate] + "/" + id + "/similar?&language=ko-KR&region=KR";
    return axiosClient.get(url, { params: {} });
  },
};

export default tmdbApi;
