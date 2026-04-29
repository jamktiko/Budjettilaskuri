import { Component, Input } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  templateUrl: './pie-chart.html',
})
export class PieChart {
  @Input() transactions: Transaction[] | null = [];
}
