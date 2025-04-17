import { AfterViewInit, Component, EventEmitter, Output } from "@angular/core";
import * as L from 'leaflet';

@Component({
    selector: "app-map-picker",
    templateUrl: "./map-picker.component.html",
})

export class MapPickerComponent implements AfterViewInit{
    @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();

    private map: any;
    private marker: any;

    ngAfterViewInit(): void {
        if (!this.map) {
            this.initMap();
        }
    }

    private initMap(): void {
        if (this.map) {
            this.map.remove();
          }        

        this.map = L.map('map').setView([9.9325, -84.08], 13); // Centrado en San José, CR

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        this.map.invalidateSize();

        this.map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        if (this.marker) {
            this.marker.setLatLng(e.latlng);
        } else {
            this.marker = L.marker(e.latlng).addTo(this.map);
        }
        this.locationSelected.emit({ lat, lng });
        });
    }

    forceResize() {
        if (this.map) {
          this.map.invalidateSize();
        }
      }
}
