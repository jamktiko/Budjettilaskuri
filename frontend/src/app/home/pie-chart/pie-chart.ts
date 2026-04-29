import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.html',
})
export class PieChart {
  @Input() transactions: Transaction[] | null = [];

  // 🔥 group by category
  get grouped() {
    const data: { [key: string]: number } = {};

    (this.transactions || []).forEach((t) => {
      if (t.type === 'expense') {
        data[t.category] = (data[t.category] || 0) + t.amount;
      }
    });

    return Object.entries(data);
  }
}
