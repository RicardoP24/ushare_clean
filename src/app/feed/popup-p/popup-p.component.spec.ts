import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupPComponent } from './popup-p.component';

describe('PopupPComponent', () => {
  let component: PopupPComponent;
  let fixture: ComponentFixture<PopupPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupPComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
