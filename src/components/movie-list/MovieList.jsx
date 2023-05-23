import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import "./movie-list.scss";

import { SwiperSlide, Swiper } from "swiper/react";
import tmdbApi, { category } from "../../api/tmdbApi";
import MovieCard from "../movie-card/MovieCard";

import axios from "axios";
import { ServerApi } from "../../api/ServerApi";
import apiConfig from "../../api/apiConfig";

const MovieList = (props) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getList = async () => {
      let response = null;
      const params = {};

      if (props.type !== "similar") {
        switch (props.category) {
          case category.movie:
            response = await tmdbApi.getMoviesList(props.type, {
              params,
            });
            break;
          default:
            response = await tmdbApi.getTvList(props.type, { params });
        }
      } else {
        response = await tmdbApi.similar(props.category, props.id);
      }
      setItems(response.results);
    };
    getList();
  }, []);

  const id = localStorage.getItem("id");
  const [userId, setUserId] = useState(id);
  const [movieLike, setMovieLike] = useState([]);
  const [tvLike, setTvLike] = useState([]);

  useEffect(() => {
    const fetchMovieLikes = async () => {
      try {
        const response = await axios.get(
          `${ServerApi}/mypage?username=${userId}`
        );
        setMovieLike(response.data.movieLikes);
        setTvLike(response.data.tvLikes);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMovieLikes();
  }, [userId]);

  const [list, setList] = useState([]);

  useEffect(() => {
    const getList = async () => {
      const movieResultList = [];
      const tvResultList = [];
      for (const movieId of movieLike) {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiConfig.apiKey}&language=ko-KR&region=KR`
        );
        const data = await response.json();
        movieResultList.push(data);
      }

      for (const tvId of tvLike) {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiConfig.apiKey}&language=ko-KR&region=KR`
        );
        const data = await response.json();
        tvResultList.push(data);
      }

      setList([...movieResultList, ...tvResultList]);
      console.log([...movieResultList, ...tvResultList]);
    };

    getList();
  }, [movieLike, tvLike]);

  console.log(list);
  console.log(items);

  return (
    <div className="movie-list">
      {/* 마이페이지 부분만 좋아요 띄우기 */}
      {window.location.href === "http://localhost:3000/mypage" ? (
        <Swiper grabCursor={true} spaceBetween={10} slidesPerView={"auto"}>
          {list.map((item, i) => {
            if (
              props.category === "movie" &&
              movieLike.includes(item.id.toString())
            ) {
              return (
                <SwiperSlide key={i}>
                  <MovieCard item={item} category={props.category} />
                </SwiperSlide>
              );
            }
            if (
              props.category === "tv" &&
              tvLike.includes(item.id.toString())
            ) {
              return (
                <SwiperSlide key={i}>
                  <MovieCard item={item} category={props.category} />
                </SwiperSlide>
              );
            }
            return null;
          })}
          {items.every(
            (item) =>
              !movieLike.includes(item.id.toString()) &&
              !tvLike.includes(item.id.toString())
          ) && <p>좋아요 한 내역이 없습니다.</p>}
        </Swiper>
      ) : (
        <Swiper grabCursor={true} spaceBetween={10} slidesPerView={"auto"}>
          {items.map((item, i) => (
            <SwiperSlide key={i}>
              <MovieCard item={item} category={props.category} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

MovieList.propTypes = {
  category: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default MovieList;
