import React from 'react';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './../index.css';
const options = {
  legend: {
    position: 'left',
    display: true,
    fontSize: 14
  }
};
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
    if (profile.analyst_img && profile.analyst_img.url) {
      const btnClass = copied ? 'react-components-show-url btn btn-sm btn-danger disabled font-10' : 'react-components-show-url btn btn-sm btn-warning font-10';
      const btnText = copied ? 'Copied' : 'Copy Img';
      return (
        <div className='react-components-show-button'>
          <img alt={`${profile.ticker} - ${profile.name} analyst opinions`} src={profile.analyst_img.url} style={{ width: '100%' }} />
          <CopyToClipboard text={profile.analyst_img.url || ''}
            onCopy={() => this.setState({ copied: true })}
          >
            <button className={btnClass} value={btnText}>{btnText}</button>
          </CopyToClipboard>
        </div>
      );
    }
    const recommendation = _.first((profile.recommendation || {}).data) || {};
    const pricetarget = _.first((profile.pricetarget || {}).data) || {};

    const data = {
      labels: [
        `Buy (${recommendation.ratingBuy})`,
        `Overweight (${recommendation.ratingOverweight})`,
        `Hold (${recommendation.ratingHold})`,
        `Underweight (${recommendation.ratingUnderweight})`,
        `Sell (${recommendation.ratingSell})`,
      ],
      datasets: [{
        data: [
          recommendation.ratingBuy,
          recommendation.ratingOverweight,
          recommendation.ratingHold,
          recommendation.ratingUnderweight,
          recommendation.ratingSell,
        ],
        backgroundColor: [
        'darkgreen',
        'green',
        'gold',
        'orange',
        'red'
        ],
      }]
    };

    return (
      <div>
        <div style={{ width: '100%', padding: 5, fontSize: 14 }}>
          <div style={{ color: 'darkred', fontWeight: 'bold' }}>{profile.ticker} - {profile.name}</div>
          {pricetarget.priceTargetHigh ? <div><b>Target high:</b> <b style={{ color: 'green' }}>{pricetarget.priceTargetHigh}</b></div> : null}
          {pricetarget.priceTargetLow ? <div><b>Target low:</b> <b style={{ color: 'green' }}>{pricetarget.priceTargetLow}</b></div> : null}
          {pricetarget.priceTargetAverage && (pricetarget.numberOfAnalysts)
            ? <div>
              <b>Average:</b> <b style={{ color: 'green' }}>{pricetarget.priceTargetAverage}</b>
                  &nbsp;based on <b style={{ color: 'green' }}>{pricetarget.numberOfAnalysts}</b> analysts as of <b>{pricetarget.updatedDate}</b>
            </div>
            : null}
          <br />
        </div>
        <div style={{ width: '100%' }}>
          {recommendation ? <div>
            <Doughnut height={120} data={data} options={options} />
          </div> : null}
        </div>
      </div>
    );
  }
}

export default Analyst;
