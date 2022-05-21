import { Component, OnInit } from '@angular/core';
import { Openweathermap } from './models/openweathermap';
import { Position } from './models/position';
import { Weather } from './models/weather';
import { ConfigService } from './services/config.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  position: Position = { lat: '13.7563', lon: '100.5018' }; // default bangkok
  pathImg: string = '';
  openweathermap: Openweathermap | undefined;
  weather: Weather = {
    id: '',
    create_date: new Date(),
    humidity: '',
    precipitation: '',
    temp_type: 'C',
    temperature: '',
    weather: '',
    wind: '',
    wind_type: 'm/s',
  };
  tempCurrent: number | undefined;

  constructor(private ds: DataService, private callWs: ConfigService) {}

  ngOnInit(): void {
    this.setLatLon();
    this.addWeatherFormApi();
  }

  onToggle(temp: string): void {
    const cel = document.getElementById('celsius');
    const fah = document.getElementById('fahrenheit');
    const tmp = Number(this.weather.temperature) ?? 0;
    if (temp === 'F') {
      this.tempCurrent = Math.floor(1.8 * tmp + 32);
      fah?.classList.add('active');
      cel?.classList.remove('active');
    } else {
      this.tempCurrent = tmp;
      fah?.classList.remove('active');
      cel?.classList.add('active');
    }
  }

  addWeatherFormApi(): void {
    this.callWs.getCallOpenWeather(this.position).subscribe(
      (res) => {
        const { weather, wind, main } = res;
        this.tempCurrent = Math.floor(main.temp);

        this.weather.humidity = main.humidity.toString();
        this.weather.precipitation = (
          res?.precipitation?.value ?? 1
        ).toString();
        this.weather.temperature = this.tempCurrent.toString();
        this.weather.weather = this.checkWeather(weather[0].main);
        this.weather.wind = wind.speed.toString();
        this.ds.addWeather(this.weather);
        this.pathImg = `../assets/images/${this.weather.weather}.png`;
      },
      (err: any) => {
        console.error(err);
        this.getLastCreate();
      }
    );
  }

  setLatLon(): void {
    this.getPosition()
      .then((pos) => {
        this.position.lat = pos.lat;
        this.position.lon = pos.lng;
      })
      .catch((err) =>
        console.error("sorry we can't get your latitude and longtitude \n", err)
      );
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  checkWeather(str: string): string {
    switch (str) {
      case 'Clouds':
        return 'cloudy';
      case 'Rain':
        return 'rainy';
      case 'Clear':
        return 'sun';
      default:
        return '';
    }
  }

  getWeatherById(id: string): void {
    this.ds.getWeatherByCallBack((res: any) => {
      res.docs.forEach((item: any) => {
        const data = item.data();
        if (data?.id === id) {
          this.weather.create_date = data?.create_date;
          this.weather.humidity = data?.humidity;
          this.weather.precipitation = data?.precipitation;
          this.weather.temp_type = data?.temp_type;
          this.weather.temperature = data?.temperature;
          this.weather.weather = data?.weather;
          this.weather.wind = data?.wind;
          this.weather.wind_type = data?.wind_type;
        }
      });
    });
  }

  getLastCreate(): void {
    this.ds.getAllWeather().subscribe((weathers) => {
      weathers.map((weather) => {
        // const current: any;
        const { doc } = weather.payload;
        console.log(doc);
      });
    });
  }
}
