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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var normalize = function normalize(data) {
  var divider = 1000;
  var unit = 'thousands';
  var u = 'k';
  if (!data || !data.length) return {
    data: []
  };

  if (data[0] > 10000000) {
    divider = 1000000;
    unit = 'milllion';
    u = 'm';
  }

  if (data[0] > 10000000000) {
    divider = 1000000000;
    unit = 'billion';
    u = 'b';
  }

  return {
    data: data.map(function (d) {
      return d / divider;
    }),
    unit: unit,
    u: u,
    divider: divider
  };
};

var MarginsChart =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MarginsChart, _React$Component);

  function MarginsChart() {
    _classCallCheck(this, MarginsChart);

    return _possibleConstructorReturn(this, _getPrototypeOf(MarginsChart).apply(this, arguments));
  }

  _createClass(MarginsChart, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          initialData = _this$props.data,
          _this$props$theme = _this$props.theme,
          theme = _this$props$theme === void 0 ? 'light' : _this$props$theme;
      if (!initialData || !initialData.length) return null;
      initialData = initialData.slice(-15);
      var fontColor = theme === 'light' ? '#222222' : '#dddddd';
      var gridColor = theme === 'light' ? 'rgba(80, 80, 80, 0.1)' : 'rgba(255, 255, 255, 0.2)';
      var dataColorGp = theme === 'light' ? 'rgba(0, 200, 0, 0.8)' : 'rgba(64, 255, 0, 0.8)';
      var dataColorOp = theme === 'light' ? 'rgba(250, 165, 0, 0.8)' : 'rgba(250, 165, 0, 0.8)';
      var dataColorNp = theme === 'light' ? 'rgba(250, 128, 114, 0.8)' : 'rgba(250, 128, 114, 0.8)';
      var dataColorRevenue = theme === 'light' ? '#368BC1' : '#368BC1';
      var attributes = [{
        backgroundColor: dataColorGp,
        borderColor: dataColorGp,
        attr: 'gpMargin',
        label: 'Gross Margin (%)'
      }, {
        backgroundColor: dataColorOp,
        borderColor: dataColorOp,
        attr: 'oiMargin',
        label: 'Operating Margin (%)'
      }, {
        backgroundColor: dataColorNp,
        borderColor: dataColorNp,
        attr: 'niMargin',
        label: 'Net Income Margin (%)'
      }, {
        backgroundColor: dataColorRevenue,
        borderColor: dataColorRevenue,
        attr: 'rev',
        id: 'revenue',
        type: 'bar',
        attachUnit: true,
        label: "Quarterly Revenue"
      }];

      var genDataSetAndAttributes = function genDataSetAndAttributes(attribute, alldata) {
        var data = alldata.map(function (d) {
          return _lodash["default"].get(d, attribute.attr);
        });
        return _objectSpread({
          yAxisID: attribute.id || 'margins',
          type: attribute.type || 'line',
          fill: false,
          lineTension: 0.3,
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 2,
          data: data,
          all: alldata
        }, attribute, {
          label: attribute.attachUnit ? "".concat(attribute.label, " (").concat(normalize(data).unit, ")") : attribute.label
        });
      };

      var data = {
        labels: initialData.map(function (d) {
          return d.reportDate;
        }),
        datasets: attributes.map(function (attr) {
          return genDataSetAndAttributes(attr, initialData);
        })
      };
      var divider = normalize(initialData.map(function (d) {
        return d.rev;
      })).divider;
      var options = {
        legend: {
          labels: {
            fontSize: 12,
            fontColor: fontColor,
            boxWidth: 10
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              fontSize: 12,
              fontColor: fontColor
            },
            gridLines: {
              color: gridColor
            },
            barPercentage: 0.4
          }],
          yAxes: [{
            type: 'linear',
            display: true,
            position: 'right',
            id: 'margins',
            gridLines: {
              color: gridColor
            },
            labels: {
              show: true
            },
            ticks: {
              fontSize: 12,
              fontColor: fontColor,
              callback: function callback(label, index, labels) {
                return label + '%';
              }
            }
          }, {
            type: 'linear',
            display: true,
            position: 'left',
            id: 'revenue',
            labels: {
              show: true
            },
            ticks: {
              fontSize: 12,
              fontColor: fontColor,
              min: 0,
              callback: function callback(label, index, labels) {
                return Math.floor(label / divider);
              }
            }
          }]
        }
      };
      return _react["default"].createElement(_reactChartjs.Bar, {
        data: data,
        height: 220,
        options: options
      });
    }
  }]);

  return MarginsChart;
}(_react["default"].Component);

var _default = MarginsChart;
exports["default"] = _default;