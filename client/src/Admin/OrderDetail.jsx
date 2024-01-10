import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBCardImage,
} from "mdb-react-ui-kit";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
export default function OrderDetail() {
  const { id, status } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState([]);
  const getProductOrder = async () => {
    let response = await axios({
      method: "get",
      url: "http://localhost:5076/api/Manager/GetAllProductOrder",
      params: {
        id,
      },
    });
    console.log(response.data);
    if (response.data) {
      setOrderDetails(response.data);
    }
  };
  const handleAccept = async () => {
    try {
      let response = await axios({
        method: "put",
        url: "http://localhost:5076/api/Manager/AcceptOrder",
        params: {
          id,
        },
      });

      if (response.data) {
        navigate("/Admin/Orders");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProductOrder();
  }, []);

  return (
    <div>
      <MDBRow>
        {orderDetails.map((orderDetail) => {
          return (
            <MDBCol sm="3">
              <MDBCard>
                <div
                  style={{
                    width: 300,
                  }}
                >
                  <MDBCardImage
                    style={{
                      width: "100%",
                    }}
                    src={`http://localhost:5076/Products/Image/${orderDetail.ImageUrl}`}
                  />
                </div>
                <MDBCardBody>
                  <MDBCardTitle>{orderDetail.NameProduct}</MDBCardTitle>
                  <MDBCardText>
                    Số lượng : {orderDetail.QuantityOrdered}
                  </MDBCardText>
                  <MDBCardText>
                    Đơn giá :{" "}
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(orderDetail.UnitPrice)}
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          );
        })}
      </MDBRow>
      <div
        style={{
          textAlign: "end",
        }}
      >
        <MDBBtn disabled={parseInt(status) === 1} onClick={handleAccept}>
          Xác nhận đơn hàng
        </MDBBtn>
      </div>
    </div>
  );
}
