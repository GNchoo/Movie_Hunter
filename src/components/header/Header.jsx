import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./header.scss";
import logo from "../../assets/movielogo.png";

const Header = () => {
  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const num = localStorage.getItem("num");

  const headerNav = [
    {
      display: "Home",
      path: "/",
    },
    {
      display: "검색 & 추천",
      path: "/chuchon",
    },
    {
      display: "영화",
      path: "/movie",
    },
    {
      display: "TV 시리즈",
      path: "/tv",
    },
    isLoggedIn && {
      display: "게시판",
      path: "/board/list",
    },
    isLoggedIn && {
      display: "마이 페이지",
      path: `/mypage`,
    },
  ].filter(Boolean);

  const active = headerNav.findIndex((e) => e.path === pathname);

  useEffect(() => {
    const id = localStorage.getItem("id");
    setIsLoggedIn(id != null);
  }, [location]);

  useEffect(() => {
    const shrinkHeader = () => {
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        headerRef.current.classList.add("shrink");
      } else {
        headerRef.current.classList.remove("shrink");
      }
    };
    window.addEventListener("scroll", shrinkHeader);
    return () => {
      window.removeEventListener("scroll", shrinkHeader);
    };
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    alert("로그아웃 완료");
    setIsLoggedIn(false);
  };

  return (
    <div ref={headerRef} className="header">
      <div className="header__wrap container">
        <div className="logo">
          <img src={logo} alt="" />
          <Link to="/">Movie Hunter</Link>
        </div>
        <ul className="header__nav">
          {headerNav.map((e, i) => (
            <li key={i} className={`${i === active ? "active" : ""}`}>
              <Link to={e.path}>{e.display}</Link>
            </li>
          ))}
        </ul>
        <div style={{ marginBottom: "20px" }}>
          {location.pathname === "/login" ? (
            <Link to={"/sign"}>
              <button>회원가입</button>
            </Link>
          ) : isLoggedIn ? (
            <Link to={"/"}>
              <button onClick={handleLogout}>로그아웃</button>
            </Link>
          ) : (
            <Link to={"/login"}>
              <button>로그인</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
