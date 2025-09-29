import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
type EntradaHistorial = {
  fecha: string;       // yyyy-mm-dd
  hora: string;        // HH:mm
  diagnostico: string;
  procedimiento: string;
  lugar: string;
  notas?: string;
};

type Filtros = {
  texto: string;
  desde: string | null; // yyyy-mm-dd
  hasta: string | null; // yyyy-mm-dd
  ordenar: 'recientes' | 'antiguos';
};

@Component({
  selector: 'app-matias6',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule,RouterModule],
  templateUrl: './matias6.page.html',
  styleUrls: ['./matias6.page.scss'],
})
export class Matias6Page implements OnInit {
  // Datos de ejemplo (ajústalos a tu backend)
  historial: EntradaHistorial[] = [
    {
      fecha: '2025-09-15',
      hora: '18:20',
      diagnostico: 'Cefalea',
      procedimiento: 'Administración de fármacos',
      lugar: 'Domicilio',
      notas: 'Reposo, hidratación. Evaluación en 24h.'
    },
    {
      fecha: '2025-09-15',
      hora: '10:05',
      diagnostico: 'Traumatismo leve',
      procedimiento: 'Curación de herida',
      lugar: 'Vía pública',
      notas: 'Herida superficial, se indica control.'
    },
    {
      fecha: '2025-09-12',
      hora: '21:40',
      diagnostico: 'Disnea',
      procedimiento: 'Soporte y traslado asistido',
      lugar: 'Empresa',
      notas: 'Saturación inicial 90%. Mejora con O2.'
    },
    {
      fecha: '2025-09-08',
      hora: '07:30',
      diagnostico: 'Hipoglicemia',
      procedimiento: 'Administración de glucosa',
      lugar: 'Domicilio',
      notas: 'Respuesta favorable. Educación a tutor.'
    }
  ];

  filtros: Filtros = {
    texto: '',
    desde: null,
    hasta: null,
    ordenar: 'recientes'
  };

  listaFiltrada: EntradaHistorial[] = [];

  constructor(private toastCtrl: ToastController) {}

  ngOnInit(): void {
    this.aplicarFiltros();
  }

  private fechaDentroDeRango(fecha: string, desde: string | null, hasta: string | null): boolean {
    if (!desde && !hasta) return true;
    const f = fecha;
    if (desde && f < desde) return false;
    if (hasta && f > hasta) return false;
    return true;
  }

  private normalizarTexto(s?: string): string {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  aplicarFiltros() {
    const t = this.normalizarTexto(this.filtros.texto);
    const desde = this.filtros.desde;
    const hasta = this.filtros.hasta;

    let res = this.historial.filter(h => {
      // Rango de fechas
      if (!this.fechaDentroDeRango(h.fecha, desde, hasta)) return false;

      // Texto (diagnóstico, procedimiento, lugar, notas)
      if (t) {
        const blob = [
          this.normalizarTexto(h.diagnostico),
          this.normalizarTexto(h.procedimiento),
          this.normalizarTexto(h.lugar),
          this.normalizarTexto(h.notas)
        ].join(' ');
        if (!blob.includes(t)) return false;
      }
      return true;
    });

    // Orden
    res.sort((a, b) => {
      const ka = `${a.fecha}T${a.hora}`;
      const kb = `${b.fecha}T${b.hora}`;
      if (this.filtros.ordenar === 'recientes') {
        return kb.localeCompare(ka); // desc
      }
      return ka.localeCompare(kb);   // asc
    });

    this.listaFiltrada = res;
  }

  async limpiarFiltros() {
    this.filtros = { texto: '', desde: null, hasta: null, ordenar: 'recientes' };
    this.aplicarFiltros();
    const t = await this.toastCtrl.create({
      message: 'Filtros restablecidos.',
      duration: 1200,
      color: 'medium'
    });
    await t.present();
  }
}
