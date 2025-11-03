import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonButton, IonNote, IonLabel, IonItem, IonList, IonIcon, IonAvatar, IonBreadcrumb, IonBreadcrumbs,
  IonButtons
 } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';

interface Breadcrumb {
  label: string;
  path: string;
}

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,IonBreadcrumb, IonBreadcrumbs,
  IonCardTitle, IonButton, IonNote, IonLabel, IonItem, IonList, IonIcon, IonAvatar, RouterModule,
  IonButtons
  ]
})
export class PerfilUsuarioPage implements OnInit {

  constructor(
    private router: Router,
  ) { }
breadcrumbs: Breadcrumb[] = [];
  ngOnInit() {
  
  this.breadcrumbs = [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Perfil Usuario', path: '/perfil-usuario' }
    ];
  }
  goToProfile() {
  this.router.navigate(['/perfil-usuario']);
}
  onBreadcrumbClick(breadcrumb: Breadcrumb) {
  if (!breadcrumb.path) return;

  // Si es la página actual, no navegamos
  if (breadcrumb.path === this.router.url) return;

  // Navegación real
  this.router.navigate([breadcrumb.path]);
}

}
