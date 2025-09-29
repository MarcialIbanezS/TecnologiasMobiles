// src/app/core/patient.ts
import { Injectable } from '@angular/core';

export interface Vital {
  ts: number; fc: number; fr: number; paSys: number; paDia: number;
  spo2: number; temp: number; glasgow: number; glicemia?: number; dolor?: number;
}

export interface MedicationAdmin {
  ts: number; drug: string; dose: string; route: string; notes?: string;
}

export interface Patient {
  id: string; name: string; rut: string; age: number; sex: 'M'|'F';
  blood: string; insurance?: string;
  allergies: string[]; chronic: string[]; dnr?: boolean; devices?: string[];
  meds?: MedicationAdmin[]; vitals?: Vital[];
  triage?: 'rojo'|'naranjo'|'amarillo'|'verde'|'azul';
  history?: { ts:number; type:string; text:string }[];
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private patients: Patient[] = [{
    id: 'p001', name: 'Juan Pérez', rut: '12.345.678-9', age: 58, sex: 'M', blood: 'O+',
    insurance: 'FONASA',
    allergies: ['Penicilina'], chronic: ['HTA', 'DM2'], devices: ['Marcapasos'],
    dnr: false, triage: 'amarillo',
    vitals: [{ ts: Date.now()-1000*60*12, fc: 96, fr: 18, paSys: 140, paDia: 88, spo2: 96, temp: 37.1, glasgow: 15 }],
    meds:   [{ ts: Date.now()-1000*60*15, drug: 'ASA', dose: '325 mg', route: 'VO' }],
    history: [
      { ts: Date.now()-1000*60*60*24*90, type: 'cirugía',  text: 'Colecistectomía' },
      { ts: Date.now()-1000*60*60*24*7,  type: 'urgencia', text: 'Crisis hipertensiva' },
    ],
  }];

  listRecent() { return this.patients; }
  get(id: string) { return this.patients.find(p => p.id === id); }
  findByRutOrName(q: string) {
    const s = q.toLowerCase();
    return this.patients.filter(p => p.rut.includes(q) || p.name.toLowerCase().includes(s));
  }
  addVital(id: string, v: Vital) { this.get(id)?.vitals?.push(v); }
  setTriage(id: string, t: Patient['triage']) { const p = this.get(id); if (p) p.triage = t; }
  addAdmin(id: string, a: MedicationAdmin) { this.get(id)?.meds?.push(a); }
}
