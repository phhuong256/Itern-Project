import React from "react";
import { DatePicker, Input, Radio } from "antd";
import { Button, Table } from "reactstrap";

export default class Page1 extends React.Component {
  render() {
    const onChange = (date, dateString) => {
      console.log(dateString);
    };
    return (
      <>
        <div className="">
          <h1 className="text-bold text-center">部門</h1>
        </div>
        <form className="form-content">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-1">
              <label for="exampleEmail">部門コード</label>
            </div>
            <div className="col-2">
              <Input />
            </div>
          </div>
          <div className="row">
            <div className="col-1"></div>
            <div className="col-1">
              <label for="exampleEmail">部門名</label>
            </div>
            <div className="col-2">
              <Input />
            </div>
          </div>
        </form>
        <div>
          <Button color="secondary">明細追加</Button>
        </div>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10 table-content">
            <Table className="mb-0" striped>
              <thead>
                <tr>
                  <th>選択</th>
                  <th>部門コード</th>
                  <th>部門名</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    <Radio />
                  </th>
                  <td>Mark</td>
                  <td>Otto</td>
                </tr>
                <tr>
                  <th scope="row">
                    <Radio />
                  </th>
                  <td>Mark</td>
                  <td>Otto</td>
                </tr>
                <tr>
                  <th scope="row">
                    <Radio />
                  </th>
                  <td>Mark</td>
                  <td>Otto</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        <div>
          <Button color="secondary">明細追加</Button>
          <Button color="secondary">明細追加</Button>
        </div>
      </>
    );
  }
}
