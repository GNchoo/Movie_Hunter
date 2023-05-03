import React from "react";

import "./footer.scss";

import { Link } from "react-router-dom";

import bg from "../../assets/footer-bg.jpg";
import logo from "../../assets/movielogo.png";

const Footer = () => {
  return (
    <div className="footer" style={{ backgroundImage: `url(${bg})` }}>
      <div className="footer__content container">
        <div className="footer__content__logo">
          <div className="logo">
            <img src={logo} alt="" />
            <Link to="/">Movie Hunter</Link>
          </div>
        </div>
        <div className="footer__content__menus">
          <div className="footer__content__menu">
            <Link to="/">Home</Link>
            <Link to="/">연락처</Link>
            <Link to="/">고객센터</Link>
            <Link to="/">1팀에 대해서</Link>
          </div>
          <div className="footer__content__menu">
            <Link to="/">실시간</Link>
            <Link to="/">FAQ</Link>
            <Link to="/">프리미엄</Link>
            <Link to="/">이용약관</Link>
          </div>
          <div className="footer__content__menu">
            <Link to="/">자주 본 것</Link>
            <Link to="/">최근에 본 것</Link>
            <Link to="/ChooChon">추천 알고리즘</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
