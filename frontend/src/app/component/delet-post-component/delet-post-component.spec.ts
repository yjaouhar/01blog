import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletPostComponent } from './delet-post-component';

describe('DeletPostComponent', () => {
  let component: DeletPostComponent;
  let fixture: ComponentFixture<DeletPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
