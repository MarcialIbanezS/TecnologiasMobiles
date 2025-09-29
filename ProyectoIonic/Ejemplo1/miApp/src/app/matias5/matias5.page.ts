import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

type ReportePaciente = {
  lugar: string;
  procedimiento: string;
  diagnostico: string;   // o razón
  fecha: string;         // ISO string (yyyy-mm-dd)
  hora: string;          // HH:mm
  notas: string;
};

@Component({
  selector: 'app-matias5',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule,RouterModule],
  templateUrl: './matias5.page.html',
  styleUrls: ['./matias5.page.scss'],
})
export class Matias5Page {
  // Opciones de ejemplo (ajústalas a tu dominio)
  procedimientos = [
    'Curación de herida',
    'Inmovilización',
    'Administración de fármacos',
    'Reanimación/Soporte',
    'Traslado asistido',
    'Control de signos'
  ];

  diagnosticosSugeridos = [
    'Traumatismo leve',
    'Dolor torácico',
    'Cefalea',
    'Disnea',
    'Hipoglicemia',
    'Crisis hipertensiva'
  ];

  // Modelo del formulario
  reporte: ReportePaciente = {
    lugar: '',
    procedimiento: '',
    diagnostico: '',
    fecha: this.hoyISO(),
    hora: this.ahoraHM(),
    notas: ''
  };

  // Historial simple en memoria (puedes persistirlo donde quieras)
  reportesGuardados: ReportePaciente[] = [];

  constructor(private toastCtrl: ToastController) {}

  private hoyISO(): string {
    const d = new Date();
    // yyyy-mm-dd
    return d.toISOString().slice(0, 10);
  }

  private ahoraHM(): string {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  camposRequeridosCompletos(): boolean {
    const r = this.reporte;
    return !!(r.lugar && r.procedimiento && r.diagnostico && r.fecha && r.hora);
  }

  async guardarReporte() {
    if (!this.camposRequeridosCompletos()) {
      const t = await this.toastCtrl.create({
        message: 'Completa los campos obligatorios (lugar, procedimiento, diagnóstico, fecha y hora).',
        duration: 2200,
        color: 'warning'
      });
      await t.present();
      return;
    }

    // Guardar en arreglo local (luego puedes enviarlo a API/Storage)
    this.reportesGuardados.unshift({ ...this.reporte });

    const t = await this.toastCtrl.create({
      message: 'Reporte guardado correctamente.',
      duration: 1800,
      color: 'success'
    });
    await t.present();

    // Mantener fecha/hora pero limpiar campos de texto
    this.reporte = {
      lugar: '',
      procedimiento: '',
      diagnostico: '',
      fecha: this.hoyISO(),
      hora: this.ahoraHM(),
      notas: ''
    };
  }

  async limpiarFormulario() {
    this.reporte = {
      lugar: '',
      procedimiento: '',
      diagnostico: '',
      fecha: this.hoyISO(),
      hora: this.ahoraHM(),
      notas: ''
    };
    const t = await this.toastCtrl.create({
      message: 'Formulario limpio.',
      duration: 1200,
      color: 'medium'
    });
    await t.present();
  }

  // Autocompletar rápido desde sugerencias
  setDiagnostico(value: string) {
    this.reporte.diagnostico = value;
  }
}
