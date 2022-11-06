import React from "react";
import { Button } from "reactstrap";
import { DatePicker, Input } from "antd";
import "./style.css";

export default class About extends React.Component {
  render() {
    const onChange = (date, dateString) => {
      console.log(dateString);
    };
    return (
      <div className="container">
        <div className="mb-5">
          <h1 className="text-bold text-center">予定伝票入力</h1>
        </div>
        <form className="form-content">
          <div className="row mb-3 ">
            <div className="col-4 d-flex gap-5">
              <label for="exampleEmail">伝票番号</label>
              <Input className="w-75" />
            </div>
            <div className="col-8 d-flex justify-content-end gap-2">
              <Button color="secondary">登録</Button>
              <Button color="secondary">登録</Button>
              <Button color="secondary">登録</Button>
            </div>
          </div>
          <div className="row">
            <div className="col-4 d-flex gap-5">
              <label for="exampleEmail">伝票日付</label>
              <Input className="w-75" />
            </div>
            <div className="col-4 d-flex gap-5">
              <label for="exampleEmail">出納方法</label>
              <Input className="w-75" />
            </div>
            <div className="col-4 d-flex gap-5">
              <label for="exampleEmail">支払予定日</label>
              <DatePicker onChange={onChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <label for="exampleEmail">年度</label>
            </div>
            <div className="col-2 datetime">
              <DatePicker onChange={onChange} picker="year" />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <label for="exampleEmail">申請日</label>
            </div>
            <div className="col-2 datetime">
              <DatePicker onChange={onChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-1">
              <label for="exampleEmail">起票部門</label>
            </div>
            <div className="col-2 datetime">
              <DatePicker onChange={onChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-4 d-flex gap-5">
              <label for="exampleEmail">出張目的</label>
              <Input className="w-75" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
