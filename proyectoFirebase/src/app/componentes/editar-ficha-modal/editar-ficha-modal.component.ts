import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, 
  IonInput, IonButton 
} from '@ionic/angular/standalone';
import { MedicalRecord, MedicalRecordService } from '../../servicios/medical-record.service';

@Component({
  selector: 'app-editar-ficha-modal',
  templateUrl: './editar-ficha-modal.component.html',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonButton,
    ReactiveFormsModule
  ]
})
export class EditarFichaModalComponent implements OnInit {

  @Input() record!: MedicalRecord; 
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private medicalService: MedicalRecordService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombrePaciente: [this.record.nombrePaciente || ''],
      rut: [this.record.rut || ''],
      direccion: [this.record.direccion || ''],
      idalergia: [this.record.idalergia || ''],
      idcronico: [this.record.idcronico || ''],
      idoperacion: [this.record.idoperacion || '']
    });
  }

  async guardar() {
    try {
      await this.medicalService.updateMedicalRecord(
        String(this.record.idfichamedica),
        this.form.value
      );

      this.modalCtrl.dismiss(true);  // devolvemos "true" para indicar éxito

    } catch (err) {
      console.error(err);
      alert('Error al actualizar la ficha');
    }
  }

  cerrar() {
    this.modalCtrl.dismiss(false);
  }
}
