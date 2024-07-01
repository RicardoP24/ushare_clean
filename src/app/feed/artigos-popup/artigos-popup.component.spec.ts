import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtigosPopupComponent } from './artigos-popup.component';

describe('ArtigosPopupComponent', () => {
  let component: ArtigosPopupComponent;
  let fixture: ComponentFixture<ArtigosPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtigosPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtigosPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
