import {CommonModule} from '@angular/common';
import {Component, inject, OnInit, effect} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NurseryService} from '../../services/nursery.service';
import {PaginationComponent} from '../pagination/pagination.component';
import * as L from 'leaflet';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'nursery-info',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    TranslateModule
  ],
  templateUrl:'nursery-info.component.html',
  styleUrl: 'nursery-info.component.css'
})

export class NurseryInfoComponent implements OnInit {
  map!: L.Map;
  public nurseryService = inject(NurseryService);
  public currentNurseryId: any | null;

  constructor(private route: ActivatedRoute) {
    effect(() => {
      const data = this.nurseryService.nurseryDetail$();
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

  private configMap(lat: any, long: any): void {
    this.map = this.map?.remove()
    this.map = L.map('mapa', {
      center: [lat, long],
      zoom: 15.9,
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
  }
}
