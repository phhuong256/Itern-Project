import styled from "styled-components";
import { Table } from "antd";

export const IconDatePicker = styled.div`
  background: #a9b5c0;
  padding: 3px;
  font-size: 1.2em;
  font-weight: 500;
  color: black;
`;

export const CustomTable = styled(Table)`
  .ant-table table {
    border: 2px solid black;
  }

  .ant-table-thead > tr > th {
    border-top: 2px solid black !important;
    border-bottom: 2px solid black !important;
  }

  .ant-table-thead > tr > th {
    font-weight: 600;
  }
`;
