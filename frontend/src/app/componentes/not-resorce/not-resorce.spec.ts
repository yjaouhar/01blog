import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotResorce } from './not-resorce';

describe('NotResorce', () => {
  let component: NotResorce;
  let fixture: ComponentFixture<NotResorce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotResorce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotResorce);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
