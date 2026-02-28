import React from 'react';
import WeatherForecast from '../components/WeatherForecast';

export default function FarmingSupport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Smart Farming Support System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive agricultural support with real-time weather monitoring, 
            crop recommendations, and intelligent farming insights powered by IoT technology.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Weather Forecast Widget */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">
                Real-Time Weather Forecast
              </h2>
              <WeatherForecast />
            </div>
          </div>

          {/* Farming Support Features */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Crop Recommendations */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
                <span className="mr-3">🌾</span>
                Smart Crop Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Current Season Optimal Crops</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Wheat - High yield potential</li>
                    <li>• Barley - Drought resistant</li>
                    <li>• Mustard - Oil content: 40-45%</li>
                    <li>• Chickpea - Nitrogen fixing</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Weather-Based Suggestions</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Delay sowing if rain expected</li>
                    <li>• Consider drought-resistant varieties</li>
                    <li>• Optimal planting: Next 3-5 days</li>
                    <li>• Soil moisture: Adequate</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* IoT Monitoring Systems */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
                <span className="mr-3">📡</span>
                IoT Farm Monitoring
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-3xl mb-2">🌡️</div>
                  <h4 className="font-semibold text-yellow-800">Soil Temperature</h4>
                  <p className="text-2xl font-bold text-yellow-600">24°C</p>
                  <p className="text-sm text-gray-600">Optimal for planting</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl mb-2">💧</div>
                  <h4 className="font-semibold text-blue-800">Soil Moisture</h4>
                  <p className="text-2xl font-bold text-blue-600">68%</p>
                  <p className="text-sm text-gray-600">Good moisture level</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-3xl mb-2">🔬</div>
                  <h4 className="font-semibold text-purple-800">Soil pH</h4>
                  <p className="text-2xl font-bold text-purple-600">6.8</p>
                  <p className="text-sm text-gray-600">Slightly acidic</p>
                </div>
              </div>
            </div>

            {/* Irrigation Management */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
                <span className="mr-3">💦</span>
                Smart Irrigation System
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Irrigation Schedule</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span>Zone A - Wheat Field</span>
                      <span className="text-green-600 font-semibold">Active</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Zone B - Vegetable Garden</span>
                      <span className="text-orange-600 font-semibold">Scheduled 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Zone C - Orchard</span>
                      <span className="text-gray-600 font-semibold">Tomorrow 5:00 AM</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Water Management</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Daily Usage:</span>
                      <span className="font-semibold">2,450 L</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Water Efficiency:</span>
                      <span className="font-semibold text-green-600">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tank Level:</span>
                      <span className="font-semibold text-blue-600">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Refill:</span>
                      <span className="font-semibold text-orange-600">3 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pest and Disease Management */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
                <span className="mr-3">🐛</span>
                Pest & Disease Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Active Alerts</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>🔴 Aphid risk: High (due to weather)</li>
                    <li>🟡 Fungal infection: Medium risk</li>
                    <li>🟢 Overall crop health: Good</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Preventive Measures</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Apply neem oil spray</li>
                    <li>• Monitor leaf moisture levels</li>
                    <li>• Maintain proper ventilation</li>
                    <li>• Schedule inspection in 2 days</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Yield Prediction */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
                <span className="mr-3">📊</span>
                AI-Powered Yield Prediction
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-b from-green-100 to-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Wheat</h4>
                  <div className="text-3xl font-bold text-green-600 mb-1">4.2</div>
                  <div className="text-sm text-gray-600">tons/hectare</div>
                  <div className="text-xs text-green-600 mt-1">+8% from last season</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Mustard</h4>
                  <div className="text-3xl font-bold text-yellow-600 mb-1">1.8</div>
                  <div className="text-sm text-gray-600">tons/hectare</div>
                  <div className="text-xs text-yellow-600 mt-1">+12% from last season</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Chickpea</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-1">2.1</div>
                  <div className="text-sm text-gray-600">tons/hectare</div>
                  <div className="text-xs text-blue-600 mt-1">+5% from last season</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Weather-Based Farming Tips */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
            <span className="mr-3">💡</span>
            Weather-Based Farming Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Today's Recommendation</h4>
              <p className="text-sm text-gray-700">
                Perfect conditions for field preparation. Consider soil testing and fertilizer application.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">This Week</h4>
              <p className="text-sm text-gray-700">
                Stable weather pattern. Good time for planting winter crops and setting up irrigation.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Water Management</h4>
              <p className="text-sm text-gray-700">
                Low rain probability. Monitor soil moisture and plan irrigation schedule accordingly.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Pest Control</h4>
              <p className="text-sm text-gray-700">
                Moderate humidity levels may increase pest activity. Check crops regularly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
