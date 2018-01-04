import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsComponent } from './maps.component';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

import { MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterTestingModule } from '@angular/router/testing';

import { SplitsService } from './splits.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('MapsComponent', () => {
  let component: MapsComponent;
  let fixture: ComponentFixture<MapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapsComponent, NavbarComponent, FooterComponent ],
      imports: [ MatSelectModule, FormsModule, RouterTestingModule, BrowserAnimationsModule ],
      providers: [ SplitsService, HttpClient, HttpHandler ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create the component', async(() => {
	 const fixture = TestBed.createComponent(MapsComponent);
	 const component = fixture.debugElement.componentInstance;
	 expect(component).toBeTruthy();
  }));*/
});
