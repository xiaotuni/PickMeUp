import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CarService } from '../../providers/CarService';
@Component({
  selector: 'available-cars',
  templateUrl: 'available-cars.html',
  providers: [CarService]
})
export class AvailableCarsComponent implements OnInit, OnChanges {

  @Input() map: google.maps.Map;
  @Input('isPickupRequested') isPickupRequested: boolean;
  public carMarkers: Array<google.maps.Marker>

  constructor(public carService: CarService) {
    this.carMarkers = [];
  }

  ngOnInit(): void {
    this.fetchAndRefreshCars();
  }
  
  ngOnChanges(): void {
    if (!this.isPickupRequested) {
      this.removeCarMakrer();
    }
  }
  /**
   * 从地图上删除辆
   * 
   * @memberOf AvailableCarsComponent
   */
  removeCarMakrer() {
    let numOfCars = this.carMarkers.length;
    while (numOfCars--) {
      let car = this.carMarkers.pop();
      car.setMap(null);
    }
  }

  /**
   * 添加车辆信息到地图上
   * 
   * @param {any} car 
   * 
   * @memberOf AvailableCarsComponent
   */
  addCarMarker(car) {
    let carMarker = new google.maps.Marker({
      map: this.map,
      position: new google.maps.LatLng(car.coord.lat, car.coord.lng),
      icon: 'img/car-icon.png'
    });
    carMarker.set('id', car.id); // MVCObject();
    this.carMarkers.push(carMarker);
  }

  /**
   * 更新车在地图上的位置
   * 
   * @param {any} car 
   * @returns 
   * 
   * @memberOf AvailableCarsComponent
   */
  updateCarMarker(car) {
    try {
      for (let i = 0; i < this.carMarkers.length; i++) {
        // find car and update is;
        let id = this.carMarkers[i].get('id')
        if (id === car.id) {
          this.carMarkers[i].setPosition(new google.maps.LatLng(car.coord.lat, car.coord.lng));
          return;
        }
      }

      //car does not exist is carMarkers;
      this.addCarMarker(car);
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
   * 获取或更新当前位置车辆信息
   * 
   * @memberOf AvailableCarsComponent
   */
  fetchAndRefreshCars() {
    try {

      console.log('----AvailableCarsComponent---fetchAndRefreshCars--');
      // 在subscribe里面要指定监听返回来的对象里有哪些属性值，要不能主举动报下面的错误。
      //  [ts] Property 'cars' does not exist on type '{}'. any

      this.carService.getCars(27.823354, 114.922335).subscribe((carData: { cars }) => {
        if (this.isPickupRequested) {
          console.log(carData);
          carData.cars.forEach(car => {
            this.updateCarMarker(car);
          });
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  }

}
