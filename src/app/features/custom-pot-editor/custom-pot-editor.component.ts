
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { PotEditorService } from '../../services/pot-editor.service';
import { PotService } from '../../services/pot.service';
import { CustomPot } from '../../models/custom-pot.model';

/** Option helper for the select. */
interface PotOption {
  label: string;   // what the user sees
  url: string;     // absolute/relative GLB
  isDefault: boolean;
  
  
}

@Component({
  selector: 'app-custom-pot-editor',
  standalone: true,
  templateUrl: './custom-pot-editor.component.html',
  styleUrls: ['./custom-pot-editor.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
})
export class CustomPotEditorComponent implements OnInit, AfterViewInit {
  /* ─── DOM refs ─────────────────────────────────────────────── */
  @ViewChild('editorCanvas') editorCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  /* ─── Wizard steps ─────────────────────────────────────────── */
  steps = ['Material', 'Size', 'Color', 'Name'];
  private _step = 0;
  get step(): number {
    return this._step;
  }

  /* ─── Reactive form ────────────────────────────────────────── */
  potForm!: FormGroup;

  /* ─── Drop-down data ───────────────────────────────────────── */
  modelList: PotOption[] = [
    { label: 'pot.glb',  url: 'assets/models/pot.glb',  isDefault: true },
    { label: 'pot2.glb', url: 'assets/models/pot2.glb', isDefault: true },
    { label: 'pot3.glb', url: 'assets/models/pot3.glb', isDefault: true },
  ];
  selectedModel: PotOption = this.modelList[0];

  /* ─── Misc state ───────────────────────────────────────────── */
  price?: number;
  customPotName = '';
  loadingEditor = false;
  submitting = false;
  editorLoadError: string | null = null;
  readonly isBrowser: boolean;

  /* ─── DI ───────────────────────────────────────────────────── */
  constructor(
    private fb: FormBuilder,
    private potEditorService: PotEditorService,
    private potService: PotService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) platformId: object,
    private cd: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /* ═════════════════════════════════════════════════════════════
     Lifecycle
     ═══════════════════════════════════════════════════════════ */
  ngOnInit(): void {
    this.potForm = this.fb.group({
      material: ['', Validators.required],
      size: [10, [Validators.required, Validators.min(6), Validators.max(100)]],
      color: ['', Validators.required],
    });

    /* Live preview */
    this.potForm.valueChanges.subscribe((val: CustomPot) => {
      if (this.isBrowser) this.potEditorService.update3DModel(val);
    });

    /* Pull user pots once */
    this.potService
      .getPots(0, 30)
      .pipe(
        tap((pots) => console.log('[CustomPotEditor] user pots:', pots)),
      )
      .subscribe({
        next: (pots) => {
          const userOpts: PotOption[] = pots.map((p) => ({
            label: p.name,
            url: p.fileUrl,
            isDefault: false,
          }));
          const seen = new Set(this.modelList.map((o) => o.url));
          userOpts.forEach((o) => !seen.has(o.url) && this.modelList.push(o));
        },
        error: (err) =>
          console.error('[CustomPotEditor] getPots failed:', err),
      });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) this.initThree();
  }

  /* ═════════════════════════════════════════════════════════════
     Convenience getters
     ═══════════════════════════════════════════════════════════ */
  get allStepsDone(): boolean {
    return this.potForm.valid && this.customPotName.trim().length > 0;
  }
  get canCalculate(): boolean {
    return this.allStepsDone && !this.submitting;
  }
  get canConfirm(): boolean {
    return this.allStepsDone && !this.submitting && this.step === 3;
  }

  /* ═════════════════════════════════════════════════════════════
     Three-JS editor
     ═══════════════════════════════════════════════════════════ */
  private initThree(): void {
    this.loadingEditor = true;
    this.editorLoadError = null;

    this.potEditorService.load3DEditor(this.editorCanvas.nativeElement).subscribe({
      next: () => {
        this.loadingEditor = false;
        this.potEditorService.update3DModel(this.potForm.value);
        this.cd.detectChanges();
      },
      error: (err) => {
        this.editorLoadError = 'Error loading 3-D editor: ' + err.message;
        this.loadingEditor = false;
        this.cd.detectChanges();
      },
    });
  }

  /* ═════════════════════════════════════════════════════════════
     Wizard helpers
     ═══════════════════════════════════════════════════════════ */
  setStep(i: number): void {
    this._step = i;
  }

  /* ═════════════════════════════════════════════════════════════
     File / model loading
     ═══════════════════════════════════════════════════════════ */
  onFileSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!(input.files?.length)) return;

    const file = input.files[0];
    this.potEditorService.loadModelFromFile(file).subscribe({
      error: (err) => {
        this.editorLoadError = 'Error loading model: ' + err.message;
        this.toastr.error('Error loading model.');
      },
    });
  }

  loadSelectedModel(): void {
    if (!this.isBrowser) return;
    this.potEditorService.loadModel(this.selectedModel.url).subscribe({
      error: (err) => {
        this.editorLoadError = 'Error loading model: ' + err.message;
        this.toastr.error('Error loading model.');
      },
    });
  }

  preventNegative(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (+input.value < 1) {
      input.value = '1';
      this.potForm.get('size')!.setValue(1);
    }
  }

  /* ═════════════════════════════════════════════════════════════
     Price + Upload
     ═══════════════════════════════════════════════════════════ */
  calculatePrice(): void {
    if (!this.canCalculate) return;
    this.potEditorService
      .calculatePrice(this.potForm.value as CustomPot)
      .subscribe({
        next: (p) => (this.price = p),
        error: () => this.toastr.error('Error calculating price.'),
      });
  }

  submitPot(): void {
    if (!this.canConfirm) return;
    this.submitting = true;

    const attrs = this.potForm.value as CustomPot;
    const name = this.customPotName.trim();

    this.potEditorService.calculatePrice(attrs).subscribe({
      next: (price) => {
        this.potEditorService.exportCurrentModel().subscribe({
          next: (blob) => {
            const file = new File([blob], 'customPot.glb', {
              type: 'model/gltf-binary',
            });

            this.potService
              .uploadPot(
                {
                  name,
                  description: `Material: ${attrs.material}, Size: ${attrs.size}, Color: ${attrs.color}`,
                  price,
                },
                file,
              )
              .subscribe({
                next: () => {
                  this.toastr.success('Pot uploaded!');
                  this.refreshDropdown();
                },
                error: () => {
                  this.toastr.error('Upload failed.');
                  this.submitting = false;
                },
              });
          },
          error: () => {
            this.toastr.error('Export failed.');
            this.submitting = false;
          },
        });
      },
      error: () => {
        this.toastr.error('Price calculation failed.');
        this.submitting = false;
      },
    });
  }

  /** Refresh list after successful upload. */
  private refreshDropdown(): void {
    this.potService.getPots(0, 30).subscribe({
      next: (pots) => {
        const userOpts = pots.map((p) => ({
          label: p.name,
          url: p.fileUrl,
          isDefault: false,
        }));
        const seen = new Set(this.modelList.map((o) => o.url));
        userOpts.forEach((o) => !seen.has(o.url) && this.modelList.push(o));
        this.submitting = false;
      },
      error: () => {
        this.toastr.error('Error updating list.');
        this.submitting = false;
      },
    });
  }
}
