import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

type EntradaHistorial = {
  fecha: string;   // yyyy-mm-dd
  hora: string;    // HH:mm
  diagnostico: string;
  procedimiento: string;
  lugar: string;
  notas?: string;
};

type ReportePaciente = {
  lugar: string;
  procedimiento: string;
  diagnostico: string;   // o razón
  fecha: string;         // yyyy-mm-dd
  hora: string;          // HH:mm
  notas: string;
};

@Component({
  selector: 'app-matias7',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './matias7.page.html',
  styleUrls: ['./matias7.page.scss'],
})
export class Matias7Page implements OnInit {
  // --- Datos de ejemplo (reemplaza por tu backend/servicio) ---
  historial: EntradaHistorial[] = [
    { fecha: '2025-09-22', hora: '11:30', diagnostico: 'Cefalea', procedimiento: 'Administración de fármacos', lugar: 'Domicilio', notas: 'Responde bien a paracetamol.' },
    { fecha: '2025-09-22', hora: '08:10', diagnostico: 'Traumatismo leve', procedimiento: 'Curación de herida', lugar: 'Vía pública', notas: 'Control en 48h.' },
    { fecha: '2025-09-21', hora: '19:40', diagnostico: 'Disnea', procedimiento: 'Soporte y traslado', lugar: 'Empresa', notas: 'Oxígeno y derivación.' },
    { fecha: '2025-09-20', hora: '09:00', diagnostico: 'Hipoglicemia', procedimiento: 'Administración de glucosa', lugar: 'Domicilio' },
    { fecha: '2025-09-19', hora: '17:25', diagnostico: 'Crisis hipertensiva', procedimiento: 'Control de signos', lugar: 'Consultorio' }
  ];

  reportesGuardados: ReportePaciente[] = [
    { lugar: 'Domicilio', procedimiento: 'Administración de fármacos', diagnostico: 'Cefalea', fecha: '2025-09-22', hora: '11:35', notas: 'Hidratación y control dolor.' },
    { lugar: 'Vía pública', procedimiento: 'Curación de herida', diagnostico: 'Traumatismo leve', fecha: '2025-09-22', hora: '08:15', notas: 'Limpieza y vendaje.' },
    { lugar: 'Empresa', procedimiento: 'Soporte y traslado', diagnostico: 'Disnea', fecha: '2025-09-21', hora: '19:50', notas: 'Saturación 92% inicial.' },
  ];

  // --- Estado/UI ---
  kpis = {
    hoy: 0,
    semana: 0,
    topDx: '-',
    ultimo: '-'
  };

  actividadReciente: Array<{ titulo: string; subtitulo: string; detalle: string; }> = [];

  ngOnInit(): void {
    this.recalcularKPIs();
    this.cargarActividadReciente();
  }

  private hoyISO(): string {
    return new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  }

  private inicioFinSemana(fecha: Date): { start: string; end: string } {
    // Semana Lunes–Domingo
    const day = fecha.getDay(); // 0-dom,1-lun,...6-sab
    const diffToMonday = (day + 6) % 7; // 0 si lunes
    const startDate = new Date(fecha);
    startDate.setDate(fecha.getDate() - diffToMonday);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return { start: fmt(startDate), end: fmt(endDate) };
  }

  private dentroRango(fecha: string, desde: string, hasta: string): boolean {
    return fecha >= desde && fecha <= hasta;
  }

  private topDiagnostico(entries: Array<{ diagnostico: string }>): string {
    const map = new Map<string, number>();
    entries.forEach(e => map.set(e.diagnostico, (map.get(e.diagnostico) || 0) + 1));
    let best = '-', max = -1;
    map.forEach((v, k) => { if (v > max) { max = v; best = k; } });
    return best;
  }

  private ultimoReporteLabel(): string {
    if (!this.reportesGuardados.length) return '-';
    const sorted = [...this.reportesGuardados].sort((a, b) =>
      `${b.fecha}T${b.hora}`.localeCompare(`${a.fecha}T${a.hora}`)
    );
    const r = sorted[0];
    return `${r.diagnostico} · ${r.procedimiento} (${r.fecha} ${r.hora})`;
  }

  recalcularKPIs() {
    const hoy = this.hoyISO();
    const { start, end } = this.inicioFinSemana(new Date());

    const hoyCount = this.historial.filter(h => h.fecha === hoy).length;
    const semanaCount = this.historial.filter(h => this.dentroRango(h.fecha, start, end)).length;
    const topDx = this.topDiagnostico(this.historial);
    const ultimo = this.ultimoReporteLabel();

    this.kpis = { hoy: hoyCount, semana: semanaCount, topDx, ultimo };
  }

  cargarActividadReciente() {
    // Mezcla simple de historial + reportes (ordenado por fecha/hora desc)
    const mix = [
      ...this.historial.map(h => ({
        when: `${h.fecha}T${h.hora}`,
        titulo: h.diagnostico,
        subtitulo: `${h.procedimiento} · ${h.lugar}`,
        detalle: h.notas || ''
      })),
      ...this.reportesGuardados.map(r => ({
        when: `${r.fecha}T${r.hora}`,
        titulo: r.diagnostico,
        subtitulo: `${r.procedimiento} · ${r.lugar}`,
        detalle: r.notas || ''
      }))
    ].sort((a, b) => b.when.localeCompare(a.when));

    this.actividadReciente = mix.slice(0, 6).map(({ titulo, subtitulo, detalle }) => ({ titulo, subtitulo, detalle }));
  }
}
