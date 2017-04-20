import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SimulateService } from './simulate'
import 'rxjs/add/operator/map';

@Injectable()
export class CarService {

  public simulate: SimulateService;

  constructor(public http: Http) {

    this.simulate = new SimulateService(http);
  }

  getPickupCar() {
    return this.simulate.getPickupCar();
  }

  findPickupCar(pickupLocation) {
    return this.simulate.findPickupCar(pickupLocation);
  }

  /**
   * 获取当前位置辆集合
   * 
   * @param {any} lat 
   * @param {any} lng 
   * @returns 
   * 
   * @memberOf CarService
   */
  getCars(lat, lng) {
    return Observable.interval(2000)
      .switchMap(() => this.simulate.getCars(lat, lng))
      .share();
  }
}
