import { Clouds } from './openweather/clouds';
import { Coord } from './openweather/coord';
import { Main } from './openweather/main';
import { Precipitation } from './openweather/precipitation';
import { Sys } from './openweather/sys';
import { Weather } from './openweather/weather';
import { Wind } from './openweather/wind';

export interface Openweathermap {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: string;
  precipitation: Precipitation;
}
