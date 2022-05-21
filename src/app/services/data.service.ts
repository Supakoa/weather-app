import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Weather } from 'src/app/models/weather';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  collectionWeather: string = '/weathers';
  constructor(private db: AngularFirestore) {}

  // get Weathers
  getAllWeather() {
    return this.db.collection(this.collectionWeather).snapshotChanges();
  }

  // add Weather
  addWeather(weather: Weather) {
    weather.id = this.db.createId();
    return this.db.collection(this.collectionWeather).add(weather);
  }

  getWeatherByCallBack(callback: Function) {
    return this.db
      .collection(this.collectionWeather)
      .get()
      .subscribe((res) => callback(res));
  }
}
