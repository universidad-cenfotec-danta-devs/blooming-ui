import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { CustomPotEditorComponent } from '../custom-pot-editor/custom-pot-editor.component';

@Component({
  selector: 'app-pot-editor-page',
  templateUrl: './pot-editor-page.component.html',
  styleUrls: ['./pot-editor-page.component.css'] ,
  standalone:true,
  imports: [SHARED_IMPORTS, CustomPotEditorComponent],
})
export class PotEditorPageComponent { }
