import { OnInit, Component, Output, Input, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { PickupPubSubService } from '../../providers/core';
import { Observable, Observer } from 'rxjs/Rx';

@Component({
  selector: 'pickup',
  templateUrl: 'pickup.html'
})
export class PickupComponent implements OnChanges, OnInit {
  @Input('isPinSet') isPinSet: boolean;
  @Input('isPickupRequested') isPickupRequested: boolean;
  @Input('CurrentDate') CurrentDate: Date;
  @Input() map: google.maps.Map;
  @Output() updatePickupLocation: EventEmitter<google.maps.LatLng> = new EventEmitter<google.maps.LatLng>();;

  private popup: google.maps.InfoWindow;
  private pickupMarker: google.maps.Marker;
  private pickupSubscription: any;

  constructor(private pickupPubSub: PickupPubSubService) {


  }
  ngOnInit(): void {
    this.pickupSubscription = this.pickupPubSub
      .watch()
      .subscribe((e) => {
        if (e.event = this.pickupPubSub.EVENTS.ARRIVAL_TIME) {
          this.updateTime(e.data);
        }
      });
  }
  updateTime(times) {
    let minutes = Math.floor(times / 60);
    this.popup.setContent(`还有：${minutes} 分钟`);
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {

    // do not all pickup pin/location
    // to change if pickup is requested
    if (!this.isPickupRequested) {
      if (this.isPinSet) {
        this.showPickupMarker();
      } else {
        this.removePickupMarker();
      }
    }
  }

  /**
   * 显示当前的位置
   * 
   * @memberOf PickupComponent
   */
  showPickupMarker() {
    // if (!this.pickupMarker) {

    this.removePickupMarker();
    this.pickupMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.BOUNCE, // 这里有一个动画效果
      position: this.map.getCenter(),
      icon: 'img/person-icon.png'
    });
    // }

    setTimeout(() => {
      if (this.pickupMarker && this.pickupMarker.setAnimation) {
        this.pickupMarker.setAnimation(null);    // 清空那个动画效果
      }
    }, 750);
    this.showPickupTime();

    //send pickup location
    if (this.pickupMarker) {
      this.updatePickupLocation.next(this.pickupMarker.getPosition());
    }
  }


  /**
   * 删除当前地图上的位置
   * 
   * @memberOf PickupComponent
   */
  removePickupMarker() {
    if (this.pickupMarker) {
      this.pickupMarker.setMap(null);
      this.pickupMarker = null;
    }
  }

  /**
   * 在地图当前位置，显示提示信息
   * 
   * @memberOf PickupComponent
   */
  showPickupTime() {
    if (!this.popup) {
      this.popup = new google.maps.InfoWindow({
        content: '<h5>你在这里</h5>'
      });
    }

    this.popup.open(this.map, this.pickupMarker);
    google.maps.event.addListener(this.pickupMarker, 'click', (ee) => {
      this.popup.open(this.map, this.pickupMarker);
    })
  }
}
