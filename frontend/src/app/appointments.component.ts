import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FleetService } from './fleet.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <section class="container card" aria-labelledby="appointments-heading">
    <h2 id="appointments-heading">Appointments</h2>
    <div class="appointments-toolbar" style="display:flex;gap:8px;margin-bottom:12px;align-items:center">
      <button class="btn-primary" (click)="loadAppointments()">Refresh</button>
    </div>
    <div *ngIf="appointments.length === 0">No appointments yet.</div>

    <div *ngIf="appointments.length > 0" class="appointments-grid">
      <article *ngFor="let ap of appointments" class="appointment-card">
        <header class="card-header" style="display:flex;justify-content:space-between;align-items:start">
          <div>
            <div class="title">{{ getAssetTypeName(ap.assetTypeId) || 'Asset' }} • {{ ap.assetMake || 'Unknown' }} {{ ap.assetYear || '' }}</div>
            <div class="meta">#{{ ap.id }} — {{ formatDate(ap.appointmentDate) }}</div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn-primary" *ngIf="editingId !== ap.id" (click)="startEdit(ap)">Edit</button>
            <button class="btn-primary" style="background:#ef4444" *ngIf="editingId !== ap.id" (click)="deleteAppointment(ap.id)">Delete</button>
            <ng-container *ngIf="editingId === ap.id">
              <button class="btn-primary" (click)="saveEdit()">Save</button>
              <button class="btn-primary" style="background:#6b7280" (click)="cancelEdit()">Cancel</button>
            </ng-container>
          </div>
        </header>

        <div class="card-body">
          <div *ngIf="editingId !== ap.id">
            <div class="row"><strong>Service Center:</strong> {{ getServiceCenterName(ap.serviceCenterId) || '—' }}</div>
            <div class="row"><strong>Notes:</strong> <span class="notes">{{ ap.notes || '—' }}</span></div>
          </div>

          <form *ngIf="editingId === ap.id" (ngSubmit)="saveEdit()" style="display:flex;flex-direction:column;gap:8px">
            <label>
              Appointment
              <input type="datetime-local" [(ngModel)]="editModel.appointmentInput" name="appointment" class="date-input" />
            </label>
            <label>
              Asset Make
              <input type="text" [(ngModel)]="editModel.assetMake" name="assetMake" class="select-input" />
            </label>
            <label>
              Asset Year
              <input type="number" [(ngModel)]="editModel.assetYear" name="assetYear" class="select-input" />
            </label>
            <label>
              Notes
              <textarea [(ngModel)]="editModel.notes" name="notes" rows="3" class="select-input"></textarea>
            </label>
          </form>
        </div>
      </article>
    </div>
  </section>
  `
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  assetTypes: any[] = [];
  serviceCenters: any[] = [];

  editingId: number | null = null;
  editModel: any = {};

  constructor(private fleet: FleetService) {}

  ngOnInit(): void {
    this.loadLookups();
    this.loadAppointments();
  }

  loadLookups(): void {
    this.fleet.getAssetTypes().subscribe(a => (this.assetTypes = a || []));
    this.fleet.getServiceCenters().subscribe(s => (this.serviceCenters = s || []));
  }

  loadAppointments(): void {
    this.fleet.getAppointments().subscribe(a => (this.appointments = a || []));
  }

  startEdit(ap: any): void {
    this.editingId = ap.id;
    this.editModel = { ...ap };
    this.editModel.appointmentInput = this.toLocalDatetimeInput(ap.appointmentDate);
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editModel = {};
  }

  saveEdit(): void {
    if (!this.editModel) return;
    const payload = { ...this.editModel };
    // convert input back to ISO datetime
    if (this.editModel.appointmentInput) {
      const iso = this.fromLocalDatetimeInput(this.editModel.appointmentInput);
      payload.appointmentDate = iso;
    }
    // ensure id is present
    const id = payload.id;
    this.fleet.updateAppointment(id, payload).subscribe({
      next: () => {
        this.editingId = null;
        this.editModel = {};
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Failed to save appointment', err);
      }
    });
  }

  deleteAppointment(id: number): void {
    if (!confirm('Delete this appointment?')) return;
    this.fleet.deleteAppointment(id).subscribe({
      next: () => this.loadAppointments(),
      error: (err) => console.error('Failed to delete', err)
    });
  }

  getAssetTypeName(id: any): string | undefined {
    const t = this.assetTypes.find(x => x.id === id);
    return t ? t.name : undefined;
  }

  getServiceCenterName(id: any): string | undefined {
    const s = this.serviceCenters.find(x => x.id === id);
    return s ? s.name : undefined;
  }

  formatDate(val: string | null | undefined): string {
    if (!val) return '—';
    const d = new Date(val);
    if (isNaN(d.getTime())) return val as string;
    return d.toLocaleString();
  }

  toLocalDatetimeInput(val: string | null | undefined): string {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  fromLocalDatetimeInput(val: string): string {
    // treat input as local and produce ISO string
    const d = new Date(val);
    return d.toISOString();
  }
}
