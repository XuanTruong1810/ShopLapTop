import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Checkbox, Form, InputNumber, notification } from "antd";
import { useNavigate } from "react-router-dom";
export default function CartDetail() {
  const [carts, setCart] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const getCart = async () => {
      try {
        let response = await axios.get(
          "http://localhost:5076/api/Cart/GetCart",
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        if (response.data) {
          setCart(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCart();
  }, []);
  useEffect(() => {
    const generateCheckboxes = () => {
      const checkboxesData = carts.map((cart) => ({
        Id_Product: cart.Id_Product,
        NameProduct: cart.NameProduct,
        Image: `http://localhost:5076/Products/Image/${cart.Image}`,
        Quality: cart.Quality,
        Prince: cart.Prince,
        IsChecked: false,
      }));
      return checkboxesData;
    };
    const checkboxesData = generateCheckboxes();
    setCheckboxes(checkboxesData);
  }, [carts]);

  const [checkAll, setCheckAll] = useState(false);

  const handleCheckAllChange = (e) => {
    const isChecked = e.target.checked;
    setCheckAll(isChecked);

    const updatedCheckboxes = checkboxes.map((checkbox) => ({
      ...checkbox,
      isChecked,
    }));

    setCheckboxes(updatedCheckboxes);
  };

  const handleCheckboxChange = (index) => {
    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes[index].isChecked = !updatedCheckboxes[index].isChecked;

    setCheckboxes(updatedCheckboxes);
  };
  useEffect(() => {
    let totalPrice = 0;
    checkboxes.forEach((checkbox) => {
      if (checkbox.isChecked) {
        totalPrice += checkbox.Quality * checkbox.Prince;
      }
    });
    setTotal(totalPrice);
  }, [checkboxes]);

  ///call api
  const getSelectedProducts = () => {
    const selectedProducts = checkboxes
      .filter((checkbox) => checkbox.isChecked)
      .map((selectedCheckbox) => ({
        Id_Product: selectedCheckbox.Id_Product,
        CountOrder: selectedCheckbox.Quality,
      }));

    return {
      selectedProducts,
      countSelect: selectedProducts.length,
    };
  };
  const handleQuantityChange = (index, newQuantity) => {
    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes[index].Quality = newQuantity;

    setCheckboxes(updatedCheckboxes);

    let totalPrice = 0;
    updatedCheckboxes.forEach((checkbox) => {
      if (checkbox.isChecked) {
        totalPrice += checkbox.Quality * checkbox.Prince;
      }
    });
    setTotal(totalPrice);
  };
  //Id_Product
  const clearCookie = async (selectedProducts) => {
    try {
      const productIds = selectedProducts.map((product) => product.Id_Product);

      const response = await axios({
        method: "delete",
        url: "http://localhost:5076/api/Cart/DeleteCart",
        data: productIds,
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log("Products deleted successfully");
      } else {
        console.log("Failed to delete products");
      }
    } catch (error) {
      console.error("Error deleting products:", error);
    }
  };

  console.log(getSelectedProducts().selectedProducts);
  let countSelect = getSelectedProducts().countSelect;
  const onFinish = async (values) => {
    const selectedProducts = getSelectedProducts().selectedProducts;
    if (selectedProducts.length !== 0) {
      try {
        let response = await axios({
          method: "post",
          url: "http://localhost:5076/api/BuyProduct",
          data: {
            Address: values.address,
            PhoneNumber: values.telephone,
            OrderDetailModels: selectedProducts,
          },
          withCredentials: true,
        });
        if (response.status === 200) {
          notification.success({
            placement: "topRight",
            message: `Đặt hàng thành công`,
            bottom: 50,
            duration: 3,
            rtl: true,
          });
          clearCookie(selectedProducts);
          navigate("/HistoryOrder");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      notification.success({
        placement: "topRight",
        message: `Vui lòng chọn 1 sản phẩm mua`,
        bottom: 50,
        duration: 3,
        rtl: true,
      });
    }
  };
  return (
    <section className=" h-custom">
      <MDBContainer className="py-2 h-100" style={{ padding: 0 }}>
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol size="12">
            <MDBCard
              className="card-registration card-registration-2"
              style={{ borderRadius: "15px" }}
            >
              <MDBCardBody className="p-0">
                <MDBRow className="g-0">
                  <MDBCol lg="8">
                    <div className="p-5">
                      <div className="d-flex justify-content-between align-items-center mb-5">
                        <MDBTypography
                          tag="h1"
                          className="fw-bold mb-0 text-black"
                        >
                          Shopping Cart
                        </MDBTypography>

                        <Checkbox
                          checked={checkAll}
                          onChange={handleCheckAllChange}
                        >
                          Chọn tất cả
                        </Checkbox>
                      </div>
                      <hr className="my-4" />
                      <div
                        style={{
                          height: 400,

                          overflowY: "scroll",
                          overflowX: "hidden",
                          padding: 10,
                        }}
                      >
                        {checkboxes.map((checkbox, index) => {
                          return (
                            <div key={checkbox.Id_Product}>
                              <Checkbox
                                checked={checkbox.isChecked}
                                onChange={() => handleCheckboxChange(index)}
                              >
                                {checkbox.name}
                              </Checkbox>
                              <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
                                <MDBCol md="2" lg="2" xl="2">
                                  <MDBCardImage
                                    src={checkbox.Image}
                                    fluid
                                    className="rounded-3"
                                  />
                                </MDBCol>
                                <MDBCol md="3" lg="3" xl="3">
                                  <MDBTypography
                                    tag="h6"
                                    className="text-muted"
                                  >
                                    {checkbox.NameProduct}
                                  </MDBTypography>
                                  <MDBTypography
                                    tag="h6"
                                    className="text-black mb-0"
                                  >
                                    {checkbox.NameProduct}
                                  </MDBTypography>
                                </MDBCol>
                                <MDBCol
                                  md="3"
                                  lg="3"
                                  xl="3"
                                  className="d-flex align-items-center"
                                >
                                  <InputNumber
                                    defaultValue={checkbox.Quality}
                                    onChange={(value) =>
                                      handleQuantityChange(index, value)
                                    }
                                    min={1}
                                    max={5}
                                  />
                                </MDBCol>
                                <MDBCol
                                  md="3"
                                  lg="2"
                                  xl="2"
                                  className="text-end"
                                >
                                  <MDBTypography tag="h6" className="mb-0">
                                    {Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(checkbox.Prince)}
                                  </MDBTypography>
                                </MDBCol>
                                <MDBCol
                                  md="1"
                                  lg="1"
                                  xl="1"
                                  className="text-end"
                                >
                                  <MDBIcon fas icon="times" />
                                </MDBCol>
                              </MDBRow>

                              <hr className="my-4" />
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-5">
                        <MDBTypography tag="h6" className="mb-0">
                          <MDBCardText tag="span" className="text-body">
                            <Link to="/">
                              <MDBIcon fas icon="long-arrow-alt-left me-2" />
                              Back to Shop
                            </Link>
                          </MDBCardText>
                        </MDBTypography>
                      </div>
                    </div>
                  </MDBCol>
                  <MDBCol lg="4" className="bg-grey">
                    <div className="p-5">
                      <MDBTypography
                        tag="h3"
                        className="fw-bold mb-5 mt-2 pt-1"
                      >
                        Summary
                      </MDBTypography>

                      <hr className="my-4" />

                      <div className="d-flex justify-content-between mb-4">
                        <MDBTypography tag="h5">
                          {countSelect} Sản phẩm
                        </MDBTypography>
                      </div>
                      <Form onFinish={onFinish} name="control-Form">
                        <Form.Item
                          name="address"
                          rules={[
                            {
                              required: true,
                              message: "Phải nhập địa chỉ",
                            },
                          ]}
                        >
                          <div>
                            <MDBTypography
                              tag="h5"
                              className="text-uppercase mb-3"
                            >
                              Địa chỉ
                            </MDBTypography>
                            <div className="mb-1">
                              <MDBInput size="lg" label="Enter your code" />
                            </div>
                          </div>
                        </Form.Item>

                        <Form.Item
                          name="telephone"
                          rules={[
                            {
                              required: true,
                              message: "Phải nhập số điện thoại",
                            },
                          ]}
                        >
                          <div>
                            <MDBTypography
                              tag="h5"
                              className="text-uppercase mb-3"
                            >
                              Số điện thoại
                            </MDBTypography>
                            <div className="mb-1">
                              <MDBInput size="lg" label="Enter your code" />
                            </div>
                          </div>
                        </Form.Item>

                        <hr className="my-4" />

                        <div className="d-flex justify-content-between mb-5">
                          <MDBTypography tag="h5" className="text-uppercase">
                            Total price
                          </MDBTypography>
                          <MDBTypography tag="h5">
                            {Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(total)}
                          </MDBTypography>
                        </div>

                        <Form.Item name="submit">
                          <MDBBtn type="submit" color="dark" block size="lg">
                            Mua Hàng
                          </MDBBtn>
                        </Form.Item>
                      </Form>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
