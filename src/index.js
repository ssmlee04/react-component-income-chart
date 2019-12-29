import React from 'react';
import MarginsChart from './MarginsChart';
import RevenuesChart from './RevenuesChart';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './../index.css';

export class Analyst extends React.Component {
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
          <img alt={`${profile.ticker} - ${profile.name} analyst opinions`} src={profile.income_chart_img.url} style={{ width: '100%' }} />
          <CopyToClipboard text={profile.income_chart_img.url || ''}
            onCopy={() => this.setState({ copied: true })}
          >
            <button className={btnClass} value={btnText}>{btnText}</button>
          </CopyToClipboard>
        </div>
      );
    }
    const data = profile.income_and_revenue_quarterly || [];
    return (
      <div className='font-12 sansserif'>
        <MarginsChart data={data} />
        <RevenuesChart data={data} />
      </div>
    );
  }
}

export default Analyst;
