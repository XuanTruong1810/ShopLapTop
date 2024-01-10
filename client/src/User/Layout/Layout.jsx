import React from "react";
import { Layout, Select } from "antd";
import SiderLayout from "./Sider";
import HeaderLayout from "./Header";
import FooterLayout from "./Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { MDBInput } from "mdb-react-ui-kit";
const { Content } = Layout;

const __Layout = ({ colorBgContainer }) => {
  const navigate = useNavigate();

  const onChange = (value) => {
    navigate(`/ProductSort/${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const handleSearch = (keyword) => {
    navigate(`/Product/${keyword}`);
  };
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <SiderLayout />
      <Layout>
        <HeaderLayout colorBgContainer={colorBgContainer} />
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            style={{
              margin: "20px 0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: 220 }}>
                <MDBInput
                  onChange={(e) => handleSearch(e.target.value)}
                  label="Tìm kiếm sản phẩm"
                  type="text"
                />
              </div>
              <div>
                <Select
                  showSearch
                  placeholder="Sắp xếp theo giá"
                  optionFilterProp="children"
                  onChange={onChange}
                  onSearch={onSearch}
                  filterOption={filterOption}
                  options={[
                    {
                      value: 1,
                      label: "Sắp xếp tăng dần",
                    },
                    {
                      value: 2,
                      label: "Sắp xếp giảm dần",
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          <Outlet />

          <Content />
        </Content>
        <FooterLayout />
      </Layout>
    </Layout>
  );
};
export default __Layout;
