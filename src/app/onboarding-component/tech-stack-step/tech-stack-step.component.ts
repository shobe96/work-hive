import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormUtilsService } from '../form-utils.service';

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

  private formUtils = inject(FormUtilsService);

  languageFrameworks: { [key: string]: string[] } = {
    JavaScript: ['Angular', 'React', 'Vue'],
    TypeScript: ['Angular', 'React'],
    Java: ['Spring', 'Struts'],
    Python: ['Django', 'Flask'],
    'Node.js': ['Express'],
  };

  backendLanguages = ['Node.js', 'Python', 'Java'];

  onRoleChange(role: string) {
    const frontend = this.form.get('frontend') as FormGroup;
    const backend = this.form.get('backend') as FormGroup;

    this.formUtils.updateControls(frontend, 'reset', {
      languages: [],
      frameworks: [],
    });
    this.formUtils.updateControls(backend, 'reset', {
      languages: [],
      frameworks: [],
    });

    if (role === 'Frontend') {
      this.formUtils.updateControls(backend, 'disable');
      this.formUtils.updateControls(frontend, 'enable');
    } else if (role === 'Backend') {
      this.formUtils.updateControls(frontend, 'disable');
      this.formUtils.updateControls(backend, 'enable');
    } else {
      this.formUtils.updateControls(frontend, 'enable');
      this.formUtils.updateControls(backend, 'enable');
    }
  }

  getFrameworksFor(lang: string): string[] {
    return this.languageFrameworks[lang] || [];
  }
}
