import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  computed,
  signal,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  LANGUAGE_FRAMEWORKS,
  BACKEND_LANGUAGES,
  FRONTEND_LANGUAGES,
} from './tech-stack.config';
import { FormUtilsService } from '../form-utils.service';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { STEP4_VALIDATORS } from '../step4-validator-config';

@Component({
  selector: 'app-tech-stack-step',
  standalone: true,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechStackStepComponent implements OnInit {
  // Parent form group passed from the onboarding component
  @Input({ required: true }) form!: FormGroup;

  // Store the previously selected role to compare with changes
  private previousRole: string | null = null;

  // Inject utility services
  private formUtils = inject(FormUtilsService);
  private cd = inject(ChangeDetectorRef);

  // ==== Static Tech Stack Data ====

  // Mapping of languages to their corresponding frameworks
  readonly languageFrameworks = LANGUAGE_FRAMEWORKS;

  // Lists of available languages for each tech stack
  readonly backendLanguages = BACKEND_LANGUAGES;
  readonly frontendLanguages = FRONTEND_LANGUAGES;

  // ==== Signals for Reactive Form Handling ====

  // Currently selected role ('Frontend', 'Backend', 'Fullstack', etc.)
  readonly role = signal<string>('');

  // Selected languages for each stack
  readonly frontendLangs = signal<string[]>([]);
  readonly backendLangs = signal<string[]>([]);

  // Computed: is frontend development role selected?s
  readonly isFrontendSelected = computed(() => {
    const r = this.role();
    return r === 'Frontend' || r === 'Fullstack';
  });

  // Computed: is backend development role selected?
  readonly isBackendSelected = computed(() => {
    const r = this.role();
    return r === 'Backend' || r === 'Fullstack';
  });

  // Computed: returns frameworks based on selected frontend languages
  readonly frontendFrameworks = computed(() => {
    return this.getFrameworksFromLangs(this.frontendLangs());
  });

  // Computed: returns frameworks based on selected backend languages
  readonly backendFrameworks = computed(() => {
    return this.getFrameworksFromLangs(this.backendLangs());
  });

  // Computed: whether a role has been selected
  readonly hasSelectedRole = computed(() => !!this.role());

  ngOnInit(): void {
    const roleControl = this.form.get('role');

    if (roleControl) {
      const currentRole = roleControl.value || '';
      this.previousRole = currentRole;

      // Initialize role signal and apply role validators
      this.role.set(currentRole);
      this.formUtils.setCustomValidators(this.form, {
        role: STEP4_VALIDATORS.role,
      });

      // Perform initial role-based control setup
      this.formUtils.handleRoleChange(this.form, currentRole, null);

      // Optional: mark form as touched/dirty to force validation feedback immediately
      // this.formUtils.markAsTouchedAndDirty(this.form);
    }

    // Watch role and language selections
    this.setupRoleWatcher();
    this.setupLangWatchers();

    // Ensure UI is updated after form control changes
    this.cd.detectChanges();
  }

  /**
   * Watches the 'role' form control for changes and reacts accordingly:
   * - Updates the internal signal
   * - Resets fields based on new role
   * - Applies or removes validators dynamically
   */
  private setupRoleWatcher(): void {
    const roleControl = this.form.get('role');
    if (!roleControl) return;

    this.role.set(roleControl.value || '');

    roleControl.valueChanges.subscribe((newRole) => {
      if (newRole !== this.previousRole) {
        const oldRole = this.previousRole;
        this.previousRole = newRole; // update only on change
        this.role.set(newRole || '');

        // React to the role change (e.g., reset language/framework fields)
        this.formUtils.handleRoleChange(this.form, newRole, oldRole); // Pass previousRole
        this.cd.detectChanges();
      }
    });
  }

  /**
   * Sets up listeners on the frontend and backend language controls
   * to update their respective signals when values change.
   */
  private setupLangWatchers(): void {
    const frontendLangCtrl = this.form.get('frontend.languages');
    const backendLangCtrl = this.form.get('backend.languages');

    if (frontendLangCtrl) {
      this.frontendLangs.set(frontendLangCtrl.value || []);
      frontendLangCtrl.valueChanges.subscribe((val) =>
        this.frontendLangs.set(val || [])
      );
    }

    if (backendLangCtrl) {
      this.backendLangs.set(backendLangCtrl.value || []);
      backendLangCtrl.valueChanges.subscribe((val) =>
        this.backendLangs.set(val || [])
      );
    }
  }

  /**
   * Allows manual role change trigger from the template if needed.
   * @param role - New role value (string or null)
   */
  onRoleChange(role: string | null): void {
    this.formUtils.handleRoleChange(this.form, role);
    this.cd.detectChanges();
  }

  /**
   * Maps selected languages to available frameworks.
   * @param langs - Array of selected languages
   * @returns Array of unique frameworks associated with those languages
   */
  private getFrameworksFromLangs(langs: string[]): string[] {
    if (!Array.isArray(langs)) return [];
    return Array.from(
      new Set(langs.flatMap((lang) => this.languageFrameworks[lang] || []))
    );
  }

  /**
   * Retrieves an error message for a specific form control.
   * @param controlName - Name/path of the control (e.g., 'role', 'backend.languages')
   * @returns Error message string or null
   */
  getError(controlName: string): string | null {
    return this.formUtils.getError(this.form, controlName);
  }

  /**
   * Used to optimize *ngFor rendering of language/framework lists.
   * @param index - Index in array
   * @param value - The string value (language or framework)
   * @returns Unique identifier (string value itself)
   */
  trackByValue(index: number, value: string): string {
    return value;
  }
}
