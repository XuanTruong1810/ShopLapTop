import {
  Avatar,
  Badge,
  Col,
  InputNumber,
  List,
  Popover,
  Row,
  Space,
} from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { ShoppingTwoTone, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import RemoveCart from "../components/RemoveCart.jsx";
import UpdateCart from "../components/UpdateCart";

export default function HeaderLayout({ colorBgContainer }) {
  const [carts, setCart] = useState([]);
  const [quality, setQuality] = useState(1);

  useEffect(() => {
    const getCart = async () => {
      try {
        let response = await axios.get(
          "http://localhost:5076/api/Cart/GetCart",
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          setCart(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCart();
  }, [carts]);
  const data = [];
  carts.forEach((cart) => {
    data.push({
      title: cart.NameProduct,
      Image: cart.Image,
      Prince: cart.Prince,
      Quality: cart.Quality,
      id: cart.Id_Product,
    });
  });
  const handleOnchangeCart = (value) => {
    setQuality(value);
  };
  return (
    <Header
      style={{
        height: 70,
        padding: 15,
        background: colorBgContainer,
      }}
    >
      <Row
        gutter={16}
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Col>
          <Space
            style={{
              position: "relative",
              top: "-14px",
            }}
          >
            <Avatar shape="square" size="large" icon={<UserOutlined />} />
          </Space>
        </Col>
        <Col></Col>

        <Col>
          <Space
            style={{
              position: "relative",
              top: "-14px",
            }}
          >
            <div>
              <Popover
                trigger="click"
                size="large"
                placement="right"
                title={
                  <h1
                    style={{
                      color: "yellowgreen",
                    }}
                  >
                    Giỏ hàng của bạn
                  </h1>
                }
                overlayStyle={{
                  width: "24vw",
                  cursor: "pointer",
                }}
                content={
                  <div>
                    <List
                      style={{
                        maxHeight: 500,
                        overflow: "auto",
                      }}
                      itemLayout="horizontal"
                      dataSource={data}
                      renderItem={(item, index) => (
                        <div>
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  shape="square"
                                  size="large"
                                  src={`http://localhost:5076/Products/Image/${item.Image}`}
                                />
                              }
                              title={
                                <a href="https://ant.design">{item.title}</a>
                              }
                              description={
                                <div>
                                  <div>
                                    <InputNumber
                                      onChange={handleOnchangeCart}
                                      size="small"
                                      defaultValue={item.Quality}
                                    />
                                  </div>
                                  <div>
                                    <p>Thành tiền: {item.Prince}</p>
                                  </div>
                                </div>
                              }
                            />
                            <Space>
                              <UpdateCart
                                ProductId={item.id}
                                quality={quality}
                              />
                              <RemoveCart ProductId={item.id} />
                            </Space>
                          </List.Item>
                        </div>
                      )}
                    />
                    <div style={{ textAlign: "center" }}>
                      <Link to="/Cart" style={{ fontSize: 17 }}>
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                }
              >
                <Badge count={carts.length}>
                  <Avatar
                    style={{ cursor: "pointer" }}
                    shape="square"
                    size="large"
                    icon={<ShoppingTwoTone />}
                  ></Avatar>
                </Badge>
              </Popover>
              {/* <div className={styles.avatar}>
                <Avatar
                  shape="circle"
                  size="large"
                  src={
                    image ? `http://localhost:5076/Users/Image/${image}` : null
                  }
                >
                  {image === null && userName.substring(0, 1)}
                </Avatar>
              </div> */}
            </div>
          </Space>
        </Col>
      </Row>
    </Header>
  );
}
