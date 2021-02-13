import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { DateTimeInput, DateInput, TimeInput } from 'semantic-ui-calendar-react';
import { Button, Icon, Input, Pagination, Dimmer, Loader, Select } from 'semantic-ui-react';
import Swal from 'sweetalert2';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

//entity,hidePrimary

var CRUD_Path = "https://127.0.0.1:8000/rest/CRUD/"; //"/rest/CRUD/";

var FailOverData = {
  data: [{
    id: 91,
    termname: "foo/1"
  }, {
    id: 92,
    termname: "bar/2"
  }],
  fields: [{
    fieldName: "id",
    type: "integer"
  }, {
    fieldName: "termname",
    type: "string"
  }],
  primaryKey: "id",
  options: []
};

function CRUD(props) {
  var _useState = useState("select"),
      _useState2 = _slicedToArray(_useState, 2),
      Mode = _useState2[0],
      setMode = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      Loading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      Saving = _useState6[0],
      setSaving = _useState6[1];

  var _useState7 = useState(1),
      _useState8 = _slicedToArray(_useState7, 2),
      Page = _useState8[0],
      setPage = _useState8[1];

  var _useState9 = useState(props.pageSize),
      _useState10 = _slicedToArray(_useState9, 2),
      PageSize = _useState10[0],
      setPageSize = _useState10[1];

  var _useState11 = useState([]),
      _useState12 = _slicedToArray(_useState11, 2),
      Data = _useState12[0],
      setData = _useState12[1];

  var _useState13 = useState([]),
      _useState14 = _slicedToArray(_useState13, 2),
      Fields = _useState14[0],
      setFields = _useState14[1];

  var _useState15 = useState([]),
      _useState16 = _slicedToArray(_useState15, 2),
      PrimaryKey = _useState16[0],
      setPrimaryKey = _useState16[1];

  var _useState17 = useState([]),
      _useState18 = _slicedToArray(_useState17, 2),
      Options = _useState18[0],
      setOptions = _useState18[1];

  var _useState19 = useState(0),
      _useState20 = _slicedToArray(_useState19, 2),
      PagesCount = _useState20[0],
      setPagesCount = _useState20[1];

  var _useState21 = useState(null),
      _useState22 = _slicedToArray(_useState21, 2),
      SelectedX = _useState22[0],
      setSelectedX = _useState22[1];

  var _useState23 = useState(null),
      _useState24 = _slicedToArray(_useState23, 2),
      SelectedRecord = _useState24[0],
      setSelectedRecord = _useState24[1];

  var _useState25 = useState(""),
      _useState26 = _slicedToArray(_useState25, 2),
      SearchKey = _useState26[0],
      setSearchKey = _useState26[1];

  var _useState27 = useState(props.orderBy),
      _useState28 = _slicedToArray(_useState27, 2),
      OrderBy = _useState28[0],
      setOrderBy = _useState28[1];

  useEffect(function () {
    LoadData();
    return function () {// cleanup;
    };
  }, [props.entity]);

  function LoadData() {
    var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    console.log("LoadData");

    if (props.entity) {
      setLoading(true);
      var data = {
        entity: props.entity,
        mode: Mode,
        page: page,
        pageSize: PageSize,
        searchKey: SearchKey,
        searchFields: props.searchFields,
        orderBy: OrderBy
      };
      Axios.post(CRUD_Path, data).then(function (res) {
        console.log("postCRUD res.data:", res.data);
        setData(res.data.data);
        setFields(res.data.fields);
        setPrimaryKey(res.data.primaryKey);
        setOptions(res.data.options);
        setPagesCount(res.data.pagesCount);
        setLoading(false);
      }).catch(function (err) {
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
    var emptyRec = Fields.reduce(function (acc, curr) {
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
    setSelectedRecord(_objectSpread2({}, Date[x]));
    setMode("update");
  }

  function HandleChange(e, type) {
    console.log("HandleChange", e, type);
    var Copy = SelectedRecord;

    if (type === "checkbox") {
      Copy[e.target.id] = e.target.checked;
    } else {
      Copy[e.target.id] = e.target.value;
    }

    setSelectedRecord({
      selectedRecord: Copy
    });
    console.log("SelectedRecord", SelectedRecord);
  }

  function HandleChangeSelect(e, data) {
    console.log("HandleChangeSelect", e, data);
    var Copy = SelectedRecord;
    Copy[data.name] = data.value;
    setSelectedRecord(Copy);
    console.log("SelectedRecord", SelectedRecord);
  }

  function HandleChangeDateTime(event, _ref) {
    var name = _ref.name,
        value = _ref.value;
    console.log("HandleChangeDateTime", name, value);

    if (SelectedRecord.hasOwnProperty(name)) {
      var Copy = SelectedRecord;
      Copy[name] = value;
      setSelectedRecord(Copy);
    }
  }

  function HandleSave() {
    console.log("HandleSave");
    setSaving(true);
    var data = {
      entity: props.entity,
      mode: Mode,
      record: SelectedRecord
    };
    Axios.post(CRUD_Path, data).then(function (res) {
      console.log("postCRUD res.data:", res.data); // this.setState({ data: res.data.data, fields: res.data.fields });

      if (res.data.split(":")[0] === "Success") {
        if (Mode === "update") {
          var Copy = Data;
          Copy[SelectedX] = SelectedRecord;
          setData(Copy);
          setSaving(false);
        } else if (Mode === "new") {
          var _Copy = SelectedRecord;
          _Copy[PrimaryKey] = res.data.split(":")[1];
          var Cur = Data;
          Cur.splice(Cur.length, 0, _Copy);
          setData(Cur);
          setSaving(false);
        }

        Swal.fire("crud", "The record is saved", "success");
      }
    }).catch(function (err) {
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
      confirmButtonText: "Yes, delete it!"
    }).then(function (result) {
      if (result.value) {
        var data = {
          entity: props.entity,
          mode: "delete",
          record: SelectedRecord
        };
        Axios.post(CRUD_Path, data).then(function (res) {
          console.log("postCRUD res.data:", res.data); // this.setState({ data: res.data.data, fields: res.data.fields });

          if (res.data.split(":")[0] === "Success") {
            var Copy = Data;
            Copy.splice(SelectedX, 1);
            setData(Copy);
            setSelectedX(null);
            setMode("select");
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          }
        }).catch(function (err) {
          console.log(err);
        });
      }
    });
  }

  function HandleBack() {
    console.log("HandleBack");
    setMode("select");
  }

  function HandlePaginationChange(e, _ref2) {
    var activePage = _ref2.activePage;
    console.log("activePage", activePage);
    setPage(activePage);
    LoadData(activePage);
  }

  function HandleSearchInputChange(e, data) {
    // console.log("HandleSearchInputChange", data);
    this.setState(_defineProperty({}, data.name, data.value));
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

  return Mode === "select" ? /*#__PURE__*/React.createElement(Show, {
    entity: props.entity,
    primaryKey: PrimaryKey,
    fields: Fields,
    data: Data,
    options: Options,
    HandleEdit: HandleEdit,
    HandleNew: HandleNew,
    loading: Loading,
    page: Page,
    pagesCount: PagesCount,
    handlePaginationChange: HandlePaginationChange,
    searchFields: props.searchFields,
    HandleSearchInputChange: HandleSearchInputChange,
    HandleSearchInputkeyPress: HandleSearchInputkeyPress,
    HandleSearch: HandleSearch
  }) : Mode === "new" || Mode === "update" ? /*#__PURE__*/React.createElement(Form, {
    mode: Mode,
    entity: props.entity,
    primaryKey: PrimaryKey,
    options: Options,
    fields: Fields,
    data: Data,
    record: SelectedRecord,
    saving: Saving,
    HandleChange: HandleChange,
    HandleChangeDateTime: HandleChangeDateTime,
    HandleChangeSelect: HandleChangeSelect,
    HandleSave: HandleSave,
    HandleBack: HandleBack,
    HandleDelete: HandleDelete
  }) : null;
}

var Show = function Show(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    id: "main",
    className: "col-sm-9 mt-2"
  }, /*#__PURE__*/React.createElement(Header, {
    title: props.entity
  }), /*#__PURE__*/React.createElement("div", {
    className: "messages"
  })), /*#__PURE__*/React.createElement("div", {
    id: "main",
    className: "col-sm-3 text-right"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: true,
    color: "green",
    size: "small",
    onClick: function onClick(e) {
      return props.HandleNew();
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }), " new ", props.entity))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    id: "main",
    className: "col-sm-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, props.searchFields ? /*#__PURE__*/React.createElement(Input, {
    size: "mini",
    name: "searchKey",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      inverted: true,
      circular: true,
      link: true,
      onClick: props.HandleSearch
    }),
    placeholder: "Search...",
    value: props.searchKey,
    onChange: props.HandleSearchInputChange,
    onKeyDown: props.HandleSearchInputkeyPress
  }) : null, /*#__PURE__*/React.createElement(Pagination, {
    size: "mini",
    boundaryRange: 3 // defaultActivePage={1}
    ,
    activePage: props.page,
    ellipsisItem: false,
    firstItem: false,
    lastItem: false,
    siblingRange: 1,
    totalPages: props.pagesCount || 1,
    onPageChange: props.handlePaginationChange
  }), /*#__PURE__*/React.createElement("table", {
    className: "table table-striped table-middle-aligned"
  }, /*#__PURE__*/React.createElement(TableHeader, {
    fields: props.fields,
    primaryKey: props.primaryKey
  }), /*#__PURE__*/React.createElement("tbody", null, props.loading ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Dimmer, {
    active: true
  }, /*#__PURE__*/React.createElement(Loader, {
    content: "Loading"
  })))) : /*#__PURE__*/React.createElement(TableData, {
    fields: props.fields,
    primaryKey: props.primaryKey,
    data: props.data,
    options: props.options,
    HandleEdit: props.HandleEdit
  }))), /*#__PURE__*/React.createElement(Pagination, {
    size: "mini",
    boundaryRange: 3 // defaultActivePage={1}
    ,
    activePage: props.page,
    ellipsisItem: false,
    firstItem: false,
    lastItem: false,
    siblingRange: 1,
    totalPages: props.pagesCount,
    onPageChange: props.handlePaginationChange
  })))));
};

