import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanleReportes } from './panle-reportes';

describe('PanleReportes', () => {
  let component: PanleReportes;
  let fixture: ComponentFixture<PanleReportes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanleReportes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanleReportes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
