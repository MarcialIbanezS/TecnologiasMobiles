import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoPacientesPage } from './listado-pacientes.page';

describe('ListadoPacientesPage', () => {
  let component: ListadoPacientesPage;
  let fixture: ComponentFixture<ListadoPacientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPacientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
