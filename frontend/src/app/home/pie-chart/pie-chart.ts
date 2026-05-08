// pie-chart/pie-chart.ts
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Rekisteröidään Chart.js komponentit
Chart.register(...registerables);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.html',
  styleUrls: ['./pie-chart.css'],
})
export class PieChartComponent implements OnChanges, AfterViewInit {
  // Otetaan data vastaan home-komponentilta
  @Input() transactions: any[] = [];

  // Haetaan canvas-elementti HTML:stä
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart | undefined;

  // Tämä ajetaan aina kun @Input() data muuttuu (esim. kun getTransactions() valmistuu)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions'] && this.transactions.length > 0) {
      this.updateChart();
    }
  }

  // Varmistetaan, että näkymä on ladattu ennen kaavion piirtoa
  ngAfterViewInit(): void {
    if (this.transactions.length > 0) {
      this.updateChart();
    }
  }

  updateChart(): void {
    // 1. Suodatetaan vain menot ja ryhmitellään ne kategorioittain
    // Oletuksena on, että objektissasi on kentät 'type', 'category' ja 'amount'
    const expenses = this.transactions.filter((t) => t.type === 'expense');

    const categoryTotals = expenses.reduce(
      (acc, current) => {
        // Jos kategoriaa ei ole olemassa, luodaan se nimellä 'Muu'
        const category = current.category || 'Muu';

        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += current.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    // 2. Erotellaan ryhmitellystä datasta nimikkeet (labels) ja arvot (data)
    const labels = Object.keys(categoryTotals);
    const dataValues = Object.values(categoryTotals) as number[];

    // 3. Tuhotaan vanha kaavio, jotta päällekkäisyyksiä ei synny dataa päivitettäessä
    if (this.chart) {
      this.chart.destroy();
    }

    // Jos dataa ei ole piirrettäväksi, keskeytetään
    if (labels.length === 0) return;

    // 4. Luodaan uusi Chart.js instanssi
    const ctx = this.pieCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Menot kuluina (€)',
            data: dataValues,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#C9CBCF', // Lisää värejä tarvittaessa
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              // Formatoidaan tooltip näyttämään eurot oikein
              label: function (context): any {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed !== null) {
                  label += context.parsed.toFixed(2) + ' €';
                }
                return label;
              },
            },
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }
}
