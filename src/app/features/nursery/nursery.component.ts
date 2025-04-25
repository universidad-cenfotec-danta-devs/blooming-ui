import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NurseryService} from '../../services/nursery.service';
import {PaginationComponent} from '../pagination/pagination.component';
import {Router} from '@angular/router';
import {LoaderComponent} from '../loader/loader.component';
import {ToastrService} from 'ngx-toastr';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'nurseries',
  imports: [
    CommonModule,
    PaginationComponent,
    LoaderComponent,
    TranslatePipe,
  ],
  templateUrl: 'nursery.component.html',
  styleUrl: 'nursery.component.css'
})

export class NurseryComponent implements OnInit, OnDestroy {
  nurseryService: NurseryService = inject(NurseryService);
  private watchId: number | null = null;

  ngOnInit() {
    if (!navigator.geolocation) {
      this.toastr.warning('Tu navegador no soporta geolocalización', 'Advertencia');
    }
    navigator.geolocation.getCurrentPosition((position) => {
      this.nurseryService.setUserUbication(position.coords.latitude, position.coords.longitude);
      this.nurseryService.setCurrentScreen('nearby');
      this.nurseryService.getAll();
    });
    this.watchPosition()
  }

  ngOnDestroy() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  constructor(private router: Router, private toastr: ToastrService) {
  }

  watchPosition() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.nurseryService.setUserUbication(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        this.handleLocationError(err);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 30000,
        timeout: 10000
      })
  }

  private handleLocationError(err: GeolocationPositionError) {
    console.error('Error de geolocalización:', err);

    let errorMessage = 'Error al obtener la ubicación';
    switch(err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Permiso de ubicación denegado. Por favor habilita los permisos de ubicación.';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Información de ubicación no disponible. Verifica tu conexión o señal GPS.';
        break;
    }

    this.toastr.error(errorMessage, 'Error', {
      timeOut: 3000,
    });
  }

  nurseryDetailsPage(id: any) {
    this.router.navigate(['home/nursery-info/' + id])
  }

  goToEvaluation(id: any) {
    this.router.navigate(['home/evaluation/nursery/' + id]);
  }
}
