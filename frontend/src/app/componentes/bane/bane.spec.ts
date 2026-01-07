import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bane } from './bane';

describe('Bane', () => {
  let component: Bane;
  let fixture: ComponentFixture<Bane>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bane]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bane);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
