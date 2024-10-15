"use client";

// src/app/chart/page.tsx
import { useEffect } from 'react';

const Chart = () => {
  useEffect(() => {
    // Check if the widget script already exists to avoid duplication
    const existingScript = document.getElementById('tradingview-widget-script');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script'; // Set an ID to check later
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: "BITFINEX:BTCUSD", // Change this to your desired trading pair
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        allow_symbol_change: true,
        calendar: false,
        support_host: "https://www.tradingview.com",
      });
      document.querySelector('.tradingview-widget-container__widget').appendChild(script);
    }
  }, []);

  return (
    <div className="container h-[621px]">
      <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
        <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
        <div className="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
            <span className="see-on-tw">See on TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Chart;