import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonInput, IonButton, IonNote
} from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { ItemsService, Item } from '../../servicios/items';

@Component({
  selector: 'app-libros',
  standalone: true,
  templateUrl: './libros.page.html',
  styleUrls: ['./libros.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonInput, IonButton, IonNote
  ],
})
export class LibrosPage implements OnInit {
  private fb = inject(FormBuilder);
  private itemsSrv = inject(ItemsService);

  items$!: Observable<Item[]>;

  form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(2)]],
    detalle: [''],
  });

  ngOnInit() {
    this.items$ = this.itemsSrv.listar();
  }

  async agregar() {
    if (this.form.invalid) return;
    const { titulo, detalle } = this.form.value;
    try {
      await this.itemsSrv.agregar({ titulo: titulo!, detalle: detalle || undefined }).toPromise();
      this.form.reset();
      // Refresh the list after adding
      this.items$ = this.itemsSrv.listar();
    } catch (error) {
      console.error('Error adding item:', error);
      // You might want to show a toast or alert here
    }
  }

  async eliminar(it: Item) {
    if (!it.id) return;
    try {
      await this.itemsSrv.eliminar(it.id).toPromise();
      // Refresh the list after deleting
      this.items$ = this.itemsSrv.listar();
    } catch (error) {
      console.error('Error deleting item:', error);
      // You might want to show a toast or alert here
    }
  }
}
