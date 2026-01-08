import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { FleetService } from './fleet.service';
import { AssetType } from './models/asset-type';
import { ServiceCenter } from './models/service-center';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatNativeDateModule],
  template: `
  <div class="homepage-root">
    <div class="hero">
      <div class="hero-inner">
        <h1 class="title">Fleet Service Scheduler</h1>
        <p class="subtitle">Schedule and manage maintenance appointments for your fleet — fast and simple.</p>
      </div>
      <div class="hero-illustration" aria-hidden="true"></div>
    </div>

    <div class="container card">
      <form [formGroup]="form" (ngSubmit)="submit()" class="form-grid">
        <mat-form-field appearance="outline" class="field">
          <mat-label>Asset Type</mat-label>
          <select matNativeControl formControlName="assetTypeId" required class="select-input">
            <option value="">Select asset</option>
            <option *ngFor="let a of assetTypes" [value]="a.id">{{a.name}}</option>
          </select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="field">
          <mat-label>Service Center</mat-label>
          <select matNativeControl formControlName="serviceCenterId" required class="select-input">
            <option value="">Select center</option>
            <option *ngFor="let s of centers" [value]="s.id">{{s.name}} — {{s.city}}</option>
          </select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="field full-width">
          <mat-label>Appointment Date & Time</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="appointmentDateTime" placeholder="Choose a date and time" class="date-input">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="field full-width">
          <mat-label>Notes (optional)</mat-label>
          <input matInput formControlName="notes" placeholder="Add details about the appointment">
        </mat-form-field>

        <div class="actions">
          <button type="submit" class="btn-primary" [disabled]="form.invalid">Save Appointment</button>
        </div>
      </form>

      <p *ngIf="saved" class="success">Appointment saved successfully!</p>
    </div>
  </div>
  `
})
export class HomepageComponent {
  assetTypes: AssetType[] = [];
  centers: ServiceCenter[] = [];
  saved = false;

  form!: FormGroup;

  constructor(private fb: FormBuilder, private fleet: FleetService) {
    this.form = this.fb.group({
      assetTypeId: [null],
      serviceCenterId: [null],
      appointmentDateTime: [null],
      notes: ['']
    });

    this.loadLookups();
  }

  loadLookups() {
    this.fleet.getAssetTypes().subscribe(a => this.assetTypes = a);
    this.fleet.getServiceCenters().subscribe(s => this.centers = s);
  }

  submit() {
    if (this.form.invalid) return;
    const raw = this.form.value;
    const payload = {
      assetTypeId: Number(raw.assetTypeId),
      serviceCenterId: Number(raw.serviceCenterId),
      appointmentDateTime: (raw.appointmentDateTime as Date).toISOString(),
      notes: raw.notes
    };

    this.fleet.createAppointment(payload).subscribe(() => {
      this.saved = true;
      this.form.reset();
    });
  }
}
