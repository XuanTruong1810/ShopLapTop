import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import axios from "axios";
const { Option } = Select;
const AddProduct = ({ checkChange, handleParentStateChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [otherBrand, setOtherBrand] = useState("");
  const [image, setImage] = useState("");
  const handleOtherBrandChange = (e) => {
    setOtherBrand(e.target.value);
  };
  const [open, setOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [check, setCheck] = useState(false);
  const [form] = Form.useForm();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onFinish = async (values) => {
    try {
      let response = await axios({
        url: "http://localhost:5076/api/Manager/AddProduct",
        method: "post",
        data: {
          Name_Product: values.name,
          CountProduct: values.number,
          Prince: values.prince,
          Description: values.description,
          ID_Brand: values.Brand,
          Image: image,
        },
      });

      if (response.data) {
        message.success("Thêm sản phẩm thành công");
        handleParentStateChange(!checkChange);
      }
    } catch (error) {
      console.log(error);
    }
    onClose();
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
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
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
  useEffect(() => {
    fetchProductTypes();
  }, [check]);
  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Thêm sản phẩm
      </Button>
      <Drawer
        title="Tạo mới sản phẩm"
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
                  image ? `http://localhost:5076/Products/Image/${image}` : null
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
                initialValue={1}
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
      </Drawer>
    </>
  );
};
export default AddProduct;
