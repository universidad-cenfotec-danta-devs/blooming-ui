import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-admin-layout-component',
  imports: [CommonModule, RouterOutlet, MatSidenavModule, MatExpansionModule],
  templateUrl: './admin-layout-component.html',
  styleUrl: './admin-layout-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  readonly panelOpenState = signal(false);
}
