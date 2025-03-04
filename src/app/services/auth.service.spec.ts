import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SHARED_IMPORTS } from '../shared/shared.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, [...SHARED_IMPORTS]], // ✅ Provide HttpClient
      providers: [AuthService], // ✅ Provide AuthService
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store JWT token after successful Google login', () => {
    spyOn(service, 'sendGoogleTokenToBackend').and.returnValue(
      of({ success: true, token: 'mocked-jwt-token' })
    );
    spyOn(localStorage, 'setItem');

    service.handleGoogleResponse({ credential: 'mock-google-token' });

    expect(service.sendGoogleTokenToBackend).toHaveBeenCalledWith('mock-google-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'mocked-jwt-token');
  });
});
