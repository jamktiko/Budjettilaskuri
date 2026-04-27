import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeExpense } from './income-expense';

describe('IncomeExpense', () => {
  let component: IncomeExpense;
  let fixture: ComponentFixture<IncomeExpense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeExpense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeExpense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
