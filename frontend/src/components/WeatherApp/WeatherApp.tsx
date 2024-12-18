import React, { useEffect, useState } from "react";
import sunny from "@/assets/images/sunny.png";
import cloudy from "@/assets/images/cloudy.png";
import rainy from "@/assets/images/rainy.png";
import snowy from "@/assets/images/snowy.png";
import loadingGif from "@/assets/images/loading.gif";
import "./WeatherApp.scss";

interface WeatherData {
  base: string;
  clouds: {
    all: number;
  };
  cod: number;
  coord: {
    lon: number;
    lat: number;
  };
  dt: number;
  id: number;
  main: {
    feels_like: number;
    grnd_lever: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  name: string;
  sys: {
    country: string;
    id: number;
    sunrise: number;
    sunset: number;
    type: number;
  };
  timezone: number;
  visibility: number;
  weather: Array<{
    description: string;
    icon: string;
    id: number;
    main: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
}

export default function WeatherApp() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string>("");
  const [notFound, setNotFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocation(e.target.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      search();
    }
  }

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      setLoading(true);
      const defaultLocation = "Milan";
      const url = "http://localhost:3000/api/data";

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ location: defaultLocation }),
        });

        // Check if the response is OK (status in the range 200–299)
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const defaultData: WeatherData = await res.json();

        //console.log(defaultData);

        setData(defaultData);
      } catch (error) {
        console.error("Error fetching default weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultWeather();
  }, []);

  async function search() {
    if (location.trim() !== "") {
      const url: string = "http://localhost:3000/api/data";

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ location: location }),
        });

        // Check if the response is OK (status in the range 200–299)
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const searchData: WeatherData = await res.json();
        //console.log(searchData);

        if (searchData.cod !== 200) {
          setNotFound(true);
          setData(null);
        } else {
          setNotFound(false);
          setData(searchData);
          setLocation("");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    }
  }

  const weatherImages = {
    Clear: sunny,
    Clouds: cloudy,
    Rain: rainy,
    Drizzle: rainy,
    Thunderstorm: rainy,
    Tornado: rainy,
    Squall: rainy,
    Snow: snowy,
    Haze: cloudy,
    Mist: cloudy,
    Fog: cloudy,
    Dust: cloudy,
    Smoke: cloudy,
    Ash: cloudy,
    Sand: cloudy,
  };

  const weatherImage = data?.weather
    ? weatherImages[data.weather[0].main as keyof typeof weatherImages]
    : undefined;

  const backgroundImages = {
    Clear: "linear-gradient(to right, #f3b07c, #fcd283)",
    Clouds: "linear-gradient(to right, #57d6d4, #71eeec)",
    Rain: "linear-gradient(to right, #5bc8fb, #80eaff)",
    Drizzle: "linear-gradient(to right, #5bc8fb, #80eaff)",
    Thunderstorm: "linear-gradient(to right, #5bc8fb, #80eaff)",
    Tornado: "linear-gradient(to right, #5bc8fb, #80eaff)",
    Squall: "linear-gradient(to right, #5bc8fb, #80eaff)",
    Snow: "linear-gradient(to right, #aff2ff, #fff)",
    Haze: "linear-gradient(to right, #57d6d4, #71eeec)",
    Mist: "linear-gradient(to right, #57d6d4, #71eeec)",
    Fog: "linear-gradient(to right, #57d6d4, #71eeec)",
    Dust: "linear-gradient(to right, #57d6d4, #71eeec)",
    Smoke: "linear-gradient(to right, #57d6d4, #71eeec)",
    Ash: "linear-gradient(to right, #57d6d4, #71eeec)",
    Sand: "linear-gradient(to right, #57d6d4, #71eeec)",
  };

  const backgroundImage = data?.weather
    ? backgroundImages[data.weather[0].main as keyof typeof backgroundImages]
    : "linear-gradient(to right, #f3b07c, #fcd283)";

  const currentDate = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const dayOfMonth = currentDate.getDate();
  const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;

  return (
    <div className="container" style={{ backgroundImage }}>
      <div
        className="weather-app"
        style={{
          backgroundImage:
            backgroundImage && backgroundImage.replace
              ? backgroundImage.replace("to right", "to top")
              : undefined,
        }}
      >
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot"></i>
            <div className="location">{data ? data.name : null}</div>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
          </div>
        </div>
        {loading ? (
          <img className="loader" src={loadingGif} alt="loading" />
        ) : notFound ? (
          <div className="not-found">Not Found 🥲</div>
        ) : (
          <>
            <div className="weather">
              <img src={weatherImage} alt={data?.weather[0].main} />
              <div className="weather-type">{data?.weather ? data.weather[0].main : null}</div>
              <div className="temp">{data?.main ? `${Math.floor(data.main.temp)}º` : null}</div>
            </div>
            <div className="weather-date">
              <p>{formattedDate}</p>
            </div>
            <div className="weather-data">
              <div className="humidity">
                <div className="data-name">Humidity</div>
                <i className="fa-solid fa-droplet"></i>
                <div className="data">{data?.main ? data.main.humidity : null}%</div>
              </div>
              <div className="wind">
                <div className="data-name">Wind</div>
                <i className="fa-solid fa-wind"></i>
                <div className="data">{data?.wind ? data.wind.speed : null} Km/h</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
