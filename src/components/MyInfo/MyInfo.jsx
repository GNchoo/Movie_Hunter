import React, { useState } from "react";
import bg from "../../assets/body-bg.jpg";

const MyInfo = () => {
  const id = localStorage.getItem("id");
  const name = localStorage.getItem("name");
  const birth = localStorage.getItem("birth");
  const sex = localStorage.getItem("sex");

  const [userId, setUserId] = useState(id);
  const [userName, setUserName] = useState(name);
  const [userBirth, setUserBirth] = useState(birth);
  const [userSex, setUserSex] = useState(sex);

  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <p>{userId}</p>
        <p>{userName}</p>
        <p>{userBirth}</p>
        <p>{userSex}</p>
        <button>수정</button>
        <button>탈퇴</button>
      </div>
    </div>
  );
};

export default MyInfo;
