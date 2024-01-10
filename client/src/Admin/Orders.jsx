import React, { useEffect, useState } from "react";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const getAllOrders = async () => {
    let response = await axios.get(
      "http://localhost:5076/api/Order/GetAllOrder"
    );
    if (response.data) {
      setOrders(response.data);
    }
  };

  const handleAccept = async (id) => {
    try {
      let response = await axios({
        method: "put",
        url: "http://localhost:5076/api/Manager/AcceptOrder",
        params: {
          id,
        },
      });

      if (response.data) {
        getAllOrders();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDefault = (id, statusCode) => {
    navigate(`/Admin/OrderDetail/${id}/${statusCode}`);
  };
  useEffect(() => {
    getAllOrders();
  }, []);
  return (
    <MDBTable align="middle">
      <MDBTableHead>
        <tr>
          <th scope="col">Mã đơn hàng</th>
          <th scope="col">Mã người dùng</th>
          <th scope="col">Thành tiền</th>
          <th scope="col">Ngày đặt</th>
          <th scope="col">Địa chỉ</th>
          <th scope="col">Số điện thoại</th>
          <th scope="col">Trạng thái</th>
          <th scope="col">Chức năng</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {orders.map((order) => {
          return (
            <tr key={order.ID_Order}>
              <td>
                <div className="d-flex align-items-center">
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{order.ID_Order}</p>
                  </div>
                </div>
              </td>
              <td>
                <p className="fw-normal mb-1">{order.Id}</p>
              </td>
              <td>
                <p className="fw-normal mb-1">
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(order.Total)}
                </p>
              </td>
              <td>
                <p className="fw-normal mb-1">
                  {moment(order.OrderDay).format("DD/MM/YYYY")}
                </p>
              </td>
              <td>
                <p className="fw-normal mb-1">{order.Address}</p>
              </td>
              <td>
                <p className="fw-normal mb-1">{order.PhoneNumber}</p>
              </td>
              <td>
                {order.Status === 1 ? (
                  <MDBBadge color="success" pill>
                    Đã xác nhận
                  </MDBBadge>
                ) : (
                  <MDBBadge color="warning" pill>
                    Chưa xác nhận
                  </MDBBadge>
                )}
              </td>

              <td>
                <MDBBtn
                  color="link"
                  rounded
                  size="sm"
                  disabled={order.Status === 1}
                  onClick={() => handleAccept(order.ID_Order)}
                >
                  Xác nhận
                </MDBBtn>
                <MDBBtn
                  color="link"
                  rounded
                  size="sm"
                  onClick={() => handleDefault(order.ID_Order, order.Status)}
                >
                  Chi tiết
                </MDBBtn>
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
