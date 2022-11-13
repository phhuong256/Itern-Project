import React, { useEffect } from "react";
import { StepForwardOutlined } from "@ant-design/icons";
import {
  DatePicker,
  Form,
  Input,
  Col,
  Row,
  Select,
  Table,
  Checkbox,
} from "antd";
import { Button } from "reactstrap";
import "./style.css";
import { IconDatePicker, CustomTable } from "./style";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const columns = [
  {
    title: "行",
    dataIndex: "行",
    key: "行",
  },
  {
    title: "伝票番号",
    dataIndex: "伝票番号",
    key: "伝票番号",
  },
  {
    title: "起票部門",
    dataIndex: "起票部門",
    key: "起票部門",
  },
  {
    title: "伝票日付",
    dataIndex: "伝票日付",
    key: "伝票日付",
  },
  {
    title: "申請日",
    dataIndex: "申請日",
    key: "申請日",
  },
  {
    title: "出納方法",
    dataIndex: "出納方法",
    key: "出納方法",
  },
  {
    title: "出張目的",
    dataIndex: "出張目的",
    key: "出張目的",
  },
  {
    title: "金額",
    dataIndex: "金額",
    key: "金額",
  },
  {
    title: "行選択",
    dataIndex: "行選択",
    key: "行選択",
    render: (text) => <Checkbox />,
  },
];

const dataSource = [
  {
    行: 1,
    伝票番号: 1,
    起票部門: 1,
    伝票日付: 1,
    申請日: 1,
    出納方法: 1,
    出張目的: 1,
    金額: 1,
    行選択: 1,
  },
  {
    行: 2,
    伝票番号: 2,
    起票部門: 2,
    伝票日付: 2,
    申請日: 2,
    出納方法: 2,
    出張目的: 2,
    金額: 2,
    行選択: 2,
  },
];

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
        {/* <form className="form-content">
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
          </div> ガ
        </form> */}
        <Form {...formItemLayout}>
          <Form.Item name="年度" label="年度">
            <Select
              defaultValue="2022"
              style={{ width: 200 }}
              options={[
                {
                  value: "2000",
                  label: "2020",
                },
              ]}
            />
          </Form.Item>
          <Form.Item name="伝票番号" label="伝票番号">
            <Row>
              <Col span={5}>
                <Input style={{ width: 200 }} />
              </Col>
              <Col span={2} style={{ textAlign: "center" }}>
                -
              </Col>
              <Col span={5}>
                <Input style={{ width: 200 }} />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item name="伝票日付" label="伝票日付">
            <Row>
              <Col span={5}>
                <DatePicker
                  style={{ width: 200 }}
                  suffixIcon={<IconDatePicker disable>ガ</IconDatePicker>}
                  placeholder=""
                />
              </Col>
              <Col span={2} style={{ textAlign: "center" }}>
                -
              </Col>
              <Col span={5}>
                <DatePicker
                  style={{ width: 200 }}
                  suffixIcon={<IconDatePicker disable>ガ</IconDatePicker>}
                  placeholder=""
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item name="申請日" label="申請日">
            <Row>
              <Col span={5}>
                <DatePicker
                  style={{ width: 200 }}
                  suffixIcon={<IconDatePicker disable>ガ</IconDatePicker>}
                  placeholder=""
                />
              </Col>
              <Col span={2} style={{ textAlign: "center" }}>
                -
              </Col>
              <Col span={5}>
                <DatePicker
                  style={{ width: 200 }}
                  suffixIcon={<IconDatePicker disable>ガ</IconDatePicker>}
                  placeholder=""
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item name="出納方法" label="出納方法">
            <Row>
              <Col span={5}>
                <Select
                  defaultValue="lucy"
                  style={{ width: 200 }}
                  options={[
                    {
                      value: "lucy",
                      label: "Lucy",
                    },
                  ]}
                />
              </Col>
              <Col span={2} style={{ textAlign: "center" }}>
                -
              </Col>
              <Col span={5}>
                <Select
                  defaultValue="lucy"
                  style={{ width: 200 }}
                  options={[
                    {
                      value: "lucy",
                      label: "Lucy",
                    },
                  ]}
                />
              </Col>
              <Col span={5}>
                <Button style={{ padding: "5px 35px", marginLeft: "200px" }}>
                  Search
                </Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            <Button style={{ marginLeft: 170, padding: "5px 35px" }}>
              Search
            </Button>
          </Form.Item>
        </Form>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10 table-content">
            {/* <CustomTable className="mb-0" striped bordered overflow={2}>
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
            </CustomTable> */}
            <CustomTable
              bordered
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </div>
          <div className="col-1"></div>
        </div>
        <div className="row mt-1">
          <div className="col-8"></div>
          <div className="col-1 d-flex justify-content-center align-items-center">
            交通費計
          </div>
          <div className="col-1 text-center summaryCell px-1 py-1 border border-dark bg-secondary text-white">
            123
          </div>
        </div>
      </>
    );
  }
}
