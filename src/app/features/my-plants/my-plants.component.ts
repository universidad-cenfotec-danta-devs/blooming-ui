/*------------------------------------------------------------------
  Displays the user’s plants and lets them create / download a
  watering plan per plant.
-------------------------------------------------------------------*/

import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { PlantService } from '../../services/plant.service';
import { WateringPlanService } from '../../services/wateringPlant.service';
import { ToastrService } from 'ngx-toastr';
import { Plant } from '../../interfaces/plant.interface';
import { SHARED_IMPORTS } from '../../shared/shared.module';

@Component({
  selector: 'app-my-plants',
  templateUrl: './my-plants.component.html',
  imports: [SHARED_IMPORTS],
})
export class MyPlantsComponent implements OnInit {
  /* ---------------------------------------------------------------
   * Data + pagination
   * ------------------------------------------------------------- */
  plants: Plant[] = [];
  page = 1;               // 1-based index for the UI
  pageSize = 10;
  totalItems = 0;

  /* Keeps the watering-plan ID returned for each plant. */
  private wateringPlanIds: Record<number, number> = {};

  /* ---------------------------------------------------------------
   * UI state flags
   * ------------------------------------------------------------- */
  loading = false;
  error: string | null = null;

  constructor(
    private readonly plantService: PlantService,
    private readonly wateringPlanService: WateringPlanService,
    private readonly toastr: ToastrService,
  ) {}

  /* ---------------------------------------------------------------
   * Lifecycle
   * ------------------------------------------------------------- */
  ngOnInit(): void {
    this.fetchPlants();
  }

  /* ---------------------------------------------------------------
   * Data helpers
   * ------------------------------------------------------------- */
  private fetchPlants(): void {
    this.loading = true;
    this.error = null;

    this.plantService
      .getPlantsByUser(this.page - 1, this.pageSize)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.plants = data;
          this.totalItems = data.length; // Replace when API returns total
        },
        error: (err) => {
          console.error(err);
          this.error = 'MY_PLANTS.ERROR';
        },
      });
  }

  trackByPlantId(_: number, plant: Plant): number | string {
    return plant.id ?? plant.tokenPlant;
  }

  /* ---------------------------------------------------------------
   * Pagination
   * ------------------------------------------------------------- */
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  goToPage(target: number): void {
    if (target < 1 || target === this.page) return;
    this.page = target;
    this.fetchPlants();
  }

  /* ---------------------------------------------------------------
   * Watering-plan actions (per plant)
   * ------------------------------------------------------------- */
  generateWateringPlan(plantId: number): void {
    this.wateringPlanService.generateByUser(plantId).subscribe({
      next: (plan) => {
        this.wateringPlanIds[plantId] = plan.id;
        this.toastr.success('Watering plan generated successfully!');
      },
      error: (err) => {
        console.error('Error generating watering plan:', err);
        this.toastr.error('Error generating watering plan.');
      },
    });
  }

  downloadWateringPlanPDF(plantId: number): void {
    const planId = this.wateringPlanIds[plantId];

    if (!planId) {
      this.toastr.error(
        'No watering plan available. Please generate one first.',
      );
      return;
    }

    this.wateringPlanService.generatePDF(planId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `watering_plan_${planId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success('PDF downloaded successfully!');
      },
      error: (err:any) => {
        console.error('Error generating PDF:', err);
        this.toastr.error('Error generating PDF.');
      },
    });
  }
}
