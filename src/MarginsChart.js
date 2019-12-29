import React from "react";
import _ from "lodash";
import { Line } from 'react-chartjs-2';

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

const attributes = [{
  backgroundColor: '#368BC1',
  borderColor: '#368BC1',
  attr: 'gpMargin',
  label: 'Gross Profit Margin (%)'
}, {
  backgroundColor: '#00b300',
  borderColor: '#00b300',
  attr: 'oiMargin',
  label: 'Operating Income Margin (%)'
}, {
  backgroundColor: '#FF0000',
  borderColor: '#FF0000',
  attr: 'niMargin',
  label: 'Net Income Margin (%)'
}];
const options = {
  legend: {
    labels: {
      fontSize: 10,
      boxWidth: 10,
    }
  },
  scales: {
    xAxes: [{
      ticks: {
        fontSize: 10
      }
    }],
    yAxes: [{
      ticks: {
        fontSize: 10
      }
    }]
  },
  tooltips: {
    callbacks: {
      label: function(tooltipItem, data) {
        const info = data.datasets[tooltipItem.datasetIndex];
        const reportDate = info.all[tooltipItem.datasetIndex].reportDate;
          var label = `${reportDate} ${info.label}: `;
          label += tooltipItem.yLabel || 'n/a';
          label += '%';
          return label;
      }
    }
  }
};

class MarginsChart extends React.Component {
  render() {
    const { data: initialData } = this.props;
    if (!initialData || !initialData.length) return null;
    const data = {
      labels: initialData.map(d => d.reportDate.replace(/-/g, '').slice(0, 6)),
      datasets: attributes.map(attr => genDataSetAndAttributes(attr, initialData))
    };

    return (
      <div style={{ width: '100%' }}>
        <Line data={data} height={180} options={options} />
      </div>
    );
  }
}

export default MarginsChart;
