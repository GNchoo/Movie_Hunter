import React from "react";
import { Link } from "react-router-dom";

import { OutlineButton } from "../components/button/Button";
import HeroSlide from "../components/hero-slide/HeroSlide";
import MovieList from "../components/movie-list/MovieList";

import { category, movieType, tvType } from "../api/tmdbApi";

const Home = () => {
  return (
    <>
      <HeroSlide />
      <div className="container">
        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>최신 인기 영화</h2>
            <Link to="/movie">
              <OutlineButton className="small">더보기</OutlineButton>
            </Link>
          </div>
          <MovieList category={category.movie} type={movieType.popular} />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>최고 평점 영화</h2>
            <Link to="/movie">
              <OutlineButton className="small">더보기</OutlineButton>
            </Link>
          </div>
          <MovieList category={category.movie} type={movieType.top_rated} />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>출시 예정 영화</h2>
            <Link to="/movie">
              <OutlineButton className="small">더보기</OutlineButton>
            </Link>
          </div>
          <MovieList category={category.movie} type={movieType.now_playing} />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>최신 인기 방영 TV</h2>
            <Link to="/tv">
              <OutlineButton className="small">더보기</OutlineButton>
            </Link>
          </div>
          <MovieList category={category.tv} type={tvType.popular} />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>최고 평점 TV</h2>
            <Link to="/tv">
              <OutlineButton className="small">더보기</OutlineButton>
            </Link>
          </div>
          <MovieList category={category.tv} type={tvType.top_rated} />
        </div>
      </div>
    </>
  );
};

export default Home;
