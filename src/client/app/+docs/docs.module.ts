import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsComponent } from './docs.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DocsComponent],
  exports: [DocsComponent]
})
export class DocsModule { }