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

  async ngOnInit(): Promise<void> {
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

  async addWeatherFormApi(): Promise<void> {
    let position: Position = await this.setLatLon().then((p) => p);
    this.callWs.getCallOpenWeather(position ?? this.position).subscribe(
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

  setLatLon(): Promise<Position> {
    return new Promise((resolv, reject) => {
      this.getPosition()
        .then((pos) => {
          const { lat, lng } = pos;
          console.log(`Your latitude: ${lat}, longtitude: ${lng}`);
          const position: Position = { lat, lon: lng };
          resolv(position);
        })
        .catch((err) => {
          console.error(
            "sorry we can't get your latitude and longtitude \n",
            err
          );
          reject(err);
        });
    });
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

  getLastCreate(): void {
    this.ds.getAllWeather().subscribe((weathers) => {
      let last: any | undefined;
      weathers.forEach((weather) => {
        const tmp: any = weather?.payload?.doc?.data();
        if (!last) {
          last = tmp;
        } else {
          if (tmp.create_date > last.create_date) {
            last = tmp;
          }
        }
      });

      this.weather = { ...last };
      this.tempCurrent = Math.floor(Number(this.weather.temperature) ?? 0);
      this.pathImg = `../assets/images/${this.weather.weather}.png`;
    });
  }
}
