import _ from 'lodash';
import React from 'react';
import MarginsChart from './MarginsChart';
import RevenuesChart from './RevenuesChart';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './../index.css';

export class IncomeChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { profile } = this.props;
    if (!profile) return true;
    if (nextState.copied) return true;
    if (profile.ticker !== nextProps.profile.ticker) return true;
    return false;
  }

  render() {
    const { profile } = this.props;
    const { copied } = this.state;
    if (!profile) {
      return (
        <div style={{ fontSize: 14 }}>Not available at this time... </div>
      );
    }
    if (profile.income_chart_img && profile.income_chart_img.url) {
      const btnClass = copied ? 'react-components-show-url btn btn-sm btn-danger disabled font-10' : 'react-components-show-url btn btn-sm btn-warning font-10';
      const btnText = copied ? 'Copied' : 'Copy Img';
      return (
        <div className='react-components-show-button'>
          <img alt={`${profile.ticker} - ${profile.name} revenue and income margins`} src={profile.income_chart_img.url} style={{ width: '100%' }} />
          <CopyToClipboard text={profile.income_chart_img.url || ''}
            onCopy={() => this.setState({ copied: true })}
          >
            <button className={btnClass} value={btnText}>{btnText}</button>
          </CopyToClipboard>
        </div>
      );
    }
    const calculateMargins = (data) => {
      let divider = 1000000;
      let unit = 'million';
      let u = 'm';
      if (!data || !data.length) return data;
      if (data[0].rev > 1000000000) {
        divider = 1000000000;
        unit = 'billion';
        u = 'b';
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

    const data = calculateMargins(_.get(profile, 'income_and_revenue.data', []));
    return (
      <div style={{ width: '100%', padding: 5, fontSize: 14 }}>
        <div style={{ color: 'darkred', fontWeight: 'bold' }}>{profile.ticker} - {profile.name}</div>
        <MarginsChart data={data} />
        <RevenuesChart data={data} />
      </div>
    );
  }
}

export default IncomeChart;
