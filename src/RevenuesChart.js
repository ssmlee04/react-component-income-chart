import React from "react";
import _ from "lodash";
import { Bar } from 'react-chartjs-2';

const formatNumber = (number, toFix = 2) => {
  if (number < 0) {
    return '-' + formatNumber(-number, toFix);
  }
  if (number > 1000000000) {
    return (number/1000000000).toFixed(toFix);
  }
  if (number > 1000000) {
    return (number/1000000).toFixed(toFix);
  }
  if (number > 1000) {
    return (number/1000).toFixed(toFix);
  }
  return number;
};

const genDataSetAndAttributes = (attribute, data) => {
  return {
    fill: false,
    lineTension: 0,
    borderWidth: 2,
    pointRadius: 3,
    pointHoverRadius: 5,
    data: data.map(d => _.get(d, attribute.attr)),
    all: data,
    ...attribute
  };
};

class RevenuesChart extends React.Component {
  render() {
    const { data: initialData } = this.props;
    if (!initialData || !initialData.length) return null;
    const unit = initialData && initialData[0].unit;
    const attributes = [{
      backgroundColor: '#368BC1',
      borderColor: '#368BC1',
      attr: 'rev',
      label: `Revenue Quarterly (${unit})`
    }];
    const data = {
      labels: initialData.map(d => d.reportDate),
      datasets: attributes.map(attr => genDataSetAndAttributes(attr, initialData))
    };
    const min = _.get(data, 'datasets.0.data', []).reduce((t, d) => {
      return Math.min(t, d);
    }, 9999999999999999) / 2;
    const options = {
      legend: {
        labels: {
          fontSize: 14,
          boxWidth: 10,
        }
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            const info = data.datasets[tooltipItem.datasetIndex];
            const reportDate = info.all[tooltipItem.datasetIndex].reportDate;
            const unit = info.all[tooltipItem.datasetIndex].unit;
            var label = `${reportDate} ${info.label}: `;
            label += tooltipItem.yLabel || 'n/a';
            label += ` ${unit}`;
            return label;
          }
        }
      },
      scales: {
        xAxes: [ {
          ticks: {
            autoSkip: false,
            fontSize: 12
          },
          barPercentage: 0.4
        } ],
        yAxes: [
          {
            ticks: {
              callback: function(label, index, labels) {
                return formatNumber(label, 0);
              },
              min,
              fontSize: 12
            },
          }
        ]
      }
    };
    return (
      <div style={{ width: '100%' }}>
        <Bar data={data} height={180} options={options} />
      </div>
    );
  }
}

export default RevenuesChart;
