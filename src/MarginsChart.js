import React from "react";
import _ from "lodash";
import { Bar } from 'react-chartjs-2';

const genDataSetAndAttributes = (attribute, alldata) => {
  const data = alldata.map(d => _.get(d, attribute.attr));
  return {
    yAxisID: attribute.id || 'margins',
    type: attribute.type || 'line',
    fill: false,
    lineTension: 0,
    borderWidth: 1,
    pointRadius: 2,
    pointHoverRadius: 2,
    data,
    all: alldata,
    ...attribute,
    label: attribute.attachUnit ? `${attribute.label} (${normalize(data).unit})` : attribute.label
  };
};

const attributes = [{
  backgroundColor: 'green',
  borderColor: 'green',
  attr: 'gpMargin',
  label: 'Gross Profit Mgn (%)'
}, {
  backgroundColor: 'orange',
  borderColor: 'orange',
  attr: 'oiMargin',
  label: 'Operating Mgn (%)'
}, {
  backgroundColor: 'gold',
  borderColor: 'gold',
  attr: 'niMargin',
  label: 'Net Income Mgn (%)'
}, {
  backgroundColor: '#368BC1',
  borderColor: '#368BC1',
  attr: 'rev',
  id: 'revenue',
  type: 'bar',
  attachUnit: true,
  label: `Quarterly Revenue`
}];


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
    let { data: initialData } = this.props;
    if (!initialData || !initialData.length) return null;
    initialData = initialData.slice(-15);
    const data = {
      labels: initialData.map(d => d.reportDate),
      datasets: attributes.map(attr => genDataSetAndAttributes(attr, initialData))
    };
    const divider = normalize(initialData.map(d => d.rev)).divider;
    const options = {
      legend: {
        labels: {
          fontSize: 14,
          boxWidth: 10,
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: 12
          },
          barPercentage: 0.4
        }],
        yAxes: [{
                type: 'linear',
                display: true,
                position: 'right',
                id: 'margins',
                gridLines: {
                  display: false
                },
                labels: {
                  show: true
                },
                ticks: {
                  fontSize: 10,
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
                  fontSize: 10,
                  min: 0,
                  callback: function(label, index, labels) {
                    return Math.floor(label / divider);
                  }
                },
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

    return (
      <div style={{ width: '100%' }}>
        <Bar data={data} height={220} options={options} />
      </div>
    );
  }
}

export default MarginsChart;
