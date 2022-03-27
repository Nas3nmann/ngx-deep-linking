import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeepLinkingWrapperComponent } from './router-input-wrapper/deep-linking-wrapper.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule.forChild([])],
  declarations: [DeepLinkingWrapperComponent],
})
export class NgxDeepLinkingModule {}
