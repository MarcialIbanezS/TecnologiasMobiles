import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem,
 IonAvatar, IonLabel } from '@ionic/angular/standalone';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-martin2',
  templateUrl: './martin2.page.html',
  styleUrls: ['./martin2.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonBreadcrumb, IonBreadcrumbs, RouterModule, IonSearchbar,
    IonList, IonItem, IonAvatar, IonLabel
  ]
})
export class Martin2Page implements OnInit {

  pacientes = [
    { id: 1, nombre: 'Martín Gottschalk', rut: '12.345.678-9' },
    { id: 2, nombre: 'Silk Song', rut: '23.456.789-0' },
    { id: 3, nombre: 'Jolou Nait', rut: '34.567.890-1' },
    { id: 4, nombre: 'Gara Ma', rut: '45.678.901-2' },
    { id: 5, nombre: 'Shaw Ediro', rut: '56.789.012-3' },
    { id: 6, nombre: 'Oe Callate Un Rato XD', rut: '56.789.012-3' }
  ];

  searchTerm = '';
  items = [...this.pacientes];

  constructor(private router: Router) {}

  ngOnInit() {}

  irAHome() { this.router.navigate(['/home']); }
  irAMartin0() { this.router.navigate(['/pagina2']); }

  onBuscar(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    this.items = this.pacientes.filter(p =>
      p.nombre.toLowerCase().includes(this.searchTerm) ||
      p.rut.includes(this.searchTerm)
    );
  }
}
