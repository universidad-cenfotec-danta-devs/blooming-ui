import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { SHARED_IMPORTS } from '../../shared/shared.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Create a spy object for AuthService with the methods we need
    const spy = jasmine.createSpyObj('AuthService', ['googleSignIn', 'initGoogleAuth']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, TranslateModule.forRoot(), [...SHARED_IMPORTS]],
      providers: [{ provide: AuthService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initGoogleAuth on ngOnInit', () => {
    component.ngOnInit();
    expect(authServiceSpy.initGoogleAuth).toHaveBeenCalled();
  });

  it('should call googleSignIn when loginWithGoogle is called', () => {
    component.loginWithGoogle();
    expect(authServiceSpy.googleSignIn).toHaveBeenCalled();
  });
});
