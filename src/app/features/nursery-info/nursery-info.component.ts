import {CommonModule} from '@angular/common';
import {Component, inject, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { NurseryService } from '../../services/nursery.service';

@Component({
  selector: 'nursery-info',
  standalone: true,
  imports:[
    CommonModule
  ],
  templateUrl:'nursery-info.component.html',
  styleUrl: 'nursery-info.component.css'
})

export class NurseryInfoComponent{
  public nurseryService = inject(NurseryService);
  public nurseryId!: string | null;

  constructor(private route: ActivatedRoute){}

  ngOnInit(){
    this.nurseryId = this.route.snapshot.paramMap.get('id');
    this.nurseryService.getById(this.nurseryId);
    this.nurseryService.search.page=1;
    this.nurseryService.getProductsByNurseryId(this.nurseryId);
  }
}
