import {DeepLinkingWrapperComponent} from './deep-linking-wrapper.component';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Component, Input, ViewContainerRef} from '@angular/core';
import {DeepLinkingRoute, DeepLinkingWrapperConfig} from './deep-linking-route.model';
import {Subject} from 'rxjs';

@Component({
  template: '',
})
class TestComponent {
  private _testPathParam!: number;

  @Input()
  get testPathParam(): number {
    return this._testPathParam;
  }

  set testPathParam(value: number) {
    this._testPathParam = value;
  }

  private _testQueryParam!: string;

  @Input()
  get testQueryParam(): string {
    return this._testQueryParam;
  }

  set testQueryParam(value: string) {
    this._testQueryParam = value;
  }

  private _complexQueryParam!: string;

  @Input()
  get complexQueryParam(): any {
    return this._complexQueryParam;
  }

  set complexQueryParam(value: any) {
    this._complexQueryParam = value;
  }
}

describe('RouterInputWrapperComponent', () => {
  let routerInputWrapperComponent: DeepLinkingWrapperComponent;

  let wrappedComponent: TestComponent;

  let activatedRouteMock: any;
  let routerMock: any;
  let paramChanges = new Subject<Params>();
  let queryParamChanges = new Subject<Params>();

  let componentFactoryResolverMock: any;
  let componentFactoryMock: any;
  let viewContainerRefMock: any;

  const testConfig: DeepLinkingWrapperConfig = {
    params: [
      {name: 'testPathParam', type: 'number'}
    ],
    queryParams: [
      {name: 'testQueryParam', type: 'string'},
      {name: 'complexQueryParam', type: 'json'}
    ],
  };

  let testRoute: DeepLinkingRoute = {
    path: 'test/:testPathParam',
    component: DeepLinkingWrapperComponent,
    wrappedComponent: TestComponent,
    deepLinking: testConfig,
  };

  beforeEach(() => {
    const activatedRouteSnapshotMock = {
      pathFromRoot: [testRoute],
      routeConfig: testRoute,
      params: {
        testPathParam: '1',
      },
      queryParams: {
        testQueryParam: 'initialQueryParam',
      },
    };

    activatedRouteMock = {
      snapshot: activatedRouteSnapshotMock,
      params: paramChanges,
      queryParams: queryParamChanges,
      routeConfig: testRoute,
    };

    routerMock = {
      navigateByUrl: jest.fn(),
    };

    componentFactoryMock = {};
    componentFactoryResolverMock = {
      resolveComponentFactory: jest.fn().mockReturnValue(componentFactoryMock),
    };

    wrappedComponent = new TestComponent();
    viewContainerRefMock = {
      clear: jest.fn(),
      createComponent: jest.fn().mockReturnValue({
        instance: wrappedComponent,
      }),
    };

    routerInputWrapperComponent = new DeepLinkingWrapperComponent(
      activatedRouteMock as unknown as ActivatedRoute,
      routerMock as unknown as Router,
      componentFactoryResolverMock,
      viewContainerRefMock as unknown as ViewContainerRef
    );

    routerInputWrapperComponent.ngOnInit();
  });

  it('should clear the view container', () => {
    expect(viewContainerRefMock.clear).toHaveBeenCalled();
  });

  it('should render the wrapped component', () => {
    expect(
      componentFactoryResolverMock.resolveComponentFactory
    ).toHaveBeenCalledWith(TestComponent);
    expect(viewContainerRefMock.createComponent).toHaveBeenCalledWith(
      componentFactoryMock
    );
  });

  describe('Path params', () => {
    it('should be used to populate component inputs initially', () => {
      expect(wrappedComponent.testPathParam).toBe(1);
    });

    it('should be used to sync component inputs on changes', () => {
      paramChanges.next({testPathParam: '2'});

      expect(wrappedComponent.testPathParam).toBe(2);
    });

    it('should not do anything if input and change are equal', () => {
      const setterSpy = jest.spyOn(wrappedComponent, 'testPathParam', 'set');
      paramChanges.next({testPathParam: '1'});

      expect(wrappedComponent.testPathParam).toBe(1);
      expect(setterSpy).not.toHaveBeenCalled();
    });

    it('should not be used for syncing any more after destroy', () => {
      routerInputWrapperComponent.ngOnDestroy();

      paramChanges.next({testPathParam: '2'});

      expect(wrappedComponent.testPathParam).toBe(1);
    });
  });

  describe('Query params', () => {
    it('should be used to populate component inputs', () => {
      expect(wrappedComponent.testQueryParam).toBe('initialQueryParam');
    });

    it('should be used to sync component inputs on changes', () => {
      queryParamChanges.next({testQueryParam: 'changedQueryParam'});

      expect(wrappedComponent.testQueryParam).toBe('changedQueryParam');
    });

    it('should not do anything if input and change are equal', () => {
      const setterSpy = jest.spyOn(wrappedComponent, 'testQueryParam', 'set');
      queryParamChanges.next({testQueryParam: 'initialQueryParam'});

      expect(wrappedComponent.testQueryParam).toBe('initialQueryParam');
      expect(setterSpy).not.toHaveBeenCalled();
    });

    it('should not be used for syncing any more after destroy', () => {
      routerInputWrapperComponent.ngOnDestroy();

      queryParamChanges.next({testQueryParam: 'changedQueryParam'});

      expect(wrappedComponent.testQueryParam).toBe('initialQueryParam');
    });

    it('should preserve the param type', () => {
      queryParamChanges.next({testQueryParam: 'changedQueryParam'});

      expect(wrappedComponent.testQueryParam).toBe('changedQueryParam');
    });
  });

  it('should support json object deep linking', () => {
    const complexObject = {key1: 'value', key2: 2};
    queryParamChanges.next({complexQueryParam: '{"key1": "value", "key2": 2}'});

    expect(wrappedComponent.complexQueryParam).toStrictEqual(complexObject);
  });
});
