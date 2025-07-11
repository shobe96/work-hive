import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechStackStepComponent } from './tech-stack-step.component';

describe('TechStackStepComponent', () => {
  let component: TechStackStepComponent;
  let fixture: ComponentFixture<TechStackStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechStackStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TechStackStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
