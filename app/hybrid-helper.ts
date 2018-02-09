import { FactoryProvider } from '@angular/core';
import { downgradeComponent as downComp, downgradeInjectable } from '@angular/upgrade/static';
import * as angular from 'angular';

export interface IComponentUpgradeOptions {
  inputs?: string[];
  outputs?: string[];
}

export interface IHybridHelper {
  downgradeComponent(moduleName: string, componentSelector: string, componentClass: any, options?: IComponentUpgradeOptions): IHybridHelper;
  downgradeProvider(moduleName: string, providerName: string, providerClass: any): IHybridHelper;
  buildProviderForUpgrade(ng1Name: string, ng2Name?: string): FactoryProvider;
}

class HybridHelper implements IHybridHelper {
  private buildFactoryForUpgradeProvider(ng1Name: string): Function {
    return (injector: any) => injector.get(ng1Name);
  }

  downgradeComponent(
      moduleName: string,
      componentName: string,
      componentClass: any,
      options: IComponentUpgradeOptions = {}): IHybridHelper {
    const inputs = options.inputs || [];
    const outputs = options.outputs || [];
    const component = componentClass;

    angular.module(moduleName).directive(componentName, downComp({ component, inputs, outputs }) as angular.IDirectiveFactory);

    return this;
  }

  downgradeProvider(moduleName: string, providerName: string, providerClass: any): IHybridHelper {
    angular.module(moduleName).factory(providerName, downgradeInjectable(providerClass));

    return this;
  }

  buildProviderForUpgrade(ng1Name: string, ng2Name?: string): FactoryProvider {
    return {
      provide: ng2Name || ng1Name,
      useFactory: this.buildFactoryForUpgradeProvider(ng1Name),
      deps: ['$injector'],
    };
  }
}

const helper = new HybridHelper();

export default helper;
