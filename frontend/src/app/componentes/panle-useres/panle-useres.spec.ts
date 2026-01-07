import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanleUseres } from './panle-useres';

describe('PanleUseres', () => {
  let component: PanleUseres;
  let fixture: ComponentFixture<PanleUseres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanleUseres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanleUseres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
