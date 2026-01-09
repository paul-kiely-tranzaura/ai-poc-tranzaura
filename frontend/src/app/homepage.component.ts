import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FleetService } from './fleet.service';
import { AssetType } from './models/asset-type';
import { ServiceCenter } from './models/service-center';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
  <main id="main" class="homepage-root" role="main">
    <div class="hero" aria-hidden="false">
      <div class="hero-inner">
        <h1 class="title">Fleet Service Scheduler</h1>
        <p class="subtitle">Schedule and manage maintenance appointments for your fleet — fast and simple.</p>
      </div>
      <div class="hero-illustration" aria-hidden="true"></div>
    </div>

    <section class="container card" aria-labelledby="schedule-heading">
      <h2 id="schedule-heading" class="sr-only">Schedule an appointment</h2>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form-grid" aria-describedby="form-desc">
        <div id="form-desc" class="sr-only">Choose an asset type, service center and date to schedule a maintenance appointment.</div>

        <div class="field">
          <label class="input-label">Asset Type</label>
          <select formControlName="assetTypeId" required class="select-input" aria-label="Asset Type">
            <option value="">Select asset</option>
            <option *ngFor="let a of assetTypes" [value]="a.id">{{a.name}}</option>
          </select>
        </div>

        <div class="field">
          <label class="input-label">Asset Make</label>
          <select formControlName="assetMake" class="select-input" aria-label="Asset Make">
            <option value="">Select make</option>
            <option *ngFor="let m of assetMakes" [value]="m">{{ m }}</option>
          </select>
        </div>

        <div class="field">
          <label class="input-label">Service Center</label>
          <select formControlName="serviceCenterId" required class="select-input" aria-label="Service Center">
            <option value="">Select center</option>
            <option *ngFor="let s of centers" [value]="s.id">{{s.name}} — {{s.city}}</option>
          </select>
        </div>

        <div class="field">
          <label class="input-label">Asset Year</label>
          <select formControlName="assetYear" class="select-input" aria-label="Asset Year">
            <option value="">Select year</option>
            <option *ngFor="let y of assetYears" [value]="y">{{ y }}</option>
          </select>
        </div>

        <div class="field">
          <label class="input-label">Appointment Date</label>
          <input type="date" formControlName="appointmentDate" class="date-input" aria-label="Appointment Date">
        </div>

        <div class="field">
          <label class="input-label">Appointment Time</label>
          <input type="time" formControlName="appointmentTime" class="date-input" aria-label="Appointment Time">
        </div>

        <div class="field full-width">
          <label class="input-label">Notes (optional)</label>
          <textarea formControlName="notes" class="date-input" rows="3" placeholder="Add details about the appointment" aria-label="Notes"></textarea>
        </div>

        <div class="actions">
          <button type="submit" class="btn-primary" [disabled]="form.invalid" [attr.aria-disabled]="form.invalid">Save Appointment</button>
        </div>
      </form>

      <p *ngIf="saved" class="success" role="status" aria-live="polite">Appointment saved successfully!</p>
    </section>

    <!-- Appointments moved to its own route -->
  </main>
  `
})
export class HomepageComponent implements OnInit {
  form: FormGroup;
  assetTypes: AssetType[] = [];
  centers: ServiceCenter[] = [];
  assetYears: number[] = [];
  assetMakes: string[] = [];
  appointments: any[] = [];
  saved = false;
  year = new Date().getFullYear();

  constructor(private fb: FormBuilder, private fleet: FleetService) {
    this.form = this.fb.group({
      assetTypeId: ['', Validators.required],
      assetMake: [''],
      serviceCenterId: ['', Validators.required],
      assetYear: [''],
      appointmentDate: [null, Validators.required],
      appointmentTime: [null, Validators.required],
      notes: ['']
    });
    // populate years 1970..2026
    const start = 1970;
    const end = 2026;
    for (let y = start; y <= end; y++) this.assetYears.push(y);
    // common truck manufacturers
    this.assetMakes = [
      'Ford', 'Chevrolet', 'Toyota', 'Volvo', 'Mercedes-Benz',
      'Freightliner', 'Peterbilt', 'Kenworth', 'Isuzu', 'Scania'
    ];
  }

  ngOnInit(): void {
    this.loadLookups();
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.fleet.getAppointments().subscribe(a => (this.appointments = a || []));
  }

  private loadLookups(): void {
    this.fleet.getAssetTypes().subscribe((a) => (this.assetTypes = a || []));
    this.fleet.getServiceCenters().subscribe((s) => (this.centers = s || []));
  }

  // For local dev: provide sensible fallbacks when API is unavailable
  private ensureLocalFallbacks(): void {
    if (!this.assetTypes || this.assetTypes.length === 0) {
      this.assetTypes = [
        { id: 1, name: 'Truck' },
        { id: 2, name: 'Van' },
        { id: 3, name: 'Sedan' }
      ];
    }

    if (!this.centers || this.centers.length === 0) {
      this.centers = [
        { id: 1, name: 'Central Service', city: 'Springfield' },
        { id: 2, name: 'Northside Service', city: 'Shelbyville' }
      ];
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.value as any;
    const datePart = raw.appointmentDate; // 'YYYY-MM-DD'
    const timePart = raw.appointmentTime || '00:00'; // 'HH:mm'
    const combined = new Date(`${datePart}T${timePart}`);
    const payload: any = {
      assetTypeId: Number(raw.assetTypeId),
      serviceCenterId: Number(raw.serviceCenterId),
      appointmentDate: combined.toISOString(),
      notes: raw.notes
    };
    if (raw.assetYear) payload.assetYear = Number(raw.assetYear);
    if (raw.assetMake) payload.assetMake = raw.assetMake;

    this.fleet.createAppointment(payload).subscribe(() => {
      this.saved = true;
      this.form.reset();
    });
  }
}
