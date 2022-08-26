import { useState, useEffect, useCallback } from "react";
import { Table, Input, Slider, Button, Select, Col, Row } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import colleges from "./lookup/colleges.json";
import branchCodes from "./lookup/branchCodes.json";

const { Option } = Select;

// eslint-disable-next-line
Number.prototype.between = function (a, b) {
  let min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this >= min && this <= max;
};

const initialFilter = {
  coc: "",
  con: "",
  brc: "",
  brn: "",
  OC: [190, 200],
  BC: [185, 200],
  BCM: [0, 0],
  MBC: [0, 0],
  MBCDNC: [0, 0],
  MBCV: [0, 0],
  SC: [0, 0],
  SCA: [0, 0],
  ST: [0, 0],
};

const communityCodes = [
  "OC",
  "BC",
  "BCM",
  "MBC",
  "MBCDNC",
  "MBCV",
  "SC",
  "SCA",
  "ST",
];

const columns = [
  {
    title: "College Name",
    dataIndex: "con",
    key: "con",
    fixed: "left",
    width: 200,
  },
  {
    title: "College Code",
    dataIndex: "coc",
    key: "coc",
  },
  {
    title: "Branch Code",
    dataIndex: "brc",
    key: "brc",
  },
  {
    title: "Branch Name",
    dataIndex: "brn",
    key: "brn",
  },
  {
    title: "OC",
    dataIndex: "OC",
    key: "OC",
  },
  {
    title: "BC",
    dataIndex: "BC",
    key: "BC",
  },
  {
    title: "BCM",
    dataIndex: "BCM",
    key: "BCM",
  },
  {
    title: "MBC",
    dataIndex: "MBC",
    key: "MBC",
  },
  {
    title: "MBCDNC",
    dataIndex: "MBCDNC",
    key: "MBCDNC",
  },
  {
    title: "MBCV",
    dataIndex: "MBCV",
    key: "MBCV",
  },
  {
    title: "SC",
    dataIndex: "SC",
    key: "SC",
  },
  {
    title: "SCA",
    dataIndex: "SCA",
    key: "SCA",
  },
  {
    title: "ST",
    dataIndex: "ST",
    key: "ST",
  },
];

const App = () => {
  const [fColleges, setFColleges] = useState(colleges);
  const [filters, setFilters] = useState(initialFilter);

  const filterSlider = useCallback(
    (col, name) => {
      const filter = filters[name];
      return filter?.length && filter.filter(Boolean)?.length
        ? col?.[name] && col?.[name]?.between(...filter)
        : true;
    },
    [filters]
  );

  useEffect(() => {
    try {
      const filtered = colleges.filter((col) => {
        try {
          return (
            col.con.toLowerCase().includes(filters.con.toLowerCase()) &&
            col.coc.toString().includes(filters.coc.toLowerCase()) &&
            (filters?.brc ? filters?.brc?.includes(col.brc) : true) &&
            filterSlider(col, "OC") &&
            filterSlider(col, "BC") &&
            filterSlider(col, "BCM") &&
            filterSlider(col, "MBC") &&
            filterSlider(col, "MBCDNC") &&
            filterSlider(col, "MBCV") &&
            filterSlider(col, "SC") &&
            filterSlider(col, "SCA") &&
            filterSlider(col, "ST")
          );
        } catch (err) {
          console.log("filtered-err", col, err.message);
          return true;
        }
      });
      setFColleges(filtered);
    } catch (err) {
      console.log("err", err);
    }
  }, [filters, filterSlider]);

  const onFilter = (name) => (evt) => {
    const value = evt?.target?.value ?? (evt?.length ? evt : "");
    setFilters((prevFilter) => ({ ...prevFilter, [name]: value }));
  };


  const resetSlider = (name) => (evt) => {
    setFilters((prevFilter) => ({ ...prevFilter, [name]: [0, 0] }));
  };

  const filterMultiSelectOption = (input, option) =>
    option.children.toLowerCase().includes(input.toLowerCase());

  const resetFilter = () => setFilters(initialFilter);

  const renderInput = (name, label) => (
    <>
      <span>{label}</span>
      <Input onChange={onFilter(name)} value={filters[name]} />
    </>
  );

  const renderResetFilter = () => (
    <Button type="primary" danger onClick={resetFilter}>
      Reset filter
    </Button>
  );

  const renderMultiSelect = (name, label, opts) => {
    return (
      <>
        <span>{label}</span>
        <Select
          showSearch
          mode="multiple"
          autoClearSearchValue={true}
          placeholder="Please select"
          onChange={onFilter(name)}
          value={filters[name] || []}
          className="w-100"
          filterOption={filterMultiSelectOption}
        >
          {opts.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      </>
    );
  };

  const renderSlider = (name, label) => (
    <div className="slider-wrapper">
      <span>
        {label} - Between <b>{filters[name]?.join(" - ")}</b>
      </span>
      <div className="slider">
        <Slider
          step={1}
          min={0}
          max={200}
          value={filters[name]}
          onChange={onFilter(name)}
          range={{ draggableTrack: true }}
        />
      </div>
      <Button
        danger
        size="small"
        type="primary"
        shape="circle"
        icon={<CloseOutlined />}
        onClick={resetSlider(name)}
      />
    </div>
  );

  const renderSearch = () => {
    return (
      <>
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} sm={24} md={12} lg={8} xl={6}>
            {renderInput("con", "College Name")}
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={6}>
            {renderInput("coc", "College code")}
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={6}>
            {renderMultiSelect("brc", "Branch Name(s)  ", branchCodes)}
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={6}>
            {renderResetFilter()}
          </Col>
        </Row>
        <div className="my-4">
          {communityCodes.map((comm) => renderSlider(comm, comm))}
        </div>
      </>
    );
  };
  return (
    <>
      <h2 className="text-center">TNEA 2021 Cut-Off</h2>
      {renderSearch()}
      <Table
        size="small"
        rowKey="_id"
        columns={columns}
        pagination={{
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          position: ["topRight", "bottomRight"],
        }}
        scroll={{
          x: 1300,
        }}
        dataSource={fColleges}
      />
    </>
  );
};

export default App;
