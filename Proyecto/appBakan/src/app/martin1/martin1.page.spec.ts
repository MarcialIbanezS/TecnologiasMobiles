import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Martin1Page } from './martin1.page';

describe('Martin1Page', () => {
  let component: Martin1Page;
  let fixture: ComponentFixture<Martin1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Martin1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
