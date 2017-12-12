import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModuleShared } from './app.shared.module';
import { AppComponent } from './components/app/app.component';
import { CookieBackendService, CookieService } from 'ngx-cookie';

@NgModule({
    bootstrap: [ AppComponent ],
    imports: [
        ServerModule,
        AppModuleShared
    ],
    providers: [{ provide: CookieService, useClass: CookieBackendService }]
})
export class AppModule {
}
