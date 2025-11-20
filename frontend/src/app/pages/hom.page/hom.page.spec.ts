import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomPage } from './hom.page';

describe('HomPage', () => {
  let component: HomPage;
  let fixture: ComponentFixture<HomPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
