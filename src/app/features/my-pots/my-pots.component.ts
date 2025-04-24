 import { Component, OnInit } from '@angular/core';
 import { finalize } from 'rxjs/operators';
 import { ToastrService } from 'ngx-toastr';
 import { Router } from '@angular/router';
 import { PotService } from '../../services/pot.service';
 import { Pot } from '../../interfaces/pot.interface';
 import { SHARED_IMPORTS } from '../../shared/shared.module';
 
 @Component({
   selector: 'app-my-pots',
   standalone: true,
   templateUrl: './my-pots.component.html',
   imports: [SHARED_IMPORTS],
 })
 export class MyPotsComponent implements OnInit {
   /* ───────────── Data & paging ───────────── */
   pots: Pot[] = [];
   page       = 1;
   pageSize   = 10;
   totalItems = 0;
 
   /* ───────────── UI state ─────────────────── */
   loading = false;
   error: string | null = null;
 
   constructor(
     private readonly potService: PotService,
     private readonly toastr: ToastrService,
     private readonly router: Router
   ) {}
 
   /* ═════════ lifecycle ═════════ */
   ngOnInit(): void {
     this.fetchPots();
   }
 
   /* ═════════ data helpers ══════ */
   private fetchPots(): void {
     this.loading = true;
     this.error   = null;
 
     this.potService
       .getPots(this.page - 1, this.pageSize)
       .pipe(finalize(() => (this.loading = false)))
       .subscribe({
         next: (resp) => {
           const asAny = resp as any;
           this.pots       = Array.isArray(resp) ? resp : asAny.data;
           this.totalItems =
             Array.isArray(resp)
               ? resp.length
               : asAny.meta?.totalElements ?? asAny.data.length;
         },
         error: (err) => {
           console.error(err);
           this.error = 'MY_POTS.ERROR';
         },
       });
   }
 
   trackByPotId(_: number, pot: Pot): number {
     return pot.id;
   }
 
   /* ═════════ pagination ════════ */
   get totalPages(): number {
     return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
   }
 
   goToPage(target: number): void {
     if (target < 1 || target === this.page) return;
     this.page = target;
     this.fetchPots();
   }
 
   /* ═════════ actions ═══════════ */
   /** Download the .glb for the given pot id. */
   downloadPotGLB(potId: number): void {
     const pot = this.pots.find((p) => p.id === potId);
 
     if (!pot?.fileUrl) {
       this.toastr.error('No GLB file available for this pot.');
       return;
     }
 
     fetch(pot.fileUrl)
       .then((res) => res.blob())
       .then((blob) => {
         const url  = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href     = url;
         link.download = `${pot.name || 'pot'}_${pot.id}.glb`;
         link.click();
         URL.revokeObjectURL(url);
       })
       .catch((err) => {
         console.error('GLB download error:', err);
         this.toastr.error('Failed to download GLB.');
       });
   }
 
   /** Navigate to the evaluation wizard for the selected pot. */
   goToEvaluation(potId: number): void {
     this.router.navigate(['/home/evaluation', 'pot', potId]);
   }
 }
 