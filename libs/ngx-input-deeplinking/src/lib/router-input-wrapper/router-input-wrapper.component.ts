import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  Type,
  ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {RouterInputWrapperConfig} from './router-input-wrapper-config.model';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  templateUrl: './router-input-wrapper.component.html'
})
export class RouterInputWrapperComponent implements OnInit, OnDestroy {

  private config!: RouterInputWrapperConfig;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly componentFactoryResolver: ComponentFactoryResolver,
              private readonly viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.config = this.readConfig();
    const componentRef = this.resolveAndRenderComponent(this.config.component);
    this.populateAndSyncComponentInputsWithPathParams(componentRef.instance, this.config.params);
    this.populateAndSyncComponentInputsWithQueryParams(componentRef.instance, this.config.queryParams);
  }

  private readConfig(): RouterInputWrapperConfig {
    const config: RouterInputWrapperConfig = this.activatedRoute.snapshot.data.ngxInputDeeplinkingConfig;
    if (!config || !config.component) {
      throw Error('Configuration for RouterInputWrapperComponent is missing in route data');
    }
    return config;
  }

  private resolveAndRenderComponent(component: Type<any>): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.viewContainerRef.clear();
    return this.viewContainerRef.createComponent(componentFactory);
  }

  private populateAndSyncComponentInputsWithPathParams(componentInstance: any, params: string[]): void {
    this.populateInputsFromParams(componentInstance, params, this.activatedRoute.snapshot.params);
    this.activatedRoute.params
      .pipe(untilDestroyed(this))
      .subscribe(changedParams => {
        this.populateInputsFromParams(componentInstance, params, changedParams);
      });
  }

  private populateAndSyncComponentInputsWithQueryParams(componentInstance: any, params: string[]): void {
    this.populateInputsFromParams(componentInstance, params, this.activatedRoute.snapshot.queryParams);
    this.activatedRoute.queryParams
      .pipe(untilDestroyed(this))
      .subscribe(changedParams => {
        this.populateInputsFromParams(componentInstance, params, changedParams);
      });
  }

  private populateInputsFromParams(componentInstance: any, inputNames: string[], params: Params) {
    for (let inputName of inputNames) {
      componentInstance[inputName] = params[inputName];
    }
  }

  ngOnDestroy(): void {
  }
}
