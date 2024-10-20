// App.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import TemperatureWave from './TemperatureWave';
import 'bootstrap/dist/css/bootstrap.min.css';

const images = [
  require('./weather_images/2ndone.jpg'),
  require('./weather_images/1stone.jpg'),
  require('./weather_images/3rdone.jpeg'),
  require('./weather_images/4thone.jpg'),
  require('./weather_images/5thone.webp'),
  require('./weather_images/6thone.webp'),
  require('./weather_images/8thone.jpg'),
];

function App() {
  const [currentImage, setCurrentImage] = useState(images[0]);
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [temperatureData, setTemperatureData] = useState([20, 25, 30, 28, 22]); // Default temperature data
  const apiKey = 'your_api_key'
// Replace with your OpenWeatherMap API key
  const [initialLocationFetched, setInitialLocationFetched] = useState(false); // New state variable

  const changeBackground = useCallback(() => {
    const nextIndex = (images.indexOf(currentImage) + 1) % images.length;
    setCurrentImage(images[nextIndex]);
  }, [currentImage]);

  const getCurrentLocationWeather = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherDataByCoordinates(latitude, longitude);
          setInitialLocationFetched(true); // Set the initial location as fetched
        },
        () => {
          setError('Unable to retrieve your location.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    // Fetch current location weather only once
    if (!initialLocationFetched) {
      getCurrentLocationWeather();
    }

    const intervalId = setInterval(() => {
      changeBackground();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [changeBackground, getCurrentLocationWeather, initialLocationFetched]);

  const fetchWeatherDataByCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
      setWeatherData(response.data);
      setTemperatureData([
        response.data.main.temp - 5,
        response.data.main.temp,
        response.data.main.temp + 3,
        response.data.main.temp - 2,
        response.data.main.temp - 4
      ]);
      setError('');
    } catch (err) {
      setWeatherData(null);
      setError('Unable to fetch weather data. Please try again later.');
    }
  };

  const fetchWeatherData = async () => {
    try {
      const geoResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);

      if (geoResponse.data.length === 0) {
        setError('City not found. Please try again.');
        setWeatherData(null);
        return;
      }

      const { lat, lon } = geoResponse.data[0];

      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

      setWeatherData(weatherResponse.data);
      setTemperatureData([
        weatherResponse.data.main.temp - 5,
        weatherResponse.data.main.temp,
        weatherResponse.data.main.temp + 3,
        weatherResponse.data.main.temp - 2,
        weatherResponse.data.main.temp - 4
      ]);
      setError('');
    } catch (err) {
      setWeatherData(null);
      setError('Unable to fetch weather data. Please try again.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${currentImage})`, transition: 'background-image 1s ease-in-out' }}>
      <div className="container">
        <button onClick={changeBackground} className="custom-icon-container" style={{ backgroundColor: 'transparent', border: 'none' }}>
          <span className="glyphicon glyphicon-certificate custom-icon rotate-fan"></span>
          <span className="custom-icon-text" style={{ color: 'Yellow', fontSize: '24px' }}>WeatherWise</span>
        </button>
        <form className="input-group text-center" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ fontSize: '18px', padding: '10px' }} // Increased size of search box
          />
          <div className="input-group-btn">
            <button className="btn btn-default" type="submit" style={{ backgroundColor: 'lightblue', color: 'black' }}>
              <i className="glyphicon glyphicon-search"></i>
            </button>
          </div>
        </form>
        
        {error && <p>{error}</p>}
        <div className="weather-container">
          {weatherData && (
            <div className="weather-details">
              <h2>{weatherData.name}</h2>
              <p>Temperature: {weatherData.main.temp}°C</p>
              <p>Weather: {weatherData.weather[0].description}</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Wind Speed: {weatherData.wind.speed} m/s</p>
              <p>UV Index: {weatherData.uvi || 'N/A'}</p>
              <p>Chance of Precipitation: {weatherData.pop || 'N/A'}%</p>
              <p>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>
          )}
          {weatherData && (
            <div className="temperature-graph">
              <TemperatureWave temperatureData={temperatureData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
