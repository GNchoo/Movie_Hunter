import styled from "styled-components";

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

export const Button = styled.button`
  padding: 10px;
  margin-top: 10px;
  background-color: #666;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: orange;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const Warning = styled.span`
  font-size: 12px;
  color: red;
  margin-bottom: 10px;
  padding: 1px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 20px;

  th,
  td {
    text-align: center;
    padding: 10px;
  }

  th {
    background-color: #333;
  }

  /* 열 너비 조정 */
  th:first-child,
  td:first-child {
    width: 50%;
  }

  th:last-child,
  td:last-child {
    width: 30%;
  }

  input {
    text-align: center;
  }
`;
