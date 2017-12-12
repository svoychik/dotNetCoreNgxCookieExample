import 'reflect-metadata';
import 'zone.js';
import 'rxjs/add/operator/first';
import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode, ApplicationRef, NgZone, ValueProvider } from '@angular/core';
import { platformDynamicServer, PlatformState, INITIAL_CONFIG } from '@angular/platform-server';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import { AppModule } from './app/app.server.module';

enableProdMode();

export function convertDictToString(cookieDict: Array<{key:string, value:string}>) : string {
    let cookieString: string = '';
    for (let cookie of cookieDict) {
        cookieString += `${cookie.key}=${cookie.value}; `;
    }
    return cookieString;
  }

export function getRequest(params: any) {
    const { cookie = [] as Array<{key:string, value:string}> } = { cookie: params.data.cookies };
    const cookieString: string = convertDictToString(cookie);
    const req: any = {
        'headers': {
            'cookie': cookieString
        }
    };
    return req;
  }

  export function getResponse(params: any) {
    const { cookie = [] as Array<{key:string, value:string}> } = { cookie: params.data.cookies };
    const cookieString: string = convertDictToString(cookie);
    const res: any = {
        'headers': {
            'cookie': cookieString
        }
    };
    return res;
  }
export default createServerRenderer(params => {
    const req = getRequest(params);
    const res = getResponse(params);
    const providers = [
        { provide: INITIAL_CONFIG, useValue: { document: '<app></app>', url: params.url } },
        { provide: APP_BASE_HREF, useValue: params.baseUrl },
        { provide: 'BASE_URL', useValue: params.origin + params.baseUrl },
        { provide: 'REQUEST', useValue: req },
        { provide: 'RESPONSE', useValue: res }
    ];

    return platformDynamicServer(providers).bootstrapModule(AppModule).then(moduleRef => {
        const appRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
        const state = moduleRef.injector.get(PlatformState);
        const zone = moduleRef.injector.get(NgZone);

        return new Promise<RenderResult>((resolve, reject) => {
            zone.onError.subscribe((errorInfo: any) => reject(errorInfo));
            appRef.isStable.first(isStable => isStable).subscribe(() => {
                // Because 'onStable' fires before 'onError', we have to delay slightly before
                // completing the request in case there's an error to report
                setImmediate(() => {
                    resolve({
                        html: state.renderToString()
                    });
                    moduleRef.destroy();
                });
            });
        });
    });
});
