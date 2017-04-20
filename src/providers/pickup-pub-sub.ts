import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class PickupPubSubService {

  public pickup$: Observable<any>;
  private _observer: Observer<any>;
  public EVENTS = {
    PICKUP: 'pickup',
    DROPOFF: 'dropoff',
    ARRIVAL_TIME: 'arrival-time',   // 抵达时间
  }

  constructor(public http: Http) {
    this.pickup$ = new Observable(observer => {
      this._observer = observer;
    })
      .share();// share() allows nultiple subscribers
  }
  watch() {
    return this.pickup$;
  }

  /**
   * 通知到达时间
   * 
   * @param {any} time 
   * 
   * @memberOf PickupPubSub
   */
  emitArrivalTime(time) {
    this._observer.next({
      event: this.EVENTS.ARRIVAL_TIME,
      data: time
    });
  }


  emitPickUp() {
    this._observer.next({
      event: this.EVENTS.PICKUP,
      data: null,
    });
  }

  emitDropOff() {
    this._observer.next({
      event: this.EVENTS.DROPOFF,
      data: null,
    });
  }




}
