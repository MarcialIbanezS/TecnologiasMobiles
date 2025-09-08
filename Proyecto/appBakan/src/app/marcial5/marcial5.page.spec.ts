import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Marcial5Page } from './marcial5.page';

describe('Marcial5Page', () => {
  let component: Marcial5Page;
  let fixture: ComponentFixture<Marcial5Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Marcial5Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
