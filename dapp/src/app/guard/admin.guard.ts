import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { resolve } from 'dns';
import { Observable } from 'rxjs';
import { LibroNFTService } from '../services/libroNFT/libro-nft.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private libroNFTService: LibroNFTService,
    private router: Router
  ) {

  }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const librarian = await this.isLibrarian();
    if (librarian) {
      return true;
    }

    this.router.navigateByUrl("/");
    return false;
  }

  async isLibrarian(): Promise<boolean> {
    return await this.libroNFTService.isLibrarian();
  }
}
