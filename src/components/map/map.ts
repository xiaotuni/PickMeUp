import { OnInit, Input, Component, AfterContentInit } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import { CarService } from '../../providers/core'

@Component({
  selector: 'map',
  templateUrl: 'map.html',
  providers: [CarService]
})
export class MapComponent implements OnInit, AfterContentInit {

  @Input() isPickupRequested: boolean;

  public map: google.maps.Map;
  public isMapIdle: boolean;
  public UpdateCurrentDate: Date;
  public currentLocation: google.maps.LatLng;

  constructor(public nav: NavController, public loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.map = this.createMap();
    this.addMapEventListeners();
    this.getCurrentLocation().subscribe(location => {
      this.centerLocation(location);
    });
  }

  ngAfterContentInit() {
    console.log('------------1--------');
  }

  updatePickupLocation(location: google.maps.LatLng) {
    this.currentLocation = location;
    this.centerLocation(location);
  }

  /**
   * 添加地图事件
   * 
   * @memberOf MapComponent
   */
  addMapEventListeners() {
    let self = this;
    google.maps.event.addListener(this.map, 'dragstart', () => {
      self.isMapIdle = false;
      self.UpdateCurrentDate = new Date();
    });
    google.maps.event.addListener(this.map, 'idle', () => {
      self.UpdateCurrentDate = new Date();
      self.isMapIdle = true;
    });

  }

  /**
   * 中心位置
   * 
   * @param {any} location 
   * 
   * @memberOf MapComponent
   */
  centerLocation(location) {
    if (location) {
      this.map.panTo(location);
    } else {
      this.getCurrentLocation().subscribe(currentLocation => {
        this.map.panTo(currentLocation);
      });
    }
  }

  /**
   * 获取当前位置
   * 
   * @returns 
   * 
   * @memberOf MapComponent
   */
  getCurrentLocation() {
    let loading = this.loadingCtrl.create({ content: 'Loading...' });
    loading.present();

    let options = { timeout: 10000, enableHighAccuracy: true }

    let locationObs = Observable.create(observable => {
      Geolocation.getCurrentPosition(options).then(resp => {
        let lat = resp.coords.latitude;
        let lng = resp.coords.longitude;
        let location = new google.maps.LatLng(lat, lng);
        observable.next(location);
        loading.dismiss();
      }, err => {
        console.log('Geolocation error:' + err);
        loading.dismiss();
      });
    });

    return locationObs;
  }
  // 选择点经度：114.93308544； 纬度：27.82632467
  //北京的： 39.91658294, 116.39636993
  createMap(location = new google.maps.LatLng(27.82632467, 114.93308544)) {
    let mapOptions = {
      center: location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      // disableDefaultUI: true,
    }

    let mapEl = document.getElementById('map');
    let map = new google.maps.Map(mapEl, mapOptions);
    return map;
  }
}
