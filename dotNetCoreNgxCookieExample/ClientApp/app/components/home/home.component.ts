import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent {
    public cookieData ='';
    public cookieKey = '';
    public cookieFromStorage = {};
    constructor(private _cookieService: CookieService) {
    }

    ngOnInit() {
        this.reloadCookieData();
    }

    public saveCookie(): void {
        const expireSeconds = 3600;
        const date = new Date(new Date().getTime() + expireSeconds * 1000);
        this._cookieService.put(this.cookieKey,this.cookieData, {expires: date});
    }

    public reloadCookieData(): void {
        this.cookieFromStorage = this._cookieService.getAll();
    }

}
