import { Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storage:any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private cookieService: CookieService) { 
    this.storage ;
  }

  isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }
  setItem(key: string, value: string): void {
    this.cookieService.set(key, value);
  }

  // Método para obter um cookie
  getItem(key: string): string | undefined {
    return this.cookieService.get(key);
  }

  deleteCookies(){
    this.cookieService.deleteAll()
  }

}
