import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-matias4',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './matias4.page.html',
  styleUrls: ['./matias4.page.scss'],
})
export class Matias4Page {
  // Arreglo completo de medicamentos
  farmacos = [
    { nombre: 'Paracetamol', tipo: 'Analgésico', noCombinar: ['Alcohol'] },
    { nombre: 'Salbutamol', tipo: 'Broncodilatador', noCombinar: ['Cafeína'] },
    { nombre: 'Amoxicilina', tipo: 'Antibiótico', noCombinar: ['Anticoagulantes'] },
    { nombre: 'Ibuprofeno', tipo: 'Antiinflamatorio', noCombinar: ['Corticoides'] },
    { nombre: 'Metformina', tipo: 'Antidiabético', noCombinar: [] }
  ];

  // Arreglo filtrado para mostrar en la lista
  farmacosFiltrados = [...this.farmacos];

  // Texto de búsqueda
  textoBusqueda: string = '';

  constructor() {}

  // Función de filtrado
  filtrarMedicamentos(event: any) {
    const valor = event.detail.value?.toLowerCase() || '';
    this.textoBusqueda = valor;

    if (valor.trim() === '') {
      this.farmacosFiltrados = [...this.farmacos];
    } else {
      this.farmacosFiltrados = this.farmacos.filter(f =>
        f.nombre.toLowerCase().includes(valor) ||
        f.tipo.toLowerCase().includes(valor)
      );
    }
  }
}
