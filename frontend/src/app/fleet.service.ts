import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE = 'http://127.0.0.1:5000/api';

@Injectable({ providedIn: 'root' })
export class FleetService {
  constructor(private http: HttpClient) {}

  getAssetTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE}/AssetTypes`);
  }

  getServiceCenters(): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE}/ServiceCenters`);
  }

  createAppointment(payload: any) {
    return this.http.post(`${API_BASE}/ServiceAppointments`, payload);
  }
}
