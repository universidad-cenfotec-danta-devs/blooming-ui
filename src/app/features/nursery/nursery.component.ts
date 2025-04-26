import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NurseryService} from '../../services/nursery.service';
import {PaginationComponent} from '../pagination/pagination.component';
import {Router} from '@angular/router';
import {LoaderComponent} from '../loader/loader.component';
import {ToastrService} from 'ngx-toastr';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'nurseries',
  imports: [
    CommonModule,
    PaginationComponent,
    LoaderComponent,
    TranslateModule
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

  constructor(private router: Router, private toastr: ToastrService, private translate: TranslateService) {
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

    let translationKey = 'GEOLOCATION.DEFAULT_ERROR';
    switch(err.code) {
      case err.PERMISSION_DENIED:
        translationKey = 'GEOLOCATION.PERMISSION_DENIED';
        break;
      case err.POSITION_UNAVAILABLE:
        translationKey = 'GEOLOCATION.POSITION_UNAVAILABLE';
        break;
      case err.TIMEOUT:
        translationKey = 'GEOLOCATION.TIMEOUT';
        break;
    }

    this.translate.get(translationKey).subscribe((translatedMessage: string) => {
      this.toastr.error(translatedMessage, this.translate.instant("Error"), {
        timeOut: 3000,
      });
    });
  }

  nurseryDetailsPage(id: any) {
    this.router.navigate(['home/nursery-info/' + id])
  }

  goToEvaluation(id: any) {
    this.router.navigate(['home/evaluation/nursery/' + id]);
  }
}
