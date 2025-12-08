import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditePostComponent } from './edite-post-component';

describe('EditePostComponent', () => {
  let component: EditePostComponent;
  let fixture: ComponentFixture<EditePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditePostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
