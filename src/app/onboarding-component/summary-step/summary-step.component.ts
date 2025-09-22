import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-summary-step',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatTableModule,
  ],
  templateUrl: './summary-step.component.html',
  styleUrl: './summary-step.component.scss',
})
export class SummaryStepComponent {
  /**
   * Input property containing the summary data to display.
   * Each item includes a label (e.g., "Email") and its corresponding value (e.g., "user@example.com").
   * Typically used to show a final review step before form submission.
   */
  @Input() summaryData!: { label: string; value: string }[];
}
