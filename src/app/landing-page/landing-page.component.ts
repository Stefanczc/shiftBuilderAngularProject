import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_LOGIN, ROUTE_REGISTER } from '../app-routing.module';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  backToTopVisible: boolean = false;
  @HostListener('window:scroll', [])
    onScroll() {
        this.showHideBackToTop();
    }

  constructor(
    private router: Router,
  ) { }
  

  navigateToLogin() {
    this.router.navigate([`/${ROUTE_LOGIN}`]);
  }

  navigateToRegister() {
    this.router.navigate([`/${ROUTE_REGISTER}`]);
  }

  showHideBackToTop() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.backToTopVisible = scrollPosition > 20;
  }

  scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  scrollToSection(sectionId: string) {
      const section = document.getElementById(sectionId);
      if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
      }
  }

}
