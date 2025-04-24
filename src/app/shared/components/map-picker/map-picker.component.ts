import {AfterViewInit, Component, EventEmitter, Output} from "@angular/core";
import * as L from 'leaflet';

@Component({
  selector: "app-map-picker",
  templateUrl: "./map-picker.component.html",
})

export class MapPickerComponent implements AfterViewInit {
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();

  private map: any;
  private marker: any;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = this.map?.remove();
    this.map = L.map('map').setView([9.9325, -84.08], 13); // Centrado en San José, CR

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // this.map.invalidateSize();

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
            popupAnchor: [1, -34],
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
