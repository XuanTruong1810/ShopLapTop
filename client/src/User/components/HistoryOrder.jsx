import { Avatar, Collapse, Divider, List, Space, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
export default function HistoryOrder() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const getAllOrder = async () => {
      try {
        let response = await axios.get(
          "http://localhost:5076/api/Order/History",
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        setOrders(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllOrder();
  }, []);
  orders.forEach((o) => {
    console.log(o);
  });
  return (
    <div>
      {!orders ? (
        <Spin tip="Loading" size="small">
          <div className="content" />
        </Spin>
      ) : (
        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
          {orders.map((order, index) => {
            return (
              <div key={index}>
                <Divider orientation="left">
                  {moment(order.OrderDate).format("DD/MM/YYYY")}
                </Divider>
                {order.Orders.map((or) => {
                  return (
                    <Collapse
                      key={or.OrderId}
                      size="large"
                      items={[
                        {
                          extra: (
                            <Space>
                              {or.Status === 0 ? (
                                <LoadingOutlined
                                  style={{
                                    color: "red",
                                    fontSize: 20,
                                  }}
                                />
                              ) : (
                                <CheckOutlined
                                  style={{
                                    color: "green",
                                    fontSize: 20,
                                  }}
                                  size="large"
                                />
                              )}
                            </Space>
                          ),
                          key: "1",
                          label: `Mã đơn hàng ${or.OrderId}`,
                          children: (
                            <List>
                              {or.OrderDetails.map((detail) => {
                                return (
                                  <List.Item key={detail.ID_orderDetail}>
                                    <List.Item.Meta
                                      avatar={
                                        <Avatar
                                          style={{
                                            width: 250,
                                            height: 150,
                                          }}
                                          shape="square"
                                          src={`http://localhost:5076/Products/Image/${detail.ImageUrl}`}
                                        ></Avatar>
                                      }
                                      title={
                                        <div>
                                          <h3>{detail.ProductName}</h3>
                                        </div>
                                      }
                                      description={
                                        <h4>
                                          Số lượng đặt: {detail.countOrder}
                                        </h4>
                                      }
                                    />
                                  </List.Item>
                                );
                              })}
                            </List>
                          ),
                        },
                      ]}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
