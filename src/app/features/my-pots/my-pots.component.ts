/*------------------------------------------------------------------
  Displays the user’s pots in a paginated table.
  New: small GLB preview per row (ThreePotCardComponent in “compact”
  mode – no buttons, no auto-rotate).
------------------------------------------------------------------*/
import { Component, OnInit } from '@angular/core';
import { finalize }            from 'rxjs/operators';
import { ToastrService }       from 'ngx-toastr';
import { Router }              from '@angular/router';

import { PotService }          from '../../services/pot.service';
import { Pot }                 from '../../interfaces/pot.interface';

import { SHARED_IMPORTS }      from '../../shared/shared.module';
import { ThreePotCardComponent } from '../pots-shop/3d-pot/three-pot-card.component';

@Component({
  selector   : 'app-my-pots',
  standalone : true,
  templateUrl: './my-pots.component.html',
  imports    : [SHARED_IMPORTS, ThreePotCardComponent]
})
export class MyPotsComponent implements OnInit {

  /* ───── data & paging ───── */
  pots: Pot[] = [];
  page       = 1;
  pageSize   = 10;
  totalItems = 0;

  /* ───── UI state ────────── */
  loading = false;
  error: string | null = null;

  constructor(
    private readonly potService: PotService,
    private readonly toastr     : ToastrService,
    private readonly router     : Router
  ) {}

  /* ───── lifecycle ───────── */
  ngOnInit(): void { this.fetchPots(); }

  /* ───── data helpers ────── */
  private fetchPots(): void {
    this.loading = true;
    this.error   = null;

    this.potService
      .getPots(this.page - 1, this.pageSize)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next : (resp) => {
          /* API might return plain array or wrapped in {data:[],meta:{}} */
          const list = Array.isArray(resp) ? resp : (resp as any).data;
          this.pots       = list;
          this.totalItems = Array.isArray(resp)
            ? resp.length
            : (resp as any).meta?.totalElements ?? list.length;
        },
        error: (err) => {
          console.error(err);
          this.error = 'MY_POTS.ERROR';
        }
      });
  }

  trackByPotId(_: number, pot: Pot): number { return pot.id; }

  /* ───── pagination ──────── */
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }
  goToPage(target: number): void {
    if (target < 1 || target === this.page || target > this.totalPages) return;
    this.page = target;
    this.fetchPots();
  }

  /* ───── actions ─────────── */
  downloadPotGLB(id: number): void {
    const pot = this.pots.find(p => p.id === id);
    if (!pot?.fileUrl) {
      this.toastr.error('No GLB file available for this pot.');
      return;
    }
    const link = document.createElement('a');
    link.href      = pot.fileUrl;
    link.download  = `${pot.name || 'pot'}_${pot.id}.glb`;
    link.rel       = 'noopener';
    link.target    = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  goToEvaluation(id: number): void {
    this.router.navigate(['/home/evaluation', 'pot', id]);
  }
}
