import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

type Patient = {
  id: string;
  name: string;
  rut?: string;
  photoUrl?: string;

  // Datos personales
  sex?: 'Masculino' | 'Femenino' | 'Otro';
  heightCm?: number;
  weightKg?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  // Datos clínicos
  chronicDiseases?: string;
  allergies?: string;
  bloodType?: string;
};

@Component({
  selector: 'app-matias3',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  templateUrl: './matias3.page.html',
  styleUrls: ['./matias3.page.scss'],
})
export class Matias3Page {
  pacienteId: string | null = null;

  signosVitales = { presion: '', pulso: '', temperatura: '' };
  medicamento = { nombre: '', dosis: '' };

  patient = signal<Patient | null>(null);
  fichaMedicaUrl = signal<string | null>(null);
  hasPatient = computed(() => !!this.patient());

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.pacienteId = this.route.snapshot.paramMap.get('id');
    const id = this.pacienteId ?? 'demo-001';

    // Mock de paciente (reemplázalo con tu servicio real)
    this.patient.set({
      id,
      name: 'Martin Jairo Ibarra Zamiro',
      rut: '21.111.333-K',
      photoUrl: 'assets/avatar-placeholder.png',

      sex: 'Masculino',
      heightCm: 178,
      weightKg: 76,
      emergencyContactName: 'María Ibarra (madre)',
      emergencyContactPhone: '+56 9 5555 1234',

      chronicDiseases: 'Ninguno',
      allergies: 'Nueces',
      bloodType: 'A+',
    });
    this.fichaMedicaUrl.set(`/assets/fichas/${id}.pdf`);
  }

  // Acciones
  async guardarSignos() {
    const t = await this.toastCtrl.create({
      message: 'Signos vitales guardados',
      duration: 1500,
      color: 'success',
    });
    t.present();
  }

  async guardarMedicamento() {
    const t = await this.toastCtrl.create({
      message: 'Medicamento agregado',
      duration: 1500,
      color: 'success',
    });
    t.present();
  }

  abrirFichaMedica() {
    const url = this.fichaMedicaUrl();
    if (url) window.open(url, '_blank');
  }

  descargarFicha() {
    const url = this.fichaMedicaUrl();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha_${this.pacienteId ?? 'paciente'}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  goToHistorial() {
    if (this.pacienteId) this.router.navigate(['/historial', this.pacienteId]);
    else this.router.navigate(['/historial']);
  }

  goToReporte() {
    if (this.pacienteId) this.router.navigate(['/reporte', this.pacienteId]);
    else this.router.navigate(['/reporte']);
  }
}
