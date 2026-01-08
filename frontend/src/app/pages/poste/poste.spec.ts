import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Poste } from './poste';

describe('Poste', () => {
  let component: Poste;
  let fixture: ComponentFixture<Poste>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Poste]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Poste);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
