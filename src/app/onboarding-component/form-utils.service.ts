import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormUtilsService {
  updateControls<T extends Record<string, unknown>>(
    group: FormGroup,
    action: 'enable' | 'disable' | 'reset',
    resetValue?: T
  ): void {
    Object.keys(group.controls).forEach((key) => {
      const control = group.get(key);
      if (!control) return;

      switch (action) {
        case 'enable':
          control.enable({ emitEvent: false });
          break;
        case 'disable':
          control.disable({ emitEvent: false });
          break;
        case 'reset': {
          const value = resetValue?.[key as keyof T] ?? null;
          control.reset(value, { emitEvent: false });
          break;
        }
      }
    });
  }
}
