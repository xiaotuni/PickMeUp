import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SimulateService {

  public directionsService: google.maps.DirectionsService;
  public myRoute: any;
  public myRouteIndex: number;

  constructor(public http: Http) {
    this.directionsService = new google.maps.DirectionsService();
  }

  getPickupCar() {
    return Observable.create(observable => {
      let car = this.myRoute[this.myRouteIndex];
      observable.next(car);
      this.myRouteIndex++;
    });
  }


  getSegmentedDirections(directions) {
    let route = directions.routes[0];
    let legs = route.legs;
    let path = [];
    let increments = [];
    let duration = 0;

    let numOfLegs = legs.length;
    // work backwards though each leg in directions route
    while (numOfLegs--) {
      let leg = legs[numOfLegs];
      let steps = leg.steps;
      let numOfSteps = steps.length;

      while (numOfSteps--) {
        let step = steps[numOfSteps];
        let points = step.path;
        let numOfPoints = points.length;
        duration += step.duration.value;

        while (numOfPoints--) {
          let point = points[numOfPoints];
          path.push(point);

          increments.unshift({
            position: point,      // car position
            time: duration,       // time left before arrival
            path: path.slice(0), // clone array to prevent referencing final path array
          });
        }
      }
    }

    return increments;
  }

  calculateRoute(start, end) {
    return Observable.create(observable => {
      this.directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          observable.next(response);
        } else {
          observable.error(status);
        }
      });
    });
  }
  simulateRoute(start, end) {
    return Observable.create(observable => {
      this.calculateRoute(start, end).subscribe(directions => {
        // get route path
        this.myRoute = this.getSegmentedDirections(directions);
        // return pickup car;
        this.getPickupCar().subscribe(car => {
          observable.next(car); // first increment in car path
        });
      });
    });
  }

  findPickupCar(pickupLocation) {
    this.myRouteIndex = 0;

    let car = this.cars1.cars[0]; // pick on of the cars to simulate pickupLocation
    let start = new google.maps.LatLng(car.coord.lat, car.coord.lng);
    let end = pickupLocation;
    return this.simulateRoute(start, end);
  }

  /**
   * 获取当前位置车数量
   * 
   * @param {any} lat 
   * @param {any} lng 
   * @returns 
   * 
   * @memberOf SimulateService
   */
  getCars(lat, lng) {
    let carData = this.cars[this.carIndex];
    this.carIndex++;
    if (this.carIndex > this.cars.length - 1) {
      this.carIndex = 0;
    }
    return Observable.create(
      (observable) => { observable.next(carData); }
    );
  }

  private carIndex: number = 0;

  private cars1 = {
    cars: [
      { id: 1, coord: { lat: 27.823354, lng: 114.922335 } },
      { id: 2, coord: { lat: 27.825137, lng: 114.927142 } },
      { id: 3, coord: { lat: 27.818761, lng: 114.930618 } },
      { id: 4, coord: { lat: 27.834132, lng: 114.926691 } },
    ]
  }
  private cars2 = {
    cars: [
      { id: 1, coord: { lat: 27.824644, lng: 114.938965 } },
      { id: 2, coord: { lat: 27.829122, lng: 114.938450 } },
      { id: 3, coord: { lat: 27.823316, lng: 114.933472 } },
      { id: 4, coord: { lat: 27.818951, lng: 114.937248 } },
    ]
  }
  private cars3 = {
    cars: [
      { id: 1, coord: { lat: 27.829085, lng: 114.921713 } },
      { id: 2, coord: { lat: 27.822253, lng: 114.929996 } },
      { id: 3, coord: { lat: 27.819748, lng: 114.945874 } },
      { id: 4, coord: { lat: 27.826656, lng: 114.950981 } },
    ]
  }
  private cars4 = {
    cars: [
      { id: 1, coord: { lat: 27.831058, lng: 114.940896 } },
      { id: 2, coord: { lat: 27.825669, lng: 114.937119 } },
      { id: 3, coord: { lat: 27.824378, lng: 114.937119 } },
      { id: 4, coord: { lat: 27.823505, lng: 114.929609 } },
    ]
  }
  private cars5 = {
    cars: [
      { id: 1, coord: { lat: 27.824986, lng: 114.933472 } },
      { id: 2, coord: { lat: 27.825024, lng: 114.939008 } },
      { id: 3, coord: { lat: 27.834701, lng: 114.933128 } },
      { id: 4, coord: { lat: 27.822898, lng: 114.926004 } },
    ]
  }

  private cars: Array<any> = [
    this.cars1, this.cars2, this.cars3
    , this.cars4, this.cars4
  ];
}
