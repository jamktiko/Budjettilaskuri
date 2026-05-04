import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addbudget } from './addbudget';

describe('Addbudget', () => {
  let component: Addbudget;
  let fixture: ComponentFixture<Addbudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addbudget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addbudget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
