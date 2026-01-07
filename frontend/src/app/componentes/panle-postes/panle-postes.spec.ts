import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanlePostes } from './panle-postes';

describe('PanlePostes', () => {
  let component: PanlePostes;
  let fixture: ComponentFixture<PanlePostes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanlePostes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanlePostes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
