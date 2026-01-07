import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanleBanned } from './panle-banned';

describe('PanleBanned', () => {
  let component: PanleBanned;
  let fixture: ComponentFixture<PanleBanned>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanleBanned]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanleBanned);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
