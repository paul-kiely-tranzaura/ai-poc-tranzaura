import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage.component';
import { AppointmentsComponent } from './appointments.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HomepageComponent, AppointmentsComponent],
  template: `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" role="banner">
    <div class="site-header-inner">
      <div class="brand">
        <a routerLink="/" class="brand-link">Fleet<span class="brand-accent">Hub</span></a>
      </div>
      <nav class="site-nav" role="navigation" aria-label="Main navigation">
        <a class="nav-link" routerLink="/">Home</a>
        <a class="nav-link" routerLink="/appointments">Appointments</a>
        <a class="nav-link" href="#docs">Docs</a>
      </nav>
    </div>
  </header>

  <main id="main">
    <router-outlet></router-outlet>
  </main>

  <footer class="site-footer" role="contentinfo">
    <div class="site-footer-inner">
      <p>© {{ year }} FleetHub — Built with care.</p>
    </div>
  </footer>
  `
})
export class AppComponent {
  year = new Date().getFullYear();
}
