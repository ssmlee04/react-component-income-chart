import _ from 'lodash';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Bar } from 'react-chartjs-2';
import './../index.css';

const normalize = (data) => {
  let divider = 1000;
  let unit = 'thousands';
  let u = 'k';
  if (!data || !data.length) return { data: [] };
  if (data[0] > 10000000) {
    divider = 1000000;
    unit = 'milllion';
    u = 'mil';
  }
  if (data[0] > 10000000000) {
    divider = 1000000000;
    unit = 'billion';
    u = 'bil';
  }
  return { data: data.map(d => d/divider), unit, u, divider };
};

export class IncomeChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { profile, prop = 'income_and_revenue', imgProp = 'income_chart_img', theme = 'light' } = this.props;
    const { copied } = this.state;
    if (!profile) {
      return (
        <div style={{ fontSize: 12 }}>Not available at this time... </div>
      );
    }
    if (profile[imgProp] && profile[imgProp].url) {
      const btnClass = copied ? 'react-components-show-url btn btn-sm btn-danger disabled font-12' : 'react-components-show-url btn btn-sm btn-warning font-12';
      const btnText = copied ? 'Copied' : 'Copy Img';
      return (
        <div className='react-components-show-button'>
          <img alt={`${profile.ticker} - ${profile.name} revenue and income margins`} src={profile[imgProp].url} style={{ width: '100%' }} />
          <CopyToClipboard text={profile[imgProp].url || ''}
            onCopy={() => this.setState({ copied: true })}
          >
            <button className={btnClass} value={btnText}>{btnText}</button>
          </CopyToClipboard>
        </div>
      );
    }
    const calculateMargins = (data) => {
      let divider = 1000;
      let unit = 'thousand';
      let u = 'k';
      if (!data || !data.length) return data;
      if (data[0].rev > 10000000) {
        divider = 1000000;
        unit = 'milllion';
        u = 'mil';
      }
      if (data[0].rev > 10000000000) {
        divider = 1000000000;
        unit = 'billion';
        u = 'bil';
      }
      data = data.filter(d => d.reportDate);
      data = data.map(d => {
        d.reportDate = d.reportDate.replace(/-/g, '').slice(0, 6);
        return d;
      });
      data = _.sortBy(data, (d) => {
        return d.reportDate;
      });

      return data.map((d, i) => {
        const qq = ~~d.reportDate.slice(4, 6);
        let yy = d.reportDate.slice(0, 4);
        let qtr;
        if (qq <= 3) {
          qtr = 'Q1';
        }
        else if (qq <= 6) {
          qtr = 'Q2';
        }
        else if (qq <= 9) {
          qtr = 'Q3';
        }
        else if (qq <= 12) {
          qtr = 'Q4';
        }
        d.unit = unit;
        d.u = u;
        d.cogsSmall = d.cogs / divider;
        d.ebitSmall = d.ebit / divider;
        d.gpSmall = d.gp / divider;
        d.incomeTaxSmall = d.incomeTax / divider;
        d.niSmall = d.ni / divider;
        d.oiSmall = d.oi / divider;
        d.operatingExpenseSmall = d.operatingExpense / divider;
        d.otherIncomeExpenseSmall = d.otherIncomeExpense / divider;
        d.rndSmall = d.rnd / divider;
        d.sgnaSmall = d.sgna / divider;
        d.revSmall = d.rev / divider;
        d.revenueGrowthYoy = data[i - 4] ? ((d.rev / data[i - 4].rev - 1) * 100).toFixed(2) : '';
        d.quarterStr = yy + qtr;
        d.gpMargin = parseFloat((d.gp / d.rev * 100).toFixed(2));
        d.oiMargin = parseFloat((d.oi / d.rev * 100).toFixed(2));
        d.ebitMargin = parseFloat((d.ebit / d.rev * 100).toFixed(2));
        d.niMargin = parseFloat((d.ni / d.rev * 100).toFixed(2));
        return d;
      });
    };

    const initialData = calculateMargins(_.get(profile, `${prop}.data`, [])).slice(-15);

    if (!initialData || !initialData.length) return null;
    const fontColor = theme === 'light' ? '#222222' : '#dddddd';
    const gridColor = theme === 'light' ? 'rgba(80, 80, 80, 0.1)' : 'rgba(255, 255, 255, 0.2)';
    const dataColorGp = theme === 'light' ? 'rgba(0, 150, 0, 0.8)' : 'rgba(0, 150, 0, 0.8)';
    // const dataColorOp = theme === 'light' ? 'rgba(250, 165, 0, 0.8)' : 'rgba(250, 165, 0, 0.8)';
    // const dataColorNp = theme === 'light' ? 'rgba(250, 128, 114, 0.8)' : 'rgba(250, 128, 114, 0.8)';
    const dataColorRevenue = theme === 'light' ? '#368BC1' : '#368BC1';

    const attributes = [{
      backgroundColor: dataColorRevenue,
      borderColor: dataColorRevenue,
      attr: 'gpMargin',
      label: 'Gross Mgn %'
    // }, {
    //   backgroundColor: dataColorOp,
    //   borderColor: dataColorOp,
    //   attr: 'oiMargin',
    //   label: 'Operating Margin %'
    }, {
      backgroundColor: dataColorGp,
      borderColor: dataColorGp,
      attr: 'niMargin',
      label: 'Net Profit Mgn %'
    }, {
      backgroundColor: 'red',
      borderColor: 'red',
      attr: 'gp',
      id: 'bar',
      type: 'bar',
      stack: 'Stack 0',
      attachUnit: true,
      label: `Gross Profit`
    }, {
      backgroundColor: 'orange',
      borderColor: 'orange',
      attr: 'rev',
      id: 'bar',
      type: 'bar',
      stack: 'Stack 1',
      attachUnit: true,
      label: `Revenue`
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
        // label: attribute.attachUnit ? `${attribute.label} (${normalize(data).unit})` : attribute.label
        label: attribute.label
      };
    };
    const data = {
      labels: initialData.map(d => d.reportDate),
      datasets: attributes.map(attr => genDataSetAndAttributes(attr, initialData))
    };
    const divider = normalize(initialData.map(d => d.rev)).divider;
    const unit = normalize(initialData.map(d => d.rev)).unit;
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
          barPercentage: 0.8
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
          id: 'bar',
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
      <div style={{ width: '100%', padding: 5, fontSize: 12 }}>
        <div className={`theme-darkred-${theme}`} style={{ fontWeight: 'bold' }}>{profile.ticker} - {profile.name}&nbsp;<span className={`theme-green-${theme}`}>Quarterly Revenue Analysis&nbsp;<span className={`theme-black-${theme} normal`}>(unit: {unit})</span></span></div>
        <Bar data={data} height={220} options={options} />
        <div style={{ fontSize: 12, padding: 5, paddingTop: 2 }}>Generated by <a href='https://twitter.com/tradeideashq' target='_blank' className={`theme-darkred-${theme}`}>@tradeideashq</a> with <span style={{ fontSize: 16, color: 'red' }}>💡</span></div>
      </div>
    );
  }
}

export default IncomeChart;
