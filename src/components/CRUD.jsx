import Axios from "axios";
import React, { useState, useEffect } from "react";
import {
  DateInput,
  DateTimeInput,
  TimeInput,
} from "semantic-ui-calendar-react";
import { Select } from "semantic-ui-react";
import { Button, Icon } from "semantic-ui-react";
import { Pagination } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Dimmer, Loader } from "semantic-ui-react";
import Swal from "sweetalert2";

//props Lists
//entity,hidePrimary
const CRUD_Path = "https://127.0.0.1:8000/rest/CRUD/"; //"/rest/CRUD/";
const FailOverData = {
  data: [
    {
      id: 91,
      termname: "foo/1",
    },
    {
      id: 92,
      termname: "bar/2",
    },
  ],
  fields: [
    {
      fieldName: "id",
      type: "integer",
    },
    {
      fieldName: "termname",
      type: "string",
    },
  ],
  primaryKey: "id",
  options: [],
};

function CRUD(props) {
  const [Mode, setMode] = useState("select");
  const [Loading, setLoading] = useState(false);
  const [Saving, setSaving] = useState(false);
  const [Page, setPage] = useState(1);
  const [PageSize, setPageSize] = useState(props.pageSize);
  const [Data, setData] = useState([]);
  const [Fields, setFields] = useState([]);
  const [PrimaryKey, setPrimaryKey] = useState([]);
  const [Options, setOptions] = useState([]);
  const [PagesCount, setPagesCount] = useState(0);
  const [SelectedX, setSelectedX] = useState(null);
  const [SelectedRecord, setSelectedRecord] = useState(null);
  const [SearchKey, setSearchKey] = useState("");
  const [OrderBy, setOrderBy] = useState(props.orderBy);

  useEffect(() => {
    LoadData();
    return () => {
      // cleanup;
    };
  }, [props.entity]);

  function LoadData(page = 1) {
    console.log("LoadData");
    if (props.entity) {
      setLoading(true);
      const data = {
        entity: props.entity,
        mode: Mode,
        page: page,
        pageSize: PageSize,
        searchKey: SearchKey,
        searchFields: props.searchFields,
        orderBy: OrderBy,
      };
      Axios.post(CRUD_Path, data)
        .then((res) => {
          console.log("postCRUD res.data:", res.data);
          setData(res.data.data);
          setFields(res.data.fields);
          setPrimaryKey(res.data.primaryKey);
          setOptions(res.data.options);
          setPagesCount(res.data.pagesCount);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setData(FailOverData.data);
          setFields(FailOverData.fields);
          setPrimaryKey(FailOverData.primaryKey);
          setOptions(FailOverData.options);
          setPagesCount(FailOverData.pagesCount);
          setLoading(false);
        });
    }
  }

  function HandleNew() {
    console.log("HandleNew");
    let emptyRec = Fields.reduce(function(acc, curr) {
      acc[curr.fieldName] = "";
      return acc;
    }, {});
    console.log("emptyRec", emptyRec);
    setSelectedX(null);
    setSelectedRecord(emptyRec);
    setMode("new");
  }
  function HandleEdit(x) {
    console.log("HandleEdit", x, Data[x]);
    setSelectedX(x);
    setSelectedRecord(Data[x]);
    setMode("update");
  }
  function HandleChange(e, type) {
    console.log("HandleChange", e, type);
    if (type === "checkbox") {
      setSelectedRecord({ ...SelectedRecord, [e.target.id]: e.target.checked });
    } else {
      setSelectedRecord({ ...SelectedRecord, [e.target.id]: e.target.value });
    }
    console.log("SelectedRecord", SelectedRecord);
  }
  function HandleChangeSelect(e, data) {
    console.log("HandleChangeSelect", data.name, data.value, SelectedRecord);
    setSelectedRecord({ ...SelectedRecord, [data.name]: data.value });
    // let Copy = { ...SelectedRecord };
    // Copy[data.name] = data.value;
    // setSelectedRecord(Copy);
    console.log("SelectedRecord", SelectedRecord);
  }
  function HandleChangeDateTime(event, { name, value }) {
    console.log("HandleChangeDateTime", name, value);
    setSelectedRecord({ ...SelectedRecord, [name]: value });
    // if (SelectedRecord.hasOwnProperty(name)) {
    //   let Copy = { ...SelectedRecord };
    //   Copy[name] = value;
    //   setSelectedRecord(Copy);
    // }
  }
  function HandleSave() {
    console.log("HandleSave");
    setSaving(true);
    const data = {
      entity: props.entity,
      mode: Mode,
      record: SelectedRecord,
    };
    Axios.post(CRUD_Path, data)
      .then((res) => {
        console.log("postCRUD res.data:", res.data);
        // this.setState({ data: res.data.data, fields: res.data.fields });
        if (res.data.split(":")[0] === "Success") {
          if (Mode === "update") {
            let Copy = Data;
            Copy[SelectedX] = SelectedRecord;
            setData(Copy);
            setSaving(false);
          } else if (Mode === "new") {
            let Copy = { ...SelectedRecord };
            Copy[PrimaryKey] = res.data.split(":")[1];
            let Cur = Data;
            Cur.splice(Cur.length, 0, Copy);
            setData(Cur);
            setSaving(false);
          }
          Swal.fire("crud", "The record is saved", "success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function HandleDelete() {
    console.log("HandleDelete");
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const data = {
          entity: props.entity,
          mode: "delete",
          record: SelectedRecord,
        };
        Axios.post(CRUD_Path, data)
          .then((res) => {
            console.log("postCRUD res.data:", res.data);
            // this.setState({ data: res.data.data, fields: res.data.fields });
            if (res.data.split(":")[0] === "Success") {
              let Copy = Data;
              Copy.splice(SelectedX, 1);
              setData(Copy);
              setSelectedX(null);
              setMode("select");
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
  function HandleBack() {
    console.log("HandleBack");
    setMode("select");
  }
  function HandlePaginationChange(e, { activePage }) {
    console.log("activePage", activePage);
    setPage(activePage);
    LoadData(activePage);
  }
  function HandleSearchInputChange(e, data) {
    // console.log("HandleSearchInputChange", data);
    this.setState({ [data.name]: data.value });
  }
  function HandleSearchInputkeyPress(e) {
    console.log("HandleSearchInputkeyPress", e.keyCode);
    if (e.keyCode === 13) {
      console.log("ENTER.");
      setPage(1);
      LoadData(1);
    }
  }
  function HandleSearch(e) {
    LoadData(1);
  }

  return Mode === "select" ? (
    <Show
      entity={props.entity}
      primaryKey={PrimaryKey}
      fields={Fields}
      data={Data}
      options={Options}
      HandleEdit={HandleEdit}
      HandleNew={HandleNew}
      loading={Loading}
      page={Page}
      pagesCount={PagesCount}
      handlePaginationChange={HandlePaginationChange}
      searchFields={props.searchFields}
      HandleSearchInputChange={HandleSearchInputChange}
      HandleSearchInputkeyPress={HandleSearchInputkeyPress}
      HandleSearch={HandleSearch}
    />
  ) : Mode === "new" || Mode === "update" ? (
    <Form
      mode={Mode}
      entity={props.entity}
      primaryKey={PrimaryKey}
      options={Options}
      fields={Fields}
      data={Data}
      record={SelectedRecord}
      saving={Saving}
      HandleChange={HandleChange}
      HandleChangeDateTime={HandleChangeDateTime}
      HandleChangeSelect={HandleChangeSelect}
      HandleSave={HandleSave}
      HandleBack={HandleBack}
      HandleDelete={HandleDelete}
    />
  ) : null;
}

export default CRUD;

const Show = (props) => {
  return (
    <div className="container-fluid mt-1">
      <div className="row">
        <div id="main" className="col-sm-9 mt-2">
          <Header title={props.entity} />
          <div className="messages"></div>
        </div>
        <div id="main" className="col-sm-3 text-end">
          <Button
            icon
            color="green"
            size="small"
            onClick={(e) => props.HandleNew()}
          >
            <Icon name="plus" /> new {props.entity}
          </Button>
        </div>
      </div>
      <div className="row">
        <div id="main" className="col-sm-12">
          <div className="table-responsive">
            {props.searchFields ? (
              <Input
                size="mini"
                name="searchKey"
                icon={
                  <Icon
                    name="search"
                    inverted
                    circular
                    link
                    onClick={props.HandleSearch}
                  />
                }
                placeholder="Search..."
                value={props.searchKey}
                onChange={props.HandleSearchInputChange}
                onKeyDown={props.HandleSearchInputkeyPress}
              />
            ) : null}
            <Pagination
              size="mini"
              boundaryRange={3}
              // defaultActivePage={1}
              activePage={props.page}
              ellipsisItem={false}
              firstItem={false}
              lastItem={false}
              siblingRange={1}
              totalPages={props.pagesCount || 1}
              onPageChange={props.handlePaginationChange}
            />
            <table className="table table-striped table-middle-aligned">
              <TableHeader
                fields={props.fields}
                primaryKey={props.primaryKey}
              />
              <tbody>
                {props.loading ? (
                  <tr>
                    <td>
                      <Dimmer active>
                        <Loader content="Loading" />
                      </Dimmer>
                    </td>
                  </tr>
                ) : (
                  <TableData
                    fields={props.fields}
                    primaryKey={props.primaryKey}
                    data={props.data}
                    options={props.options}
                    HandleEdit={props.HandleEdit}
                  />
                )}
              </tbody>
            </table>

            <Pagination
              size="mini"
              boundaryRange={3}
              // defaultActivePage={1}
              activePage={props.page}
              ellipsisItem={false}
              firstItem={false}
              lastItem={false}
              siblingRange={1}
              totalPages={props.pagesCount}
              onPageChange={props.handlePaginationChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
const Header = (props) => {
  return <h1>{props.title}</h1>;
};
const TableHeader = (props) => {
  return (
    <thead className="thead-dark">
      <tr>
        {props.fields
          ? props.fields
              .filter((f) => f.fieldName != props.primaryKey)
              .map((field, x) => (
                <th scope="col" key={"tableheader" + x}>
                  {field.fieldName}
                </th>
              ))
          : null}
        <th className="text-end">Action</th>
      </tr>
    </thead>
  );
};
const TableData = (props) => {
  console.log("props.options>>", props.options);
  return props.data
    ? props.data.map((dat, x) => (
        <tr key={"tablebodyrow" + x}>
          {props.fields
            ? props.fields
                .filter((f) => f.fieldName !== props.primaryKey)
                .map((field, y) => (
                  <td key={"tablebodyrowfield" + x + "/" + y}>
                    {field.type === "boolean"
                      ? dat[field.fieldName]
                        ? "true"
                        : "false"
                      : field.type.split(":")[0] === "ManyToOne"
                      ? dat[field.fieldName]
                        ? props.options[field.type.split(":")[1]].filter(
                            (option) => {
                              return option.key === dat[field.fieldName];
                            }
                          )[0].text
                        : "-"
                      : dat[field.fieldName]}
                  </td>
                ))
            : null}

          <td className="text-end">
            <div className="item-actions">
              <Button
                icon
                color="blue"
                size="mini"
                onClick={(e) => props.HandleEdit(x)}
              >
                <Icon name="edit" /> Edit
              </Button>
            </div>
          </td>
        </tr>
      ))
    : null;
};
const Form = (props) => {
  let TitleHead =
    props.mode === "update" ? "Edit " : props.mode === "new" ? "New " : null;
  return (
    <div className="container body-container p-3">
      <div className="row">
        <div id="main" className="col-sm-9">
          <Header title={TitleHead + props.entity} />
          <div className="messages"></div>
        </div>
        <div id="main" className="col-sm-3 text-end">
          {props.mode === "update" ? (
            <Button
              icon
              color="red"
              size="small"
              onClick={(e) => props.HandleDelete()}
            >
              <Icon name="delete" /> delete
            </Button>
          ) : null}
        </div>
      </div>
      <div className="row">
        <div id="main" className="col-sm-12">
          {props.fields
            ? props.fields
                .filter((f) => f.fieldName !== props.primaryKey)
                .map((field, x) => {
                  const option =
                    field.type.split(":")[0] === "ManyToOne"
                      ? props.options[field.type.split(":")[1]]
                      : "";
                  console.log("Value::", props.record[field.fieldName]);
                  return (
                    <FormItem
                      mode={props.mode}
                      field={field}
                      option={option}
                      key={"FormItem" + x}
                      record={props.record}
                      value={props.record[field.fieldName]}
                      HandleChange={props.HandleChange}
                      HandleChangeDateTime={props.HandleChangeDateTime}
                      HandleChangeSelect={props.HandleChangeSelect}
                    />
                  );
                })
            : null}
          <Button
            icon
            color="grey"
            size="small"
            onClick={(e) => props.HandleBack()}
          >
            <Icon name="angle left" /> back to list
          </Button>
          <Button
            icon
            color="green"
            size="small"
            onClick={(e) => props.HandleSave()}
            className={props.saving ? "loading" : ""}
          >
            <Icon name="save outline" /> save
          </Button>
        </div>
      </div>
    </div>
  );
};
const FormItem = (props) => {
  return props.field.type === "string" ? (
    <div className="form-group">
      <label className="control-label required" htmlFor={props.field.fieldName}>
        {props.field.fieldName}
      </label>
      <input
        type="text"
        id={props.field.fieldName}
        // required="required"
        // autofocus="autofocus"
        className="form-control"
        value={props.record[props.field.fieldName]}
        onChange={(e) => props.HandleChange(e)}
      />
      {/* <span id="post_summary_help" className="help-block">
        Summaries can't contain Markdown or HTML contents; only plain text.
      </span> */}
    </div>
  ) : props.field.type == "text" ? (
    <div className="form-group">
      <label className="control-label required" htmlFor={props.field.fieldName}>
        {props.field.fieldName}
      </label>
      <textarea
        type="text"
        id={props.field.fieldName}
        className="form-control"
        value={props.record[props.field.fieldName]}
        onChange={(e) => props.HandleChange(e)}
      />
    </div>
  ) : props.field.type == "boolean" ? (
    <div className="custom-control custom-checkbox ">
      <input
        type="checkbox"
        className="custom-control-input"
        id={props.field.fieldName}
        checked={props.record[props.field.fieldName]}
        onChange={(e) => props.HandleChange(e, "checkbox")}
      />
      <label className="custom-control-label" htmlFor={props.field.fieldName}>
        {props.field.fieldName}
      </label>
    </div>
  ) : props.field.type == "integer" ||
    props.field.type == "smallint" ||
    props.field.type == "bigint" ||
    props.field.type == "float" ||
    props.field.type == "decimal" ? (
    <div className="form-group">
      <label className="control-label required" htmlFor={props.field.fieldName}>
        {props.field.fieldName}
      </label>
      <input
        type="number"
        id={props.field.fieldName}
        className="form-control"
        value={props.record[props.field.fieldName]}
        onChange={(e) => props.HandleChange(e)}
      />
    </div>
  ) : props.field.type == "datetime" ? (
    <div>
      <label className="control-label required" htmlFor={props.field.fieldName}>
        {props.field.fieldName}
      </label>
      <DateTimeInput
        name={props.field.fieldName}
        placeholder="Date Time"
        value={props.record[props.field.fieldName]}
        iconPosition="left"
        onChange={props.HandleChangeDateTime}
        clearable={true}
      />
    </div>
  ) : props.field.type == "date" ? (
    <div>
      <label className="control-label required" htmlFor={props.field.fieldName}>
        {props.field.fieldName}
      </label>
      <DateInput
        name={props.field.fieldName}
        placeholder="Date"
        value={props.record[props.field.fieldName]}
        iconPosition="left"
        onChange={props.HandleChangeDateTime}
        clearable={true}
      />
    </div>
  ) : props.field.type == "time" ? (
    <div>
      <label className="control-label required" htmlFor={props.field.fieldName}>
        {props.field.fieldName}
      </label>
      <TimeInput
        name={props.field.fieldName}
        placeholder="Time"
        value={props.record[props.field.fieldName]}
        iconPosition="left"
        onChange={props.HandleChangeDateTime}
        clearable={true}
      />
    </div>
  ) : props.field.type == "json" ? (
    <div className="form-group">
      <label className="control-label required" htmlFor={props.field.fieldName}>
        {props.field.fieldName}
      </label>
      <textarea
        type="text"
        id={props.field.fieldName}
        className="form-control"
        value={props.record[props.field.fieldName]}
        onChange={(e) => props.HandleChange(e)}
      />
    </div>
  ) : props.field.type.split(":")[0] == "ManyToOne" ? (
    <div>
      {console.log("props.record[props.field.fieldName]", props.value)}
      <Select
        name={props.field.fieldName}
        placeholder={props.field.fieldName}
        options={props.option}
        value={props.value}
        onChange={props.HandleChangeSelect}
      />
    </div>
  ) : (
    <div>no match</div>
  );
};
