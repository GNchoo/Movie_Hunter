import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import tmdbApi from "../../api/tmdbApi";

const VideoList = (props) => {
  const { category } = useParams();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const getVideos = async () => {
      const res = await tmdbApi.getVideos(category, props.id);
      setVideos(res.results.slice(0, 4));
    };
    getVideos();
  }, [category, props.id]);

  return (
    <div className="video-list">
      <div className="video-list__container">
        {videos.map((item, i) => (
          <Video key={i} item={item} />
        ))}
      </div>
    </div>
  );
};

const Video = (props) => {
  const item = props.item;
  const iframeRef = useRef(null);

  useEffect(() => {
    const updateIframeSize = () => {
      const containerWidth = iframeRef.current.parentNode.offsetWidth;
      const width = Math.min(containerWidth, 500); // 최대 500px로 크기를 제한합니다.
      const height = (width * 10) / 16 + "px";
      iframeRef.current.setAttribute("width", width);
      iframeRef.current.setAttribute("height", height);
    };

    updateIframeSize();

    window.addEventListener("resize", updateIframeSize);

    return () => {
      window.removeEventListener("resize", updateIframeSize);
    };
  }, []);

  return (
    <div
      className="video"
      style={{
        display: "inline-block",
        marginRight: "10px",
        borderRadius: "8px",
      }}
    >
      <div className="video-list"></div>
      <iframe
        src={`https://www.youtube.com/embed/${item.key}`}
        ref={iframeRef}
        width="50%"
        title="video"
      ></iframe>
    </div>
  );
};

export default VideoList;
