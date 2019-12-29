"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = _interopRequireDefault(require("lodash"));

var _reactChartjs = require("react-chartjs-2");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var formatNumber = function formatNumber(number) {
  var toFix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  if (number < 0) {
    return '-' + formatNumber(-number, toFix);
  }

  if (number > 1000000000) {
    return (number / 1000000000).toFixed(toFix);
  }

  if (number > 1000000) {
    return (number / 1000000).toFixed(toFix);
  }

  if (number > 1000) {
    return (number / 1000).toFixed(toFix);
  }

  return number;
};

var genDataSetAndAttributes = function genDataSetAndAttributes(attribute, data) {
  return _objectSpread({
    fill: false,
    lineTension: 0,
    borderWidth: 2,
    pointRadius: 3,
    pointHoverRadius: 5,
    data: data.map(function (d) {
      return _lodash["default"].get(d, attribute.attr);
    }),
    all: data
  }, attribute);
};

var RevenuesChart =
/*#__PURE__*/
function (_React$Component) {
  _inherits(RevenuesChart, _React$Component);

  function RevenuesChart() {
    _classCallCheck(this, RevenuesChart);

    return _possibleConstructorReturn(this, _getPrototypeOf(RevenuesChart).apply(this, arguments));
  }

  _createClass(RevenuesChart, [{
    key: "render",
    value: function render() {
      var initialData = this.props.data;
      if (!initialData || !initialData.length) return null;
      var unit = initialData && initialData[0].unit;
      var attributes = [{
        backgroundColor: '#368BC1',
        borderColor: '#368BC1',
        attr: 'rev',
        label: "Revenue Quarterly (".concat(unit, ")")
      }];
      var data = {
        labels: initialData.map(function (d) {
          return d.reportDate;
        }),
        datasets: attributes.map(function (attr) {
          return genDataSetAndAttributes(attr, initialData);
        })
      };
      var min = _lodash["default"].get(data, 'datasets.0.data', []).reduce(function (t, d) {
        return Math.min(t, d);
      }, 9999999999999999) / 2;
      var options = {
        legend: {
          labels: {
            fontSize: 14,
            boxWidth: 10
          }
        },
        tooltips: {
          callbacks: {
            label: function label(tooltipItem, data) {
              var info = data.datasets[tooltipItem.datasetIndex];
              var reportDate = info.all[tooltipItem.datasetIndex].reportDate;
              var unit = info.all[tooltipItem.datasetIndex].unit;
              var label = "".concat(reportDate, " ").concat(info.label, ": ");
              label += tooltipItem.yLabel || 'n/a';
              label += " ".concat(unit);
              return label;
            }
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: false,
              fontSize: 12
            },
            barPercentage: 0.4
          }],
          yAxes: [{
            ticks: {
              callback: function callback(label, index, labels) {
                return formatNumber(label, 0);
              },
              min: min,
              fontSize: 12
            }
          }]
        }
      };
      return _react["default"].createElement("div", {
        style: {
          width: '100%'
        }
      }, _react["default"].createElement(_reactChartjs.Bar, {
        data: data,
        height: 180,
        options: options
      }));
    }
  }]);

  return RevenuesChart;
}(_react["default"].Component);

var _default = RevenuesChart;
exports["default"] = _default;