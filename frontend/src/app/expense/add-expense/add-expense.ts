import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { BudgetService } from '../../budget.service';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import * as Tesseract from 'tesseract.js';
@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css'],
})
export class AddExpense implements OnInit {
  type: 'income' | 'expense' = 'expense';
  defaultCategories: string[] = [
    'Ruoka',
    'Asuminen',
    'Auto',
    'Viihde',
    'Terveys',
    'Vaatteet',
    'Harrastukset',
    'Muu',
  ];
  category: string = '';
  amount: number | null = null;
  note: string = '';

  // budjetti variable
  isBudgetEmpty: boolean = true;

  // OCR Variables
  isProcessing: boolean = false;
  ocrProgress: number = 0;
  private cdr = inject(ChangeDetectorRef);
  @ViewChild('fileInput') fileInput!: ElementRef;

  // Laajennettu sanakirja: mukana kaupat, yleiset tuotteet ja kanta-asiakastermit
  private categoryKeywords: { [key: string]: string[] } = {
    Ruoka: [
      // Kaupat
      'prisma',
      'citymarket',
      's-market',
      'k-supermarket',
      'k-market',
      'alepa',
      'sale',
      'lidl',
      'minimani',
      // Ravintolat
      'ravintola',
      'mcdonalds',
      'hesburger',
      'burger king',
      'subway',
      // Kanta-asiakkuudet
      'plussa',
      'plus säästösi',
      's-etukortti',
      'bonus',
      'pantti',
      'pullonpalautus',
      // Yleisimmät elintarvikkeet (jos kaupan nimi ei luettavissa)
      'maito',
      'leipä',
      'juusto',
      'kurkku',
      'tomaatti',
      'omaatti',
      'paprika',
      'margariini',
      'kana',
      'jauheliha',
      'peruna',
    ],
    Auto: [
      'neste',
      'abc',
      'teboil',
      'shell',
      'st1',
      'bensiini',
      'diesel',
      'polttoaine',
      'motonet',
      'biltema',
      'tankkaus',
    ],
    Terveys: ['apteekki', 'yli-opiston', 'terveystalo', 'mehiläinen', 'lääke', 'resepti'],
    Vaatteet: ['tokmanni', 'h&m', 'zara', 'halonen', 'kappahl', 'lindex', 'dressmann'],
    Asuminen: ['k-rauta', 'bauhaus', 'ikea', 'clas ohlson', 'jysk', 'rusta'],
  };

  constructor(
    private budget: BudgetService,
    private router: Router,
  ) {}

  checkIfBudgetExists() {
    this.budget.getBudgets().then((budgets) => {
      // Haetaan nykyinen kuukausi ja vuosi
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      //Tarkistetaan löytyykö listasta yhtään budjettia tälle kuukaudelle ja vuodelle
      const hasBudgetForThisMonth = budgets.some((b: any) => {
        const budgetDate = new Date(b.date);

        return budgetDate.getMonth() === currentMonth && budgetDate.getFullYear() === currentYear;
      });

      // Jos tälle kuulle löytyi budjetti, isBudgetEmpty on false. Muuten se on true.
      this.isBudgetEmpty = !hasBudgetForThisMonth;
    });
  }

  setType(type: 'income' | 'expense') {
    this.type = type;
  }

  // ---- OCR LOGIIKKA ALKAA ----
  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.isProcessing = true;
    this.ocrProgress = 0;

    try {
      const processedImageUrl = await this.preprocessImage(file);
      await this.runOCR(processedImageUrl);
    } catch (err) {
      console.error('Virhe kuvan skannauksessa:', err);
    } finally {
      this.isProcessing = false;
      if (this.fileInput) this.fileInput.nativeElement.value = ''; // Nollataan input
    }
  }

  private preprocessImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e: any) => (img.src = e.target.result);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.filter = 'grayscale(100%) contrast(300%)';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 1.0));
        }
      };
      reader.readAsDataURL(file);
    });
  }

  private async runOCR(imageUrl: string) {
    const result = await Tesseract.recognize(imageUrl, 'fin', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          this.ocrProgress = Math.round(m.progress * 100);
        }
      },
    });
    this.extractData(result.data.text);
  }

  private extractData(text: string) {
    // console.log('--- OCR RAAKATEKSTI ---');
    // console.log(text);
    // console.log('-----------------------');

    const lowerText = text.toLowerCase();
    let extractedAmount: number | null = null;

    // 1. LOPPUSUMMAN ETSINTÄ (Rivipohjainen taktiikka)
    const lines = text.split('\n'); // Jaetaan teksti riveihin
    const amountsOnKeywordLines: number[] = [];
    const allAmounts: number[] = [];

    for (const line of lines) {
      // Etsitään riviltä kaikki x,xx tai x.xx muotoiset luvut
      const priceMatches = line.match(/\b(\d{1,4})[\.\,](\d{2})\b/g);

      if (priceMatches) {
        for (const p of priceMatches) {
          const price = parseFloat(p.replace(',', '.'));
          allAmounts.push(price);

          // Jos samalla rivillä lukee EUR, FUR (OCR-virhe), YHT tai SUMMA
          if (/(yhteens[aä]|yht\.?|total|summa|maksettavaa|eur|fur)/i.test(line)) {
            amountsOnKeywordLines.push(price);
          }
        }
      }
    }

    // Valitaan oikea summa
    if (amountsOnKeywordLines.length > 0) {
      // Jos avainsanariveiltä löytyi summia, otetaan niistä suurin
      extractedAmount = Math.max(...amountsOnKeywordLines);
      console.log('Summa poimittiin avainsanariviltä:', extractedAmount);
    } else if (allAmounts.length > 0) {
      // Fallback: Jos avainsanoja ei löytynyt kertaakaan, otetaan kuitin suurin luku
      extractedAmount = Math.max(...allAmounts);
      console.log('Summa poimittiin kuitin isoimpana lukuna:', extractedAmount);
    }

    // Asetetaan summa lomakkeen muuttujaan
    if (extractedAmount) {
      this.amount = extractedAmount;
    } else {
      console.warn('Summaa ei pystytty päättelemättään kuitista.');
    }

    // 2. KATEGORIAN ETSINTÄ
    this.category = 'Muu';
    for (const [catName, keywords] of Object.entries(this.categoryKeywords)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        this.category = catName;
        break;
      }
    }

    // 3. Täytetään selite
    this.note = 'Lisätty kuitista automaattisesti.';

    // 4. PAKOTETAAN ANGULAR PÄIVITTÄMÄÄN NÄKYMÄ (Tärkeä!)
    this.cdr.detectChanges();
  }
  // ---- OCR LOGIIKKA PÄÄTTYY ----

  async save() {
    // Estetään negatiivisen summan tallennus
    if (this.amount === null || this.amount <= 0) {
      console.warn('Summa ei voi olla negatiivinen');
      return;
    }

    // Varmistetaan, että kategoria on valittu
    if (!this.category) {
      console.warn('Valitse kategoria');
      return;
    }
    try {
      await this.budget.addTransaction({
        id: crypto.randomUUID(),
        type: this.type,
        amount: this.amount,
        category: this.category,
        date: new Date(),
        note: this.note,
      });
      // redirektataan homeen
      this.router.navigate(['/home']);

      // reset
      this.amount = null;
      this.category = '';
      this.note = '';
    } catch (error) {
      console.error('Virhe kulun lisäämisessä:', error);
    }
  }
  ngOnInit() {
    this.checkIfBudgetExists();
  }
}
