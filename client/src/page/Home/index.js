import React, { useEffect } from "react";
import { DatePicker, Input } from "antd";
import { Button, Table } from "reactstrap";
import "./style.css";

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    fetch("https://jsonplaceholder.ir/users", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => this.setState({ data: json }));
  }
  render() {
    const onChange = (date, dateString) => {
      console.log(dateString);
    };

    return (
      <>
        <div className="">
          <h1 className="text-bold text-center">予定伝票一覧</h1>
        </div>
        <form className="form-content">
          <div className="row form-input1">
            <div className="col-1"></div>
            <div className="col-1">
              <label for="exampleEmail">年度</label>
            </div>
            <div className="col-2">
              <DatePicker onChange={onChange} picker="year" />
            </div>
          </div>
          <div className="row form-input">
            <div className="col-1"></div>
            <div className="col-1">
              <label for="exampleEmail">伝票番号</label>
            </div>
            <div className="col-2">
              <Input />
            </div>
            -
            <div className="col-2">
              <Input />
            </div>
          </div>
          <div className="row form-input">
            <div className="col-1"></div>
            <div className="col-1">
              <label for="exampleEmail">伝票日付</label>
            </div>
            <div className="col-2">
              <Input />
            </div>
            -
            <div className="col-2">
              <Input />
            </div>
          </div>
          <div className="row form-input">
            <div className="col-1"></div>
            <div className="col-1">
              <label for="exampleEmail">申請日</label>
            </div>
            <div className="col-1">
              <DatePicker onChange={onChange} />
            </div>
            -
            <div className="col-1">
              <DatePicker onChange={onChange} />
            </div>
          </div>
          <div className="row form-input2">
            <div className="col-1"></div>
            <div className="col-1">
              <label for="exampleEmail">出納方法</label>
            </div>
            <div className="col-2">
              <Input />
            </div>
            -
            <div className="col-2">
              <Input />
            </div>
            <div className="col-3"></div>
            <div className="col-2">
              <Button color="secondary">登録</Button>
            </div>
          </div>
        </form>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10 table-content">
            <Table className="mb-0" striped>
              <thead>
                <tr>
                  <th>行</th>
                  <th>伝票番号</th>
                  <th>起票部門</th>
                  <th>伝票日付</th>
                  <th>申請日</th>
                  <th>出納方法</th>
                  <th>出張目的</th>
                  <th>金額</th>
                  <th>行選択</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                  <td>Mark</td>
                  <td>Otto</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>Larry</td>
                  <td>the Bird</td>
                  <td>@twitter</td>
                  <td>Larry</td>
                  <td>the Bird</td>
                  <td>@twitter</td>
                  <td>Larry</td>
                  <td>the Bird</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="col-1"></div>
        </div>
        <div className="row">
          <div className="col-8"></div>
          <div className="col-1">交通費計</div>
          <div className="col-1 text-center">123</div>
        </div>
      </>
    );
  }
}
