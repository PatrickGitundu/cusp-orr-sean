import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsComponent } from './results.component';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

import { RouterTestingModule } from '@angular/router/testing';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsComponent, NavbarComponent, FooterComponent ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', async(() => {
		 const fixture = TestBed.createComponent(ResultsComponent);
		 const component = fixture.debugElement.componentInstance;
		 expect(component).toBeTruthy();
	  }));
  /*it('should render Results works in a h1 tag', async(() => {
	    const fixture = TestBed.createComponent(ResultsComponent);
	    fixture.detectChanges();
	    const compiled = fixture.debugElement.nativeElement;
	    expect(compiled.querySelector('h3').textContent).toContain('Results');
	  }));*/
});
