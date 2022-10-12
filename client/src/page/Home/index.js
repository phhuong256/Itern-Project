import {
  Layout,
  Row,
  Col,
  DatePicker,
  Input,
  Button,
  Dropdown,
  Space,
  Menu,
  Table,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import React from "react";
import "./style.css";
const { Header, Footer, Sider, Content } = Layout;
const menu = (
  <Menu
    items={[
      {
        label: "monney",
      },
      {
        label: "card",
      },
      {
        label: "banking",
      },
    ]}
  />
);

const columns = [
  {
    title: "行",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street",
  },
  {
    key: "2",
    name: "John",
    age: 42,
    address: "10 Downing Street",
  },
];

function Home() {
  return (
    <Layout>
      <Content>
        <Row>
          <Col span={24} className="header-content">
            予定伝票一覧
          </Col>
          <Col span={24}>
            <Row>
              <Col className="item-content">
                <span>Year</span>
                <DatePicker picker="year" />
              </Col>
            </Row>
            <Row>
              <Col className="item-content-2">
                <span>伝票番号</span>{" "}
                <Input
                  placeholder="meo emo"
                  style={{
                    width: 100,
                  }}
                />{" "}
                -
                <Input
                  placeholder="meo emo"
                  style={{
                    width: 100,
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col className="item-content-2">
                <span>伝票日付</span>{" "}
                <Input
                  placeholder="meo emo"
                  style={{
                    width: 100,
                  }}
                />{" "}
                -
                <Input
                  placeholder="meo emo"
                  style={{
                    width: 100,
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col className="item-content-2">
                <span>申請日</span>
                <DatePicker
                  style={{
                    width: 100,
                  }}
                />
                -
                <DatePicker
                  style={{
                    width: 100,
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col className="item-content-2">
                <span>出納方法</span>
                <Dropdown overlay={menu}>
                  <Button>
                    <Space>
                      Button
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
                -
                <Dropdown overlay={menu}>
                  <Button>
                    <Space>
                      Button
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="table-content">
          <Table dataSource={dataSource} columns={columns} />
        </Row>
      </Content>
    </Layout>
  );
}

export default Home;
