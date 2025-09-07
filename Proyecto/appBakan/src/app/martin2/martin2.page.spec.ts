import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Martin2Page } from './martin2.page';

describe('Martin2Page', () => {
  let component: Martin2Page;
  let fixture: ComponentFixture<Martin2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Martin2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
