import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ServerApi } from "../../api/ServerApi";
import axios from "axios";
import bg from "../../assets/body-bg.jpg";
import "./BoardDetail.scss";

const BoardDetail = () => {
  const [boardData, setBoardData] = useState({});
  const { id } = useParams(); // useParams 훅을 이용해 URL 파라미터 값을 가져옵니다.

  useEffect(() => {
    axios
      .get(`${ServerApi}/board/list/${id}`)
      .then((response) => {
        console.log(response);
        setBoardData(response.data);
      })
      .catch((error) => console.log(error));
  }, [id]);

  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <div>
          <table>
            <tbody>
              <tr>
                <td className="title-cell">{boardData.title}</td>
              </tr>
              <tr>
                <td className="info-cell">
                  {boardData.writer} | {boardData.date}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="text-container">{boardData.text}</div>
                </td>
              </tr>
            </tbody>
            <button>수정하기</button>
            <button>삭제하기</button>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
