import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {SHARED_IMPORTS} from '../../shared/shared.module';
import {FloraByZoneService} from '../../services/flora-by-zone.service';
import * as L from 'leaflet';

@Component({
  selector: 'flora-by-zone',
  imports: [SHARED_IMPORTS],
  templateUrl: './flora-by-zone.component.html',
  standalone: true,
  styleUrls: ['./flora-by-zone.component.css']
})
export class FloraByZoneComponent implements OnInit, AfterViewChecked {

  selectedCanton: string = '';
  floraResponse: string = '';
  map: any;
  marker: any;

  constructor(private floraService: FloraByZoneService) {
  }

  ngOnInit(): void {
    this.floraResponse = '¡Descubre la flora de todos los cantones del país!';
    this.configMap();
  }

  ngAfterViewChecked(): void {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  configMap() {
    this.map = L.map('map', {
      center: [10.2736, -84.0739],
      zoom: 6.5,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 12,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    this.marker = L.marker([9.19, -83.75], {
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
    this.marker.bindPopup(`<b>¡Pura vida!</b><br>`).openPopup();

  }

  getFlora() {
    if (!this.selectedCanton) return;
    this.floraResponse = '¡Descubre la flora de todos los cantones del país!';
    this.floraService.getFloraByCanton(this.selectedCanton).subscribe(response => {
      this.floraResponse = 'Flora: ' + response;
    });
  }

  onCantonChange() {
    const canton = this.cantones.find(c => c.name === this.selectedCanton);
    if (canton) {
      this.map.panTo([canton.lat, canton.lng]);
      this.map.setZoom(12);
      this.marker.setLatLng([canton.lat, canton.lng]);
      this.marker.bindPopup(`<b>Cantón de ${canton.name}</b><br>`).openPopup();
      this.getFlora();
    }
  }

  cantones: { name: string; lat: number; lng: number }[] = [
    {name: 'San José', lat: 9.9281, lng: -84.0907},
    {name: 'Escazú', lat: 9.9173, lng: -84.1399},
    {name: 'Desamparados', lat: 9.8639, lng: -84.0615},
    {name: 'Puriscal', lat: 9.8328, lng: -84.3256},
    {name: 'Tarrazú', lat: 9.6651, lng: -84.0215},
    {name: 'Aserrí', lat: 9.8625, lng: -84.1086},
    {name: 'Mora', lat: 9.9119, lng: -84.2506},
    {name: 'Goicoechea', lat: 9.9631, lng: -84.0631},
    {name: 'Santa Ana', lat: 9.9366, lng: -84.1829},
    {name: 'Alajuelita', lat: 9.8981, lng: -84.0993}
  ];

}
