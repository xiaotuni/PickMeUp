import { Component, ViewChild } from '@angular/core';
import { MapComponent } from '../../components/map/map';
import { NavController } from 'ionic-angular';
import { PickupPubSubService } from '../../providers/core';
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  // @ViewChild('map') mapElement;
  // map: any;
  public isPickupRequested: boolean;
  public pickupSubscription: any;
  public timeTillArrival: number;

  constructor(public navCtrl: NavController,
    private pickupPubSub: PickupPubSubService) {
    this.isPickupRequested = false;
    this.timeTillArrival = 5;
    this.pickupSubscription = this.pickupPubSub
      .watch()
      .subscribe((e) => {
        this.processPickupSubscription(e);
      });
    var a;
    console.log(a);
  }
  processPickupSubscription(e) {
    switch (e) {
      case this.pickupPubSub.EVENTS.ARRIVAL_TIME:
        this.updateArrivalTime(e.data);
        break;
      case this.pickupPubSub.EVENTS.DROPOFF:
        break;
      case this.pickupPubSub.EVENTS.PICKUP:
        break;
    }
  }

  updateArrivalTime(time) {
    let minutes = Math.floor(time / 60);
    this.timeTillArrival = minutes;
  }

  confirmPickUp() {
    this.isPickupRequested = true;
  }
  cancelPickUp() {
    this.isPickupRequested = false;
  }






  // initMap() {
  //   let latLng = new google.maps.LatLng(39.91658294, 116.39636993);
  //   let mapOptions = {
  //     center: latLng,
  //     zoom: 15,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP,
  //   };

  //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  // }
}