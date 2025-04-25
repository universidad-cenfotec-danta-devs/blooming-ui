/*------------------------------------------------------------------
  Component : PotsShopComponent
  Shows a gallery of pots with miniature 3-D previews (ThreePotCardComponent),
  paginated 8 items per page.  “Add to cart” is stubbed for future use.
 ------------------------------------------------------------------*/
 import { Component, OnInit } from '@angular/core';
 import { PotService } from '../../../services/pot.service';
 import { Pot } from '../../../interfaces/pot.interface';
 import { SHARED_IMPORTS } from '../../../shared/shared.module';
 import { ThreePotCardComponent } from '../3d-pot/three-pot-card.component';
 import { ToastrService } from 'ngx-toastr';
 import { Router } from '@angular/router';
 
 @Component({
   selector: 'app-pots-shop',
   standalone: true,
   imports: [SHARED_IMPORTS, ThreePotCardComponent],
   templateUrl: './pots-shop.component.html',
 })
 export class PotsShopComponent implements OnInit {
   /* ---------- UI state ---------- */
   loading = false;
   error: string | null = null;
 
   /* ---------- Data & paging ----- */
   private allPots: Pot[] = [];
   page     = 1;
   readonly pageSize = 8;
 
   /** Pots for the current page (derived from `allPots`). */
   get pagedPots(): Pot[] {
     const start = (this.page - 1) * this.pageSize;
     return this.allPots.slice(start, start + this.pageSize);
   }
 
   get totalPages(): number {
     return Math.max(1, Math.ceil(this.allPots.length / this.pageSize));
   }
 
   constructor(
     private readonly potService: PotService,
     private readonly toastr: ToastrService,
     private readonly router: Router
   ) {}
 
   /* =================================================================
      Lifecycle
      ================================================================= */
   ngOnInit(): void {
     this.fetchPots();
   }
 
   /* =================================================================
      Data helpers
      ================================================================= */
   private fetchPots(): void {
     this.loading = true;
     this.error   = null;
 
     // Server already paginates; we request plenty and paginate client-side
     this.potService.getPots(0, 100).subscribe({
       next: (pots) => {
         this.allPots = pots;
         this.loading = false;
       },
       error: (err) => {
         console.error('[PotsShop] getPots error:', err);
         this.error = 'POT_GALLERY.ERROR';
         this.loading = false;
       }
     });
   }
 
   /* =================================================================
      Pagination helpers
      ================================================================= */
   goToPage(target: number): void {
     if (target < 1 || target === this.page || target > this.totalPages) {
       return;
     }
     this.page = target;
     window.scrollTo({ top: 0, behavior: 'smooth' });
   }
 
   /* =================================================================
      Cart (stub)
      ================================================================= */
   addToCart(pot: Pot): void {
     // TODO: integrate with cart service
     this.toastr.success(`«${pot.name}» added to cart`);
   }

 }
 