var Header = function Header(props) {
  return /*#__PURE__*/React.createElement("h1", null, props.title);
};

var TableHeader = function TableHeader(props) {
  return /*#__PURE__*/React.createElement("thead", {
    className: "thead-dark"
  }, /*#__PURE__*/React.createElement("tr", null, props.fields ? props.fields.filter(function (f) {
    return f.fieldName != props.primaryKey;
  }).map(function (field, x) {
    return /*#__PURE__*/React.createElement("th", {
      scope: "col",
      key: "tableheader" + x
    }, field.fieldName);
  }) : null, /*#__PURE__*/React.createElement("th", {
    className: "text-right"
  }, "Action")));
};

var TableData = function TableData(props) {
  console.log("props.options>>", props.options);
  return props.data ? props.data.map(function (dat, x) {
    return /*#__PURE__*/React.createElement("tr", {
      key: "tablebodyrow" + x
    }, props.fields ? props.fields.filter(function (f) {
      return f.fieldName !== props.primaryKey;
    }).map(function (field, y) {
      return /*#__PURE__*/React.createElement("td", {
        key: "tablebodyrowfield" + x + "" + y
      }, field.type === "boolean" ? dat[field.fieldName] ? "true" : "false" : field.type.split(":")[0] === "ManyToOne" ? dat[field.fieldName] ? props.options[field.type.split(":")[1]].filter(function (option) {
        return option.key === dat[field.fieldName];
      })[0].text : "-" : dat[field.fieldName]);
    }) : null, /*#__PURE__*/React.createElement("td", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("div", {
      className: "item-actions"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: true,
      color: "blue",
      size: "mini",
      onClick: function onClick(e) {
        return props.HandleEdit(x);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit"
    }), " Edit"))));
  }) : null;
};

