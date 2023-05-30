import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import "./movie-list.scss";

import { SwiperSlide, Swiper } from "swiper/react";
import tmdbApi from "../../api/tmdbApi";
import MovieCard from "../movie-card/MovieCard";

import axios from "axios";
import { ServerApi } from "../../api/ServerApi";
import apiConfig from "../../api/apiConfig";
import { useParams } from "react-router-dom";

const MovieList = (props) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getList = async () => {
      let response = null;
      const params = {};

      if (props.type !== "similar") {
        switch (props.category) {
          case "movie":
            response = await tmdbApi.getMoviesList(props.type, { params });
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
  }, [props.type, props.category, props.id]);

  const _id = localStorage.getItem("id");
  const [userId, setUserId] = useState(_id);
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
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMovieLikes();
  }, [userId]);

  const [list, setList] = useState([]);
  const [movieId, setMovieId] = useState([]);
  const { id } = useParams();
  const [recommendId, setRecommendID] = useState([]);

  useEffect(() => {
    if (movieLike !== undefined && tvLike !== undefined) {
      const getMyLists = async () => {
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
      };
      getMyLists();
    }
  }, [movieLike, tvLike]);

  useEffect(() => {
    setMovieId(id);

    if (window.location.href === `http://localhost:3000/movie/${id}`) {
      const searchData = async () => {
        try {
          const response = await axios.get(
            `${ServerApi}/movie/${movieId}/list`,
            {
              movieId,
            }
          );
          setRecommendID(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      searchData();
    }

    const getList = async () => {
      const recommendResultList = [];

      for (const recommend of recommendId) {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${recommend}?api_key=${apiConfig.apiKey}&language=ko-KR&region=KR`
        );
        const data = await response.json();
        recommendResultList.push(data);
      }

      setList([...recommendResultList]);
    };

    getList();
  }, [id, movieId, recommendId]);

  return (
    <div className="movie-list">
      {/* 마이페이지 부분만 좋아요 띄우기 */}
      {window.location.href === "http://localhost:3000/mypage" ? (
        <Swiper grabCursor={true} spaceBetween={10} slidesPerView={"auto"}>
          {list.map((item, i) => {
            if (
              props.category === "movie" &&
              (!movieLike || movieLike.includes(item.id.toString())) &&
              (!tvLike || !tvLike.includes(item.id.toString()))
            ) {
              return (
                <SwiperSlide key={i}>
                  <MovieCard item={item} category={props.category} />
                </SwiperSlide>
              );
            }
            if (
              props.category === "tv" &&
              tvLike &&
              tvLike.includes(item.id.toString()) &&
              (!movieLike || !movieLike.includes(item.id.toString()))
            ) {
              return (
                <SwiperSlide key={i}>
                  <MovieCard item={item} category={props.category} />
                </SwiperSlide>
              );
            }
            return null;
          })}
          {(movieLike || tvLike) &&
          list.some(
            (item) =>
              movieLike?.includes(item.id.toString()) ||
              tvLike.includes(item.id.toString())
          ) ? null : (
            <p>좋아요 한 내역이 없습니다.</p>
          )}
        </Swiper>
      ) : window.location.href === `http://localhost:3000/movie/${id}` ? (
        <Swiper grabCursor={true} spaceBetween={10} slidesPerView={"auto"}>
          {list.map((item, i) => {
            if (
              props.category === "movie" &&
              recommendId.includes(item.id.toString())
            ) {
              return (
                <SwiperSlide key={i}>
                  <MovieCard item={item} category={props.category} />
                </SwiperSlide>
              );
            }
            return null;
          })}
          {list.every((item) => {
            const itemId = item.id.toString();
            return (
              !recommendId.includes(itemId) && !recommendId.includes(itemId)
            );
          }) && <p>최신 영화입니다.</p>}
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
