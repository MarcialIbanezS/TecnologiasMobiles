import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Marcial2Page } from './marcial2.page';

describe('Marcial2Page', () => {
  let component: Marcial2Page;
  let fixture: ComponentFixture<Marcial2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Marcial2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
