import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

type PacienteListItem = { id: string; name: string; rut?: string; photoUrl?: string; tag?: string };

@Component({
  selector: 'app-matias2',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  templateUrl: './matias2.page.html',
  styleUrls: ['./matias2.page.scss'],
})
export class Matias2Page {
  query = '';
  resultados: PacienteListItem[] = [];
  filtro: string | null = null;

  private all: PacienteListItem[] = [
    { id: 'demo-001', name: 'Martin Jairo Ibarra Zamiro', rut: '21.111.333-K', photoUrl: 'assets/img/persona.jpg', tag: 'control' },
    { id: 'demo-002', name: 'Ana Torres', rut: '18.555.222-1', photoUrl: 'assets/img/persona.jpg', tag: 'urgente' },
  ];

  constructor(private router: Router) { this.buscar(); }

  buscar() {
    const q = (this.query || '').trim().toLowerCase();
    let list = q
      ? this.all.filter(p => p.name.toLowerCase().includes(q) || (p.rut || '').toLowerCase().includes(q))
      : [...this.all];
    if (this.filtro) list = list.filter(x => x.tag === this.filtro);
    this.resultados = list;
  }
  filtrar(tag: string) { this.filtro = tag; this.buscar(); }
  limpiar() { this.filtro = null; this.query=''; this.buscar(); }
  abrirDetalle(id: string) { this.router.navigate(['/ficha', id]); }
}
