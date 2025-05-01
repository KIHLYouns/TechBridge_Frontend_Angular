import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService]
    });
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Make sure that there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Add more tests for service methods (e.g., getReviewsForUser)
  // Example test structure:
  /*
  it('should fetch reviews for a user', () => {
    const dummyReviews = [
      { id: 1, rating: 5, comment: 'Excellent', created_at: new Date() },
      { id: 2, rating: 4, comment: 'Good', created_at: new Date() }
    ];
    const userId = 123;

    service.getReviewsForUser(userId).subscribe(reviews => {
      expect(reviews.length).toBe(2);
      expect(reviews).toEqual(dummyReviews);
    });

    const req = httpMock.expectOne(`${service.apiUrl}?revieweeId=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReviews);
  });
  */
});
