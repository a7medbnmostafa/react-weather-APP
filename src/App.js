import "./App.css";
import "weathericons/css/weather-icons.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import moment from "moment";
import "moment/locale/ar";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

// React
import { useEffect, useState } from "react";

// MATERIAL UI COMPONENTS
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";
import axios from "axios";

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});

// moment.locale("ar");

let cancelAxios = null;
function App() {
  // state
  const [locale, setLocale] = useState("ar");
  const [dir, setDir] = useState("rtl");

  const { t, i18n } = useTranslation();

  const dataAndTime = moment().format("MMMM Do YYYY, h:mm:ss a");
  // console.log("The time is =========> " , dataAndTime)
  const [time, setTime] = useState(moment());
  const [temp, setTemp] = useState({
    daily: {
      tempMin: null,
      tempMax: null,
      time: null,
      timezone: null,
    },
    current: {
      tempApparent: null,
      weatherCode: null,
    },
  });
  function weatherDescriptionsFunction(value) {
    const weatherDescriptions = {
      0: {
        description: "Clear sky",
        icon: "wi-day-sunny",
      },

      1: {
        description: "Mainly clear",
        icon: "wi-day-sunny-overcast",
      },

      2: {
        description: "Partly cloudy",
        icon: "wi-day-cloudy",
      },

      3: {
        description: "Overcast",
        icon: "wi-cloudy",
      },

      45: {
        description: "Fog",
        icon: "wi-fog",
      },

      48: {
        description: "Depositing rime fog",
        icon: "wi-fog",
      },

      51: {
        description: "Light drizzle",
        icon: "wi-sprinkle",
      },

      53: {
        description: "Moderate drizzle",
        icon: "wi-showers",
      },

      55: {
        description: "Dense drizzle",
        icon: "wi-rain",
      },

      56: {
        description: "Light freezing drizzle",
        icon: "wi-sleet",
      },

      57: {
        description: "Dense freezing drizzle",
        icon: "wi-sleet",
      },

      61: {
        description: "Slight rain",
        icon: "wi-rain",
      },

      63: {
        description: "Moderate rain",
        icon: "wi-rain",
      },

      65: {
        description: "Heavy rain",
        icon: "wi-rain-wind",
      },

      66: {
        description: "Light freezing rain",
        icon: "wi-rain-mix",
      },

      67: {
        description: "Heavy freezing rain",
        icon: "wi-rain-mix",
      },

      71: {
        description: "Slight snowfall",
        icon: "wi-snow",
      },

      73: {
        description: "Moderate snowfall",
        icon: "wi-snow",
      },

      75: {
        description: "Heavy snowfall",
        icon: "wi-snow",
      },

      77: {
        description: "Snow grains",
        icon: "wi-snowflake-cold",
      },

      80: {
        description: "Slight rain showers",
        icon: "wi-showers",
      },

      81: {
        description: "Moderate rain showers",
        icon: "wi-showers",
      },

      82: {
        description: "Violent rain showers",
        icon: "wi-rain-wind",
      },

      85: {
        description: "Slight snow showers",
        icon: "wi-snow",
      },

      86: {
        description: "Heavy snow showers",
        icon: "wi-snow-wind",
      },

      95: {
        description: "Thunderstorm",
        icon: "wi-thunderstorm",
      },

      96: {
        description: "Thunderstorm with slight hail",
        icon: "wi-storm-showers",
      },

      97: {
        description: "Heavy thunderstorm",
        icon: "wi-thunderstorm",
      },

      99: {
        description: "Thunderstorm with heavy hail",
        icon: "wi-hail",
      },
    };

    return weatherDescriptions[value];
  }
  console.log(moment().format("LTS"));
  useEffect(() => {
    axios
      .get(
        "https://api.open-meteo.com/v1/forecast?latitude=30.0625&longitude=31.25&daily=temperature_2m_max,temperature_2m_min&timezone=Africa%2FCairo",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        },
      )
      .then((res) => {
        console.log("daily==> ", res.data);
        const temperature_2m_min = res.data.daily.temperature_2m_min[0];
        console.log("temperature_2m_min==> ", temperature_2m_min);
        const temperature_2m_max = res.data.daily.temperature_2m_max[0];
        const tempTime = res.data.daily.time[0];
        const tempTimezone = res.data.timezone.split("/")[1];

        // const newDate = {...temp.daily}
        setTemp((newTemp) => ({
          ...newTemp,
          daily: {
            ...newTemp.daily,
            tempMin: temperature_2m_min,
            tempMax: temperature_2m_max,
            time: tempTime,
            timezone: tempTimezone,
          },
        }));
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(
        "https://api.open-meteo.com/v1/forecast?latitude=30.0625&longitude=31.25&current=temperature_2m,apparent_temperature,weather_code",
      )
      .then((res) => {
        const apparent_temperature = res.data.current.apparent_temperature;
        const weather_code = weatherDescriptionsFunction(
          res.data.current.weather_code,
        );
        // setTemp(temp)

        console.log("weather_code==> ", weather_code);
        console.log("current==> ", res.data);

        setTemp((newTemp) => ({
          ...newTemp,
          current: {
            ...newTemp.current,
            tempApparent: apparent_temperature,
            weatherCode: weather_code,
          },
        }));
      })
      .catch((err) => {
        console.log(err);
      });
    const interval = setInterval(() => {
      setTime(moment());
    }, 1000);

    return () => {
      clearInterval(interval);
      cancelAxios();
    };
  }, []);

  //   handel event
  function i18nTrans() {
    if (locale === "ar") {
      setLocale("en");
      setDir("ltr");
      i18n.changeLanguage("en");
      moment.locale("en");


    } else {
      setLocale("ar");
      setDir("rtl");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    }
  }

  //   useEffect(() => {
  //     i18n.changeLanguage(locale);
  //   }, []);

  return (
    <div className="App" dir={dir}>
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* CONTENT CONTAINER */}
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {/* CARD */}
            <div
            
              style={{
                width: "100%",
                background: "rgb(28 52 91 / 36%)",
                color: "white",
                padding: "10px",
                borderRadius: "15px",
                boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
              }}
            >
              {/* CONTENT */}
              <div>
                {/* CITY & TIME */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "start",
                  }}
                 
                >
                  <Typography
                    variant="h2"
                    style={{
                      marginRight: "20px",
                      fontWeight: "600",
                    }}
                  >
                    {t(temp.daily.timezone)}
                  </Typography>

                  <Typography variant="h5" style={{ marginRight: "20px" }}>
                    {time.format("MMMM Do YYYY, h:mm:ss a")}
                  </Typography>
                </div>
                {/* == CITY & TIME == */}

                <hr />

                {/* CONTAINER OF DEGREE + CLOUD ICON */}
                <div
                  style={{
                    marginTop: "40px",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  {/* DEGREE & DESCRIPTION */}
                  <div>
                    {/* TEMP */}
                    <div>
                      <Typography variant="h1" style={{ textAlign: "right" }}>
                        {temp.current.tempApparent}°C
                      </Typography>

                      {/* TODO: TEMP IMAGE */}
                    </div>
                    {/*== TEMP ==*/}

                    <Typography variant="h6">
                      {t(temp.current.weatherCode?.description)}
                    </Typography>

                    {/* MIN & MAX */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5>
                        {" "}
                        {t("Min")}: {temp.daily.tempMin}
                      </h5>
                      <h5 style={{ margin: "0px 5px" }}>|</h5>
                      <h5>
                        {" "}
                        {t("Max")}: {temp.daily.tempMax}
                      </h5>
                    </div>
                  </div>
                  {/*== DEGREE & DESCRIPTION ==*/}

                  <i
                    className={`wi ${temp.current.weatherCode?.icon}`}
                    style={{
                      fontSize: "100px",
                    }}
                  ></i>
                </div>
                {/*= CONTAINER OF DEGREE + CLOUD ICON ==*/}
              </div>
              {/* == CONTENT == */}
            </div>
            {/*== CARD ==*/}

            {/* TRANSLATION CONTAINER */}
            <div
             
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                marginTop: "20px",
              }}
            >
              <Button
                style={{ color: "white" }}
                variant="text"
                onClick={i18nTrans}
				
              >
                {locale == "en" ? "Arabic" : "إنجليزي"}
              </Button>
            </div>
            {/*== TRANSLATION CONTAINER ==*/}
          </div>
          {/*== CONTENT CONTAINER ==*/}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