var Form = function Form(props) {
  var TitleHead = props.mode === "update" ? "Edit " : props.mode === "new" ? "New " : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "container body-container p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    id: "main",
    className: "col-sm-9"
  }, /*#__PURE__*/React.createElement(Header, {
    title: TitleHead + props.entity
  }), /*#__PURE__*/React.createElement("div", {
    className: "messages"
  })), /*#__PURE__*/React.createElement("div", {
    id: "main",
    className: "col-sm-3 text-right"
  }, props.mode === "update" ? /*#__PURE__*/React.createElement(Button, {
    icon: true,
    color: "red",
    size: "small",
    onClick: function onClick(e) {
      return props.HandleDelete();
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "delete"
  }), " delete") : null)), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    id: "main",
    className: "col-sm-12"
  }, props.fields ? props.fields.filter(function (f) {
    return f.fieldName !== props.primaryKey;
  }).map(function (field, x) {
    var option = field.type.split(":")[0] === "ManyToOne" ? props.options[field.type.split(":")[1]] : "";
    return /*#__PURE__*/React.createElement(FormItem, {
      mode: props.mode,
      field: field,
      option: option,
      key: "FormItem" + x,
      record: props.record,
      HandleChange: props.HandleChange,
      HandleChangeDateTime: props.HandleChangeDateTime,
      HandleChangeSelect: props.HandleChangeSelect
    });
  }) : null, /*#__PURE__*/React.createElement(Button, {
    icon: true,
    color: "grey",
    size: "small",
    onClick: function onClick(e) {
      return props.HandleBack();
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "angle left"
  }), " back to list"), /*#__PURE__*/React.createElement(Button, {
    icon: true,
    color: "green",
    size: "small",
    onClick: function onClick(e) {
      return props.HandleSave();
    },
    className: props.saving ? "loading" : ""
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "save outline"
  }), " save"))));
};

