import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterresadosComponent } from './interresados.component';

describe('InterresadosComponent', () => {
  let component: InterresadosComponent;
  let fixture: ComponentFixture<InterresadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterresadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterresadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
