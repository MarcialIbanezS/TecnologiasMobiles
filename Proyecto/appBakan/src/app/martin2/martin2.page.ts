import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonList, IonInfiniteScroll, IonItem,
 IonAvatar, IonInfiniteScrollContent, IonLabel } from '@ionic/angular/standalone';
import { IonBreadcrumb, IonBreadcrumbs, InfiniteScrollCustomEvent } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-martin2',
  templateUrl: './martin2.page.html',
  styleUrls: ['./martin2.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonBreadcrumb, IonBreadcrumbs, RouterModule, IonSearchbar,
    IonList, IonInfiniteScroll, IonItem, IonAvatar, IonInfiniteScrollContent,
    IonLabel
  ]
})
export class Martin2Page implements OnInit {

  pacientes: string[] = [];   
  items: string[] = [];       
  searchTerm = '';            
  pageSize = 20;              

  constructor(private router: Router) {}

  ngOnInit() {
    this.pacientes = Array.from({ length: 200 }, (_, i) => `Paciente ${i + 1}`);
    this.cargarMas(); 
  }

  irAHome() { this.router.navigate(['/home']); }
  irAMartin0() { this.router.navigate(['/pagina2']); }
  irAMartin1() { this.router.navigate(['/martin1']); }
  irAMartin2() { this.router.navigate(['/martin2']); }
  irAMartin3() { this.router.navigate(['/martin3']); }
  irAMartin4() { this.router.navigate(['/martin4']); }
  irAMartin5() { this.router.navigate(['/martin5']); }
  irAMartin6() { this.router.navigate(['/martin6']); }

  onBuscar(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    this.items = [];
    this.cargarMas();
  }

  filtrarPacientes(): string[] {
    if (!this.searchTerm) return this.pacientes;
    return this.pacientes.filter(p => p.toLowerCase().includes(this.searchTerm));
  }

  cargarMas(event?: InfiniteScrollCustomEvent) {
    const start = this.items.length;
    const end = start + this.pageSize;
    const nuevos = this.filtrarPacientes().slice(start, end);

    this.items = [...this.items, ...nuevos];

    if (event) {
      event.target.complete();
      if (this.items.length >= this.filtrarPacientes().length) {
        event.target.disabled = true;
      }
    }
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.cargarMas(event);
  }
}
