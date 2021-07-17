import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {

  private _pathParam!: string;

  get pathParam(): string {
    return this._pathParam;
  }

  @Input()
  set pathParam(value: string) {
    this._pathParam = value;
    this.pathParamChange.emit(value);
  }

  @Output()
  pathParamChange: EventEmitter<string> = new EventEmitter<string>();

  private _queryParam!: string;

  get queryParam(): string {
    return this._queryParam;
  }

  @Input()
  set queryParam(value: string) {
    this._queryParam = value;
    this.queryParamChange.emit(value);
  }

  @Output()
  queryParamChange: EventEmitter<string> = new EventEmitter<string>();

}
