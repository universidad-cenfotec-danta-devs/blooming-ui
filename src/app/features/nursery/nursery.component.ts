import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NurseryService} from '../../services/nursery.service';
import {PaginationComponent} from '../pagination/pagination.component';
import {Router} from '@angular/router';

@Component({
  selector: 'nurseries',
  imports: [
    CommonModule,
    PaginationComponent
  ],
  templateUrl: 'nursery.component.html',
  styleUrl: 'nursery.component.css'
})

export class NurseryComponent implements OnInit {
  nurseryService: NurseryService = inject(NurseryService);


  ngOnInit(){
    if(!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
    }
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(`lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`);
    });
    this.watchPosition()
  }

  constructor(private router: Router) {
    this.nurseryService.search.page=1;
    this.nurseryService.getAllActives();
  }

  watchPosition(){
    let desLat = 0;
    let desLon = 0;

    let id = navigator.geolocation.watchPosition(
      (position) => {
      console.log(`lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`);
      if(position.coords.latitude === desLat){
        navigator.geolocation.clearWatch(id);
      }
    },
    (err) => {
      console.log(err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    })
  }


  nurseryDetailsPage(id: any){
    this.router.navigate(['home/nursery-info/' + id])
  }
}
