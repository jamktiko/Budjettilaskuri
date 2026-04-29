import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrls: ['./summary.css'],
})
export class Summary {
  @Input() balance: number | null = 0;
  @Input() income: number | null = 0;
  @Input() expenses: number | null = 0;
}
