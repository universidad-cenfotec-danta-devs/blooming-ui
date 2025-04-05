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
    this.floraResponse = '';
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
    this.floraResponse = '';
    this.floraService.getFloraByCanton(this.selectedCanton).subscribe(response => {
      this.floraResponse = response;
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
    { name: 'San José', lat: 9.9333, lng: -84.0833 },
    { name: 'Escazú', lat: 9.9167, lng: -84.1333 },
    { name: 'Desamparados', lat: 9.8667, lng: -84.0667 },
    { name: 'Puriscal', lat: 9.8333, lng: -84.3333 },
    { name: 'Tarrazú', lat: 9.6667, lng: -84.0167 },
    { name: 'Aserrí', lat: 9.8667, lng: -84.1000 },
    { name: 'Mora', lat: 9.9167, lng: -84.2500 },
    { name: 'Goicoechea', lat: 9.9500, lng: -84.0500 },
    { name: 'Santa Ana', lat: 9.9333, lng: -84.1833 },
    { name: 'Alajuelita', lat: 9.9000, lng: -84.1000 },
    { name: 'Vázquez de Coronado', lat: 10.0333, lng: -84.0167 },
    { name: 'Acosta', lat: 9.7500, lng: -84.2000 },
    { name: 'Tibás', lat: 9.9667, lng: -84.0833 },
    { name: 'Moravia', lat: 9.9500, lng: -84.0333 },
    { name: 'Montes de Oca', lat: 9.9333, lng: -84.0500 },
    { name: 'Turrubares', lat: 9.7500, lng: -84.4500 },
    { name: 'Dota', lat: 9.6500, lng: -83.9333 },
    { name: 'Curridabat', lat: 9.9167, lng: -84.0333 },
    { name: 'Pérez Zeledón', lat: 9.3667, lng: -83.7000 },
    { name: 'León Cortés', lat: 9.6667, lng: -84.0000 },
    { name: 'Alajuela', lat: 10.0167, lng: -84.2167 },
    { name: 'San Ramón', lat: 10.0833, lng: -84.4667 },
    { name: 'Grecia', lat: 10.0667, lng: -84.3167 },
    { name: 'San Mateo', lat: 9.9500, lng: -84.5333 },
    { name: 'Atenas', lat: 9.9833, lng: -84.3833 },
    { name: 'Naranjo', lat: 10.1000, lng: -84.3833 },
    { name: 'Palmares', lat: 10.0500, lng: -84.4500 },
    { name: 'Poás', lat: 10.1000, lng: -84.2333 },
    { name: 'Orotina', lat: 9.9167, lng: -84.5333 },
    { name: 'San Carlos', lat: 10.3500, lng: -84.5333 },
    { name: 'Zarcero', lat: 10.1833, lng: -84.4000 },
    { name: 'Sarchí', lat: 10.1000, lng: -84.3500 },
    { name: 'Upala', lat: 10.9000, lng: -85.0167 },
    { name: 'Los Chiles', lat: 11.0333, lng: -84.7167 },
    { name: 'Guatuso', lat: 10.6667, lng: -84.8333 },
    { name: 'Río Cuarto', lat: 10.2667, lng: -84.2167 },
    { name: 'Cartago', lat: 9.8667, lng: -83.9167 },
    { name: 'Paraíso', lat: 9.8333, lng: -83.8667 },
    { name: 'La Unión', lat: 9.9000, lng: -83.9833 },
    { name: 'Jiménez', lat: 9.7500, lng: -83.7000 },
    { name: 'Turrialba', lat: 9.9000, lng: -83.6833 },
    { name: 'Alvarado', lat: 9.8333, lng: -83.8500 },
    { name: 'Oreamuno', lat: 9.9000, lng: -83.8833 },
    { name: 'El Guarco', lat: 9.8000, lng: -83.9167 },
    { name: 'Heredia', lat: 10.0000, lng: -84.1167 },
    { name: 'Barva', lat: 10.1000, lng: -84.1333 },
    { name: 'Santo Domingo', lat: 10.0667, lng: -84.1500 },
    { name: 'Santa Bárbara', lat: 10.0833, lng: -84.1500 },
    { name: 'San Rafael', lat: 10.0333, lng: -84.1000 },
    { name: 'San Isidro', lat: 10.0333, lng: -84.0500 },
    { name: 'Belén', lat: 9.9833, lng: -84.1833 },
    { name: 'Flores', lat: 10.0167, lng: -84.1167 },
    { name: 'San Pablo', lat: 10.0167, lng: -84.1000 },
    { name: 'Sarapiquí', lat: 10.4500, lng: -84.0167 },
    { name: 'Liberia', lat: 10.6333, lng: -85.4333 },
    { name: 'Nicoya', lat: 10.1500, lng: -85.4500 },
    { name: 'Santa Cruz', lat: 10.2667, lng: -85.5833 },
    { name: 'Bagaces', lat: 10.5333, lng: -85.2500 },
    { name: 'Carrillo', lat: 10.4000, lng: -85.7667 },
    { name: 'Cañas', lat: 10.4333, lng: -85.2833 },
    { name: 'La Cruz', lat: 11.0333, lng: -85.7500 },
    { name: 'Hojancha', lat: 10.3667, lng: -85.6333 },
    { name: 'Tilarán', lat: 10.5000, lng: -84.9333 },
    { name: 'San Vito', lat: 8.9667, lng: -82.9667 },
    { name: 'Coto Brus', lat: 8.8833, lng: -82.9500 },
    { name: 'Golfito', lat: 8.6500, lng: -83.1667 },
    { name: 'Corredores', lat: 8.9667, lng: -83.5167 },
    { name: 'Osa', lat: 8.7667, lng: -83.4667 },
    { name: 'Quepos', lat: 9.4333, lng: -84.1500 },
    { name: 'Parrita', lat: 9.4167, lng: -84.1667 },
    { name: 'Aguirre', lat: 9.4333, lng: -84.1833 },
    { name: 'Los Santos', lat: 9.3000, lng: -83.3667 },
    { name: 'La Palmera', lat: 9.3333, lng: -83.4167 },
    { name: 'Coto', lat: 8.7167, lng: -82.9667 },
    { name: 'La Perla', lat: 9.2167, lng: -83.1833 },
    { name: 'Ciudad Cortés', lat: 8.5167, lng: -83.1833 },
    { name: 'Quepos', lat: 9.4333, lng: -84.1500 }
  ];

}
