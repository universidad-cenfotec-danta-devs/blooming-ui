/*------------------------------------------------------------------
  WateringPlanService – unit tests (Jest + HttpClientTestingModule)

  ▸ Why one spec-file?
      • The service is thin – every public method is one HTTP call +
        one RxJS map.  A compact file keeps the whole contract visible.

  ▸ Test strategy for each method
      1.  Call the service method.
      2.  Expect one HTTP request with the exact verb + URL.
      3.  Flush a dummy payload and assert the mapped value the caller
          receives.

  ▸ What we do NOT test here
      • Real HTTP – that is the job of e2e / integration tests.
      • RxJS operators – we only check that the final value is correct.
 -----------------------------------------------------------------*/

 import { TestBed } from '@angular/core/testing';
 import {
   HttpClientTestingModule,
   HttpTestingController,
 } from '@angular/common/http/testing';
 
 import { WateringPlanService } from './wateringPlant.service';
 import { environment }         from '../../enviroments/enviroment.development';
 
 describe('WateringPlanService', () => {
   let service: WateringPlanService;
   let http   : HttpTestingController;
 
   /** Helpful shorthand for base-URL used in every expectation */
   const api = `${environment.apiUrl}/api/wateringPlan`;
 
   /* ───────────────────────── TestBed bootstrap ────────────────── */
   beforeEach(() => {
     TestBed.configureTestingModule({
       imports  : [HttpClientTestingModule],
       providers: [WateringPlanService],
     });
 
     service = TestBed.inject(WateringPlanService);
     http    = TestBed.inject(HttpTestingController);
   });
 
   /** Verify that no unexpected HTTP calls slipped through */
   afterEach(() => http.verify());
 
   /* ────────────────────── generateByUser() ────────────────────── */
   it('POST /generateByUser/{id} returns WateringPlan', () => {
     const mockResponse = { data: { id: 99 } };
 
     service.generateByUser(42).subscribe(plan =>
       expect(plan).toEqual({ id: 99 } as any),
     );
 
     const req = http.expectOne(`${api}/generateByUser/42`);
     expect(req.request.method).toBe('POST');
     req.flush(mockResponse);
   });
 
   /* ───────────────────── generateByAdmin() ────────────────────── */
   it('POST /generateByAdmin/{id}/{email} returns WateringPlan', () => {
     const mockResponse = { data: { id: 1, name: 'admin-plan' } };
 
     service.generateByAdmin(5, 'john@example.com').subscribe(plan =>
       expect(plan.id).toBe(1),
     );
 
     const req = http.expectOne(`${api}/generateByAdmin/5/john@example.com`);
     expect(req.request.method).toBe('POST');
     req.flush(mockResponse);
   });
 
   /* ─────────────────────── generatePDF() ──────────────────────── */
   it('GET /generatePDF/{id} returns a PDF Blob', () => {
     const pdfBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
 
     service.generatePDF(7).subscribe(blob => {
       expect(blob.size).toBe(pdfBlob.size);
       expect(blob.type).toBe('application/pdf');
     });
 
     const req = http.expectOne(`${api}/generatePDF/7`);
     expect(req.request.method).toBe('GET');
     expect(req.request.responseType).toBe('blob');   // fetches as blob
     req.flush(pdfBlob);
   });
 
   /* ──────────────── getWateringPlansByUser() ──────────────────── */
   it('GET /getWateringPlansByUser maps list correctly', () => {
     const mockResponse = { data: [{ id: 11 }, { id: 12 }] };
 
     service.getWateringPlansByUser(2, 50).subscribe(list => {
       expect(list.length).toBe(2);
       expect(list[0].id).toBe(11);
     });
 
     const req = http.expectOne(`${api}/getWateringPlansByUser?page=2&size=50`);
     expect(req.request.method).toBe('GET');
     req.flush(mockResponse);
   });
 
   /* ──────── getWateringPlansByUserAdmin() (admin view) ────────── */
   it('GET /getWateringPlansByUserAdmin maps list correctly', () => {
     const mockResponse = { data: [{ id: 21 }] };
 
     service
       .getWateringPlansByUserAdmin('ana@test.com', 1, 5)
       .subscribe(list => expect(list[0].id).toBe(21));
 
     const req = http.expectOne(
       `${api}/getWateringPlansByUserAdmin/ana@test.com?page=1&size=5`,
     );
     expect(req.request.method).toBe('GET');
     req.flush(mockResponse);
   });
 
   /* ─────────────── addImageToWateringDay() upload ─────────────── */
   it('PATCH /addImageToWateringDay/{id} uploads FormData with "img"', () => {
     const file        = new File(['x'], 'photo.png');
     const mockUpdated = { data: { id: 55, imageUrl: 'url' } };
 
     service.addImageToWateringDay(55, file).subscribe(day =>
       expect(day.id).toBe(55),
     );
 
     const req = http.expectOne(`${api}/addImageToWateringDay/55`);
     expect(req.request.method).toBe('PATCH');
 
     /* -- body is a FormData with our file under key "img" -- */
     expect(req.request.body instanceof FormData).toBeTruthy();
     expect(req.request.body.get('img')).toBe(file);
 
     req.flush(mockUpdated);
   });
 });
 