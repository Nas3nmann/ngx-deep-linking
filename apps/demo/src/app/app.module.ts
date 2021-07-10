import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BookingComponent} from './booking/booking.component';
import {Route, RouterModule} from '@angular/router';

const routes: Route[] = [
  {
    path: 'bookings/:bookingId',
    component: BookingComponent
  }
];

@NgModule({
  declarations: [AppComponent, BookingComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
