import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../shared/budget.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  constructor(public budget: BudgetService) {}
}
