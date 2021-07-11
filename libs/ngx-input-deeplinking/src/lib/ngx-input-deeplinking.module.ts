import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterInputWrapperComponent} from './router-input-wrapper/router-input-wrapper.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule.forChild([])],
  declarations: [
    RouterInputWrapperComponent
  ],
})
export class NgxInputDeeplinkingModule {
}
