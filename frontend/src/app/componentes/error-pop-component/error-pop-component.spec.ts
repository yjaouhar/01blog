import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPopComponent } from './error-pop-component';

describe('ErrorPopComponent', () => {
  let component: ErrorPopComponent;
  let fixture: ComponentFixture<ErrorPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorPopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
