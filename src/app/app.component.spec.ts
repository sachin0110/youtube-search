import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

// Mock components for testing router outlet
@Component({
  selector: 'app-mock-login',
  standalone: true,
  template: '<div>Mock Login</div>',
})
export class MockLoginComponent {}

@Component({
  selector: 'app-mock-dashboard',
  standalone: true,
  template: '<div>Mock Dashboard</div>',
})
export class MockDashboardComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: MockLoginComponent },
          { path: 'dashboard', component: MockDashboardComponent },
          { path: '', redirectTo: 'login', pathMatch: 'full' },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a router outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });

  it('should navigate to login by default', async () => {
    await router.navigate(['']);
    fixture.detectChanges();
    expect(location.path()).toBe('/login');
  });
});
