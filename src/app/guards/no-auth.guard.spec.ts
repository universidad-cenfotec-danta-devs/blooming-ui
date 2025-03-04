import { TestBed } from '@angular/core/testing';
import { NoAuthGuard } from './no-auth.guard';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SHARED_IMPORTS } from '../shared/shared.module';

describe('NoAuthGuard', () => {
  let guard: NoAuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    // Create a spy object for the Router with a spy for the navigate method
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        NoAuthGuard,
        { provide: Router, useValue: spy }
      ],
       imports:[...SHARED_IMPORTS],
    });

    guard = TestBed.inject(NoAuthGuard);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Create dummy ActivatedRouteSnapshot and RouterStateSnapshot objects
    route = {} as ActivatedRouteSnapshot;
    state = { url: '/login' } as RouterStateSnapshot;
  });

  it('should allow activation if no token exists', () => {
    // Ensure there is no token in localStorage
    localStorage.removeItem('token');

    const result = guard.canActivate(route, state);
    expect(result).toBe(true);
  });

  it('should block activation and navigate to "/home" if a token exists', () => {
    // Set a dummy token in localStorage
    localStorage.setItem('token', 'dummy-token');

    const result = guard.canActivate(route, state);
    
    // Expect that the guard returns false since the user is considered authenticated
    expect(result).toBe(false);
    
    // Expect that the guard calls Router.navigate with the '/home' route
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);

    // Clean up localStorage
    localStorage.removeItem('token');
  });
});
