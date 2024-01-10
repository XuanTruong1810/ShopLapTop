import React, { useEffect, useState } from "react";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
} from "mdb-react-ui-kit";
import axios from "axios";
import {
  Avatar,
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Upload,
  message,
} from "antd";
import AddProduct from "./AddProduct";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
export default function Products() {
  const [products, setProducts] = useState([]);
  const [productID, setProductsID] = useState(null);
  const [check, setCheck] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [brands, setBrands] = useState([]);
  const [id, setID] = useState(0);
  const { Option } = Select;
  const [form] = Form.useForm();
  const [otherBrand, setOtherBrand] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const handleOtherBrandChange = (e) => {
    setOtherBrand(e.target.value);
  };
  const showDrawer = async (IdProduct) => {
    try {
      let response = await axios.get(
        "http://localhost:5076/api/Product/GetProductByID",
        {
          params: {
            id: IdProduct,
          },
        }
      );
      if (response && response.data) {
        setID(IdProduct);
        setProductsID(response.data);
        form.setFieldsValue({
          name: response.data.Name_Product,
          number: response.data.Count_Product,
          Brand: response.data.ID_Brand,
          prince: response.data.Prince,
          description: response.data.Description,
        });
        setImage(response.data.Image);
        setOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onClose = () => {
    setOpen(false);
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const getAllProduct = async () => {
    try {
      let response = await axios.get(
        "http://localhost:5076/api/Manager/GetAllProduct"
      );
      if (response.data) {
        console.log(response.data);
        setProducts(response.data);
        setSearchedProducts(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllProduct();
  }, [check]);
  const handleParentStateChange = (newValue) => {
    setCheck(newValue);
  };
  const handleRemoveProduct = async (id) => {
    try {
      let response = await axios.delete(
        "http://localhost:5076/api/Manager/DeleteProduct",
        {
          params: {
            id,
          },
        }
      );
      if (response.data) {
        setCheck(!check);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onFinish = async (values) => {
    console.log(values);
    console.log(image);
    try {
      let response = await axios({
        url: "http://localhost:5076/api/Manager/UpdateProduct",
        method: "put",
        params: {
          id: id,
        },
        data: {
          Name_Product: values.name,
          CountProduct: values.number,
          Prince: values.prince,
          Description: values.description,
          ID_Brand: values.Brand,
          Image: image,
        },
      });
      console.log(response);
      if (response) {
        message.success("Chỉnh sửa sản phẩm thành công");
        handleParentStateChange(!check);
      }
    } catch (error) {
      console.log(error);
    }
    onClose();
  };
  const handleChange = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:5076/api/Upload/UploadImageProduct",
        formData,
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        setImage(response.data);

        message.success(`Uploaded successfully`);
        onSuccess();
      } else {
        message.error(`Upload failed.`);
        onError();
      }
    } catch (error) {
      console.error("Error during upload:", error);
      onError();
    }
  };
  const fetchProductTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5076/api/Product/GetBrand"
      );
      if (response.data) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };
  useEffect(() => {
    fetchProductTypes();
  }, [check]);
  const onchangeProduct = (value) => {
    const filteredProducts = products.filter((product) =>
      product.Name_Product.toLowerCase().includes(value.toLowerCase())
    );
    setSearchedProducts(filteredProducts);
    console.log(searchedProducts);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <MDBInput
            onChange={(e) => onchangeProduct(e.target.value)}
            label="Tìm kiếm sản phẩm"
            id="form1"
            type="text"
          />
        </div>
        <div>
          <AddProduct
            handleParentStateChange={handleParentStateChange}
            checkChange={check}
          />
        </div>
      </div>
      <MDBTable align="middle">
        <MDBTableHead>
          <tr>
            <th scope="col" style={{ width: "28%" }}>
              Tên Sản phẩm
            </th>
            <th scope="col" style={{ width: "18%" }}>
              Số lượng tồn
            </th>
            <th scope="col" style={{ width: "21%" }}>
              Loại sản phẩm
            </th>
            <th scope="col" style={{ width: "16%" }}>
              Giá
            </th>
            <th scope="col">Cập nhật</th>
          </tr>
        </MDBTableHead>
      </MDBTable>
      <div style={{ maxHeight: 400, overflow: "auto" }}>
        <MDBTable align="middle">
          <MDBTableBody>
            {searchedProducts.map((product) => {
              return (
                <tr key={product.ID_Product}>
                  <td style={{ width: "30%" }}>
                    <div className="d-flex align-items-center">
                      <img
                        src={`http://localhost:5076/Products/Image/${product.Image}`}
                        alt=""
                        style={{ width: "45px", height: "45px" }}
                        className="rounded-circle"
                      />
                      <div className="ms-3">
                        <p className="fw-bold mb-1">{product.Name_Product}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ width: "19%" }}>
                    <p className="fw-normal mb-1">{product.Count_Product}</p>
                  </td>
                  <td style={{ width: "18%" }}>
                    <MDBBadge
                      color="success"
                      pill
                      style={{ width: 50, textAlign: "center", padding: 5 }}
                    >
                      {product.Name_Brand}
                    </MDBBadge>
                  </td>
                  <td>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.Prince)}
                  </td>
                  <td>
                    <MDBBtn
                      color="link"
                      rounded
                      size="sm"
                      onClick={() => showDrawer(product.ID_Product)}
                    >
                      <EditIcon style={{ color: "#808080" }} />
                    </MDBBtn>
                    <MDBBtn color="link" rounded size="sm">
                      <Popconfirm
                        title="Xóa sản phẩm"
                        description="Bạn chắc chắn muốn xóa sản phẩm này chứ"
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() =>
                          handleRemoveProduct(product.ID_Product)
                        }
                      >
                        <DeleteIcon style={{ color: "red" }} />
                      </Popconfirm>
                    </MDBBtn>
                  </td>
                </tr>
              );
            })}
          </MDBTableBody>
        </MDBTable>
      </div>
      <Drawer
        title="Chỉnh sửa sản phẩm"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Thoát</Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => form.submit()}
            >
              Chấp nhận
            </Button>
          </Space>
        }
      >
        {productID ? (
          <Form layout="vertical" onFinish={onFinish} form={form}>
            <Form.Item
              name="Image"
              label="Ảnh sản phẩm"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                customRequest={handleChange}
                showUploadList={false}
                listType="picture-card"
              >
                <Avatar
                  shape="square"
                  size={100}
                  src={
                    image
                      ? `http://localhost:5076/Products/Image/${image}`
                      : null
                  }
                ></Avatar>
              </Upload>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập tên sản phẩm",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="number"
                  label="Số lượng sản phẩm"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập số lượng sản phẩm",
                    },
                  ]}
                >
                  <InputNumber minLength={1} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="Brand"
                  label="Loại sản phẩm"
                  rules={[
                    {
                      required: true,
                      message: "Hãy chọn loại sản phẩm",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn loại sản phẩm"
                    onChange={(value) => {
                      if (value === "other") {
                        setShowModal(true);
                      } else {
                        setShowModal(false);
                      }
                    }}
                  >
                    {brands.map((brand) => {
                      return (
                        <Option key={brand.ID_Brand} value={brand.ID_Brand}>
                          {brand.Name_Brand}
                        </Option>
                      );
                    })}
                    <Option value="other">Khác</Option>
                  </Select>
                </Form.Item>
                <Modal
                  title="Nhập tên loại sản phẩm khác"
                  open={showModal}
                  onCancel={() => setShowModal(false)}
                  onOk={async () => {
                    try {
                      axios({
                        method: "post",
                        url: "http://localhost:5076/api/Manager/AddBrand",
                        params: {
                          name: otherBrand,
                        },
                      });
                      setShowModal(false);
                      setCheck(!check);
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  <Form.Item
                    name="otherBrand"
                    label="Tên loại sản phẩm khác"
                    rules={[
                      {
                        required: true,
                        message: "Hãy nhập tên loại sản phẩm khác",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên loại sản phẩm khác"
                      value={otherBrand}
                      onChange={handleOtherBrandChange}
                    />
                  </Form.Item>
                </Modal>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="prince"
                  label="Giá sản phẩm"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập giá của sản phẩm",
                    },
                  ]}
                >
                  <Input placeholder="Nhập giá của sản phẩm" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Mô tả sản phẩm"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập mô tả sản phẩm",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="Mô tả sản phẩm" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : (
          <Spin />
        )}
      </Drawer>
    </div>
  );
}
