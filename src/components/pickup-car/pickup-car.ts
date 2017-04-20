import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CarService, PickupPubSubService } from '../../providers/core';
var SlidingMarker = require('marker-animate-unobtrusive');

@Component({
  selector: 'pickup-car',
  templateUrl: 'pickup-car.html'
})
export class PickupCarComponent implements OnInit, OnChanges {

  @Input() map: google.maps.Map;
  @Input() isPickupRequested: boolean;
  @Input() pickupLocation: google.maps.LatLng;

  public pickupCarMarker: any;
  public polylinePath: google.maps.Polyline;


  constructor(public carService: CarService,
    private pickupPubSub: PickupPubSubService) {

  }

  ngOnInit(): void {

  }
  ngOnChanges(): void {
    if (this.isPickupRequested) {
      // request car
      this.requestCar();
    } else {
      // remove / cancel car 
      this.removeCar();
      this.removeDirections();
    }
  }
  /**
   * 添加车
   * 
   * @param {any} position 
   * 
   * @memberOf PickupCarComponent
   */
  addCarMarker(position) {
    this.pickupCarMarker = new SlidingMarker({
      map: this.map,
      position: position,
      icon: 'img/car-icon.png',
    });
    this.pickupCarMarker.setDuration(1000);
    this.pickupCarMarker.setEasing('linear');
  }

  /**
   * 显示方向
   * 
   * @param {any} path 
   * 
   * @memberOf PickupCarComponent
   */
  showDirections(path) {
    this.polylinePath = new google.maps.Polyline({
      path: path,
      strokeColor: '#ff0000',
      strokeOpacity: 3,
    });
    this.polylinePath.setMap(this.map);
  }

  /**
   * 更新车的位置
   * 
   * @memberOf PickupCarComponent
   */
  updateCar() {
    this.carService.getPickupCar().subscribe(car => {
      // animate car to next point;
      if (this.pickupCarMarker) {
        this.pickupCarMarker.setPosition(car.position);
      }
      // set direction path for car;
      if (this.polylinePath) {
        this.polylinePath.setPath(car.path);
      }

      // 更新达到时间
      this.pickupPubSub.emitArrivalTime(car.time);

      // keep updating car;
      if (car.path.length > 1) {
        setTimeout(() => {
          this.updateCar();
        }, 1000);
      } else {
        // car arrived;
      }
    });
  }

  /**
   * 请求辆车
   * 
   * @memberOf PickupCarComponent
   */
  requestCar() {
    console.log('request car ' + this.pickupLocation);
    this.carService.findPickupCar(this.pickupLocation)
      .subscribe(car => {
        console.log(car);
        // show car makrer
        this.addCarMarker(car.position);
        // show car path/directions to you
        this.showDirections(car.path);
        // keep updating car
        this.updateCar();
      })
  }
  /**
   * 删除辆
   * 
   * @memberOf PickupCarComponent
   */
  removeCar() {
    if (this.pickupCarMarker) {
      this.pickupCarMarker.setMap(null);
      this.pickupCarMarker = null;
    }
  }
  /**
   * 删除路线
   * 
   * @memberOf PickupCarComponent
   */
  removeDirections() {
    if (this.polylinePath) {
      this.polylinePath.setMap(null);
      this.polylinePath = null;
    }
  }
}
