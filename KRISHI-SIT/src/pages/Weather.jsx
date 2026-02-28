import React from 'react';

const Weather = () => {
  return (
    <section className="bg-white py-12 px-6 md:px-16">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Weather Monitoring</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Current Conditions</h2>
          <p>🌡️ Temperature: <strong>32°C</strong></p>
          <p>💧 Humidity: <strong>65%</strong></p>
          <p>🌬️ Wind Speed: <strong>15 km/h</strong></p>
          <p>🌧️ Rainfall: <strong>5 mm</strong></p>
        </div>

        <div className="bg-blue-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">3-Day Forecast</h2>
          <ul className="list-disc list-inside">
            <li>☀️ Monday - 33°C - Sunny</li>
            <li>🌥️ Tuesday - 30°C - Cloudy</li>
            <li>🌧️ Wednesday - 29°C - Rainy</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Weather;