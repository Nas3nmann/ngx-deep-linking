import {Component, Input} from '@angular/core';

@Component({
  selector: 'jdrks-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {

  @Input()
  bookingId!: string;

}
