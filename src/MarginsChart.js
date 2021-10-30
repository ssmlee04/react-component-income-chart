import React from "react";
import _ from "lodash";
import { Bar } from 'react-chartjs-2';

const normalize = (data) => {
  let divider = 1000;
  let unit = 'thousands';
  let u = 'k';
  if (!data || !data.length) return { data: [] };
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
  return { data: data.map(d => d/divider), unit, u, divider };
};

class MarginsChart extends React.Component {
  render() {
    let { data: initialData, theme = 'light' } = this.props;
    if (!initialData || !initialData.length) return null;
    initialData = initialData.slice(-15);
    const fontColor = theme === 'light' ? '#222222' : '#dddddd';
    const gridColor = theme === 'light' ? 'rgba(80, 80, 80, 0.1)' : 'rgba(255, 255, 255, 0.2)';
    const dataColorGp = theme === 'light' ? 'rgba(0, 200, 0, 0.8)' : 'rgba(64, 255, 0, 0.8)';
    const dataColorOp = theme === 'light' ? 'rgba(250, 165, 0, 0.8)' : 'rgba(250, 165, 0, 0.8)';
    const dataColorNp = theme === 'light' ? 'rgba(250, 128, 114, 0.8)' : 'rgba(250, 128, 114, 0.8)';
    const dataColorRevenue = theme === 'light' ? '#368BC1' : '#368BC1';

    const attributes = [{
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
      label: `Quarterly Revenue`
    }];

    const genDataSetAndAttributes = (attribute, alldata) => {
      const data = alldata.map(d => _.get(d, attribute.attr));
      return {
        yAxisID: attribute.id || 'margins',
        type: attribute.type || 'line',
        fill: false,
        lineTension: 0.3,
        borderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 2,
        data,
        all: alldata,
        ...attribute,
        label: attribute.attachUnit ? `${attribute.label} (${normalize(data).unit})` : attribute.label
      };
    };
    const data = {
      labels: initialData.map(d => d.reportDate),
      datasets: attributes.map(attr => genDataSetAndAttributes(attr, initialData))
    };
    const divider = normalize(initialData.map(d => d.rev)).divider;
    const options = {
      legend: {
        labels: {
          fontSize: 12,
          fontColor, 
          boxWidth: 10,
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: 12,
            fontColor 
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
            fontColor, 
              callback: function(label, index, labels) {
                return label + '%';
              }
          },
        },
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'revenue',
          labels: {
            show: true
          },
          ticks: {
            fontSize: 12,
            fontColor, 
            min: 0,
            callback: function(label, index, labels) {
              return Math.floor(label / divider);
            }
          },
        }]
      },
    };

    return (
      <Bar data={data} height={220} options={options} />
    );
  }
}

export default MarginsChart;
