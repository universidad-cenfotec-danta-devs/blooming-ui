import {CommonModule} from '@angular/common';
import {Component, inject, AfterViewInit, OnInit, effect} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NurseryService} from '../../services/nursery.service';
import {PaginationComponent} from '../pagination/pagination.component';
import * as L from 'leaflet';

@Component({
  selector: 'nursery-info',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent
  ],
  templateUrl:'nursery-info.component.html',
  styleUrl: 'nursery-info.component.css'
})

export class NurseryInfoComponent implements OnInit, AfterViewInit {
  map!: L.Map;
  public nurseryService = inject(NurseryService);
  public currentNurseryId: any | null;
  // marker: any;
  currentLat: any;
  currentLng: any;

  constructor(private route: ActivatedRoute) {
    // this.currentLat = 10.2736;
    // this.currentLng = -84.0739;
    effect(() => {
      const data = this.nurseryService.nurseryDetail$();
      console.log('la DATA', data);
      if(data.latitude){
        this.configMap(data.latitude, data.longitude);
      }
    });
  }

  ngOnInit() {
    this.currentNurseryId = this.route.snapshot.paramMap.get('id');
    this.nurseryService.setCurrentScreen('productsAdmin');
    this.nurseryService.setNurseryId(this.currentNurseryId)
    this.nurseryService.getById(this.currentNurseryId);
    this.nurseryService.getAll();

  }

  ngAfterViewInit(): void {
    // if (this.map) {
    //   this.configMap()
    // }
  }

  private configMap(lat: any, long: any): void {
    console.log(lat, long)
    this.map = this.map?.remove()
    this.map = L.map('mapa', {
      // 10.2736, -84.0739
      center: [lat, long],
      zoom: 6.5,
    });

    L.marker([lat,long], {
      icon: L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',

      })
    }).addTo(this.map);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 30,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    console.log(this.map)
  }
}