var FormItem = function FormItem(props) {
  return props.field.type === "string" ? /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "control-label required",
    htmlFor: props.field.fieldName
  }, props.field.fieldName), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: props.field.fieldName // required="required"
    // autofocus="autofocus"
    ,
    className: "form-control",
    value: props.record[props.field.fieldName],
    onChange: function onChange(e) {
      return props.HandleChange(e);
    }
  })) : props.field.type == "text" ? /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "control-label required",
    htmlFor: props.field.fieldName
  }, props.field.fieldName), /*#__PURE__*/React.createElement("textarea", {
    type: "text",
    id: props.field.fieldName,
    className: "form-control",
    value: props.record[props.field.fieldName],
    onChange: function onChange(e) {
      return props.HandleChange(e);
    }
  })) : props.field.type == "boolean" ? /*#__PURE__*/React.createElement("div", {
    className: "custom-control custom-checkbox "
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    className: "custom-control-input",
    id: props.field.fieldName,
    checked: props.record[props.field.fieldName],
    onChange: function onChange(e) {
      return props.HandleChange(e, "checkbox");
    }
  }), /*#__PURE__*/React.createElement("label", {
    className: "custom-control-label",
    htmlFor: props.field.fieldName
  }, props.field.fieldName)) : props.field.type == "integer" || props.field.type == "smallint" || props.field.type == "bigint" || props.field.type == "float" || props.field.type == "decimal" ? /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "control-label required",
    htmlFor: props.field.fieldName
  }, props.field.fieldName), /*#__PURE__*/React.createElement("input", {
    type: "number",
    id: props.field.fieldName,
    className: "form-control",
    value: props.record[props.field.fieldName],
    onChange: function onChange(e) {
      return props.HandleChange(e);
    }
  })) : props.field.type == "datetime" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "control-label required",
    htmlFor: props.field.fieldName
  }, props.field.fieldName), /*#__PURE__*/React.createElement(DateTimeInput, {
    name: props.field.fieldName,
    placeholder: "Date Time",
    value: props.record[props.field.fieldName],
    iconPosition: "left",
    onChange: props.HandleChangeDateTime,
    clearable: true
  })) : props.field.type == "date" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "control-label required",
    htmlFor: props.field.fieldName
  }, props.field.fieldName), /*#__PURE__*/React.createElement(DateInput, {
    name: props.field.fieldName,
    placeholder: "Date",
    value: props.record[props.field.fieldName],
    iconPosition: "left",
    onChange: props.HandleChangeDateTime,
    clearable: true
  })) : props.field.type == "time" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "control-label required",
    htmlFor: props.field.fieldName
  }, props.field.fieldName), /*#__PURE__*/React.createElement(TimeInput, {
    name: props.field.fieldName,
    placeholder: "Time",
    value: props.record[props.field.fieldName],
    iconPosition: "left",
    onChange: props.HandleChangeDateTime,
    clearable: true
  })) : props.field.type == "json" ? /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "control-label required",
    htmlFor: props.field.fieldName
  }, props.field.fieldName), /*#__PURE__*/React.createElement("textarea", {
    type: "text",
    id: props.field.fieldName,
    className: "form-control",
    value: props.record[props.field.fieldName],
    onChange: function onChange(e) {
      return props.HandleChange(e);
    }
  })) : props.field.type.split(":")[0] == "ManyToOne" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Select, {
    name: props.field.fieldName,
    placeholder: props.field.fieldName,
    options: props.option,
    value: props.record[props.field.fieldName],
    onChange: props.HandleChangeSelect
  })) : /*#__PURE__*/React.createElement("div", null, "no match");
};

export { CRUD };
