import {Component, effect, EventEmitter, Output} from "@angular/core";
import * as L from 'leaflet';

@Component({
  selector: "app-map-picker",
  templateUrl: "./map-picker.component.html",
})

export class MapPickerComponent{
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();

  map!: L.Map;
  private marker!: L.Marker;

  constructor() {
    effect(() => {
      this.initMap();
    });
  }

  public reset(lat?:any, long?:any): void{
    this.map = this.map?.remove();
    this.marker = this.marker?.remove();
    this.initMap(lat, long);
  }

  private initMap(lat?:any, long?:any): void {

    this.map = L.map('map', {
      center: [lat || 9.9325,long || -84.08],
      zoom: 14,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    if(lat && long) {
      this.marker = new L.Marker([lat, long],{
        icon: L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          shadowSize: [41, 41],
          shadowAnchor: [12, 41]
        })
      });
      this.marker.addTo(this.map)
    }

    this.map.on('click', (e: any) => {
      const {lat, lng} = e.latlng;
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng, {
          icon: L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            shadowSize: [41, 41],
            shadowAnchor: [12, 41]
          })
        }).addTo(this.map);
      }
      this.locationSelected.emit({lat, lng});
    });
  }

  forceResize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }
}
