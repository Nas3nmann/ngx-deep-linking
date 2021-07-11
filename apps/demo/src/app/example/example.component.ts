import {Component, Input} from '@angular/core';

@Component({
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {

  @Input()
  pathParam!: string;

  @Input()
  queryParam!: string;

}
