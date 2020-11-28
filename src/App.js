import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import "./App.css";
import Table from "./Table";
import { SortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import Map from "./Map.js";
import "leaflet/dist/leaflet.css";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setcountry] = useState("WorldWide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 22.720555, lng: 75.858633});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [worldCenter,] = useState({ lat: 22.720555,lng:75.858633});

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((Response) => Response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((Response) => Response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setMapCountries(data);
          setCountries(countries);
          setTableData(data);
        });
    };
    getCountries();
  }, []);

  const oncountryChange = async (event) => {
    const countryCode = event.target.value;
    setcountry(countryCode);
    const url =
      countryCode === "WorldWide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((Response) => Response.json())
      .then((data) => {
        setCountryInfo(data);
        if (countryCode === "WorldWide") {
          setMapCenter(worldCenter);
          setMapZoom(3);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };

  return (
    <div className="app">
      <div className="app-left">
        <div className="app_header">
          <h1>COVID 19 TRACKER </h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={oncountryChange}
              value={country}
            >
              <MenuItem value="WorldWide"> WorldWide </MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}> {country.name} </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="CoronaVirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            isActive
            active={casesType === "active"}
            onClick={(e) => setCasesType("active")}
            title="Active"
            cases={prettyPrintStat(countryInfo.critical)}
            Critical
            total={prettyPrintStat(countryInfo.active)}
          />
          <InfoBox
            isRecovered
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app-right">
        <CardContent>
          {/* Table */}
          <h2>Live Cases By Country</h2>
          <Table countries={SortData(tableData)} />
          <h2 className = "graph-caption">WorldWide Cases (Daily Increase) </h2>
          <LineGraph className="app_graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
