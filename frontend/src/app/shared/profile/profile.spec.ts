import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profile } from './profile';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
describe('Profile Page', () => {
  it('should toggle theme', () => {
    const toggle = document.getElementById('themeToggle') as HTMLInputElement;
    toggle.checked = true;
    toggle.dispatchEvent(new Event('change'));
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
  });
});
