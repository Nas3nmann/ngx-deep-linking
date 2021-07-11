import {RouterInputWrapperComponent} from './router-input-wrapper.component';
import {ActivatedRoute, Params} from '@angular/router';
import {Component, Input, ViewContainerRef} from '@angular/core';
import {RouterInputWrapperConfig} from './router-input-wrapper-config.model';
import {Subject} from 'rxjs';

@Component({
  template: ''
})
class TestComponent {
  @Input() testPathParam!: string;
  @Input() testQueryParam!: string;
}

describe('RouterInputWrapperComponent', () => {

  let routerInputWrapperComponent: RouterInputWrapperComponent;

  let wrappedComponent: TestComponent;

  let activatedRouteMock: any;
  let paramChanges = new Subject<Params>();
  let queryParamChanges = new Subject<Params>();

  let componentFactoryResolverMock: any;
  let componentFactoryMock: any;
  let viewContainerRefMock: any;

  const testConfig: RouterInputWrapperConfig = {
    component: TestComponent,
    params: [
      'testPathParam'
    ],
    queryParams: [
      'testQueryParam'
    ]
  }

  beforeEach(() => {
    const activatedRouteSnapshotMock = {
      data: {
        ngxInputDeeplinkingConfig: testConfig
      },
      params: {
        testPathParam: 'initialPathParam'
      },
      queryParams: {
        testQueryParam: 'initialQueryParam'
      }
    }

    activatedRouteMock = {
      snapshot: activatedRouteSnapshotMock,
      params: paramChanges,
      queryParams: queryParamChanges
    };

    componentFactoryMock = {};
    componentFactoryResolverMock = {
      resolveComponentFactory: jest.fn().mockReturnValue(componentFactoryMock)
    };

    wrappedComponent = new TestComponent();
    viewContainerRefMock = {
      clear: jest.fn(),
      createComponent: jest.fn().mockReturnValue({
        instance: wrappedComponent
      })
    }

    routerInputWrapperComponent = new RouterInputWrapperComponent(
      activatedRouteMock as unknown as ActivatedRoute,
      componentFactoryResolverMock,
      viewContainerRefMock as unknown as ViewContainerRef
    );

    routerInputWrapperComponent.ngOnInit();
  });

  it('should clear the view container', () => {
    expect(viewContainerRefMock.clear).toHaveBeenCalled();
  });

  it('should render the wrapped component', () => {
    expect(componentFactoryResolverMock.resolveComponentFactory).toHaveBeenCalledWith(TestComponent);
    expect(viewContainerRefMock.createComponent).toHaveBeenCalledWith(componentFactoryMock);
  });

  describe('Path params', () => {
    it('should be used to populate component inputs initially', () => {
      expect(wrappedComponent.testPathParam).toBe('initialPathParam');
    });

    it('should be used to sync component inputs on changes', () => {
      paramChanges.next({testPathParam: 'changedPathParam'});

      expect(wrappedComponent.testPathParam).toBe('changedPathParam');
    });

    it('should not be used for syncing any more after destroy', () => {
      routerInputWrapperComponent.ngOnDestroy();

      paramChanges.next({testPathParam: 'changedPathParam'});

      expect(wrappedComponent.testPathParam).toBe('initialPathParam');
    });
  });

  describe('Query params', () => {
    it('should be used to populate component inputs', () => {
      expect(wrappedComponent.testQueryParam).toBe('initialQueryParam');
    });

    it('should be used to sync component inputs', () => {
      queryParamChanges.next({testQueryParam: 'changedQueryParam'});

      expect(wrappedComponent.testQueryParam).toBe('changedQueryParam');
    });

    it('should not be used for syncing any more after destroy', () => {
      routerInputWrapperComponent.ngOnDestroy();

      queryParamChanges.next({testQueryParam: 'changedQueryParam'});

      expect(wrappedComponent.testQueryParam).toBe('initialQueryParam');
    });
  });
});
