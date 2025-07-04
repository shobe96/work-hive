import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-tech-stack-step',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
  ],
  templateUrl: './tech-stack-step.component.html',
  styleUrl: './tech-stack-step.component.scss',
})
export class TechStackStepComponent {
  @Input() form!: FormGroup;

  languageFrameworks: { [key: string]: string[] } = {
    JavaScript: ['Angular', 'React', 'Vue'],
    TypeScript: ['Angular', 'React'],
    Java: ['Spring', 'Struts'],
    Python: ['Django', 'Flask'],
    'Node.js': ['Express'],
  };

  backendLanguages = ['Node.js', 'Python', 'Java'];

  onRoleChange(role: string) {
    const frontend = this.form.get('frontend');
    const backend = this.form.get('backend');

    // Always reset both groups
    frontend?.reset({ languages: [], frameworks: [] });
    backend?.reset({ languages: [], frameworks: [] });

    // Then apply enable/disable logic
    if (role === 'Frontend') {
      backend?.disable();
      frontend?.enable();
    } else if (role === 'Backend') {
      frontend?.disable();
      backend?.enable();
    } else {
      frontend?.enable();
      backend?.enable();
    }
  }

  getFrameworksFor(lang: string): string[] {
    return this.languageFrameworks[lang] || [];
  }
}
