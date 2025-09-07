import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Martin5Page } from './martin5.page';

describe('Martin5Page', () => {
  let component: Martin5Page;
  let fixture: ComponentFixture<Martin5Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Martin5Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
