import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="app-container">
      <nav class="navbar">
        <div class="nav-content">
          <a routerLink="/extractor" class="logo">Text Extractor</a>
          <div class="nav-links">
            <a routerLink="/extractor" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">Extractor</a>
            <a routerLink="/about" routerLinkActive="active">About</a>
          </div>
        </div>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .navbar {
      background-color: rgba(255, 255, 255, 0.95);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 0;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5em;
      font-weight: bold;
      color: #667eea;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .logo:hover {
      color: #764ba2;
    }

    .nav-links {
      display: flex;
      gap: 25px;
      align-items: center;
    }

    .nav-links a {
      color: #555;
      text-decoration: none;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .nav-links a:hover {
      background-color: #f0f0f0;
      color: #667eea;
    }

    .nav-links a.active {
      background-color: #667eea;
      color: white;
    }

    .main-content {
      flex: 1;
      padding: 20px 0;
    }

    @media (max-width: 768px) {
      .nav-content {
        flex-direction: column;
        gap: 15px;
      }

      .nav-links {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class AppComponent {
}

