import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FichaDummyPage } from './ficha-dummy.page';

describe('FichaDummyPage', () => {
  let component: FichaDummyPage;
  let fixture: ComponentFixture<FichaDummyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaDummyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
