import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confermation } from './confermation';

describe('Confermation', () => {
  let component: Confermation;
  let fixture: ComponentFixture<Confermation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confermation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Confermation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
