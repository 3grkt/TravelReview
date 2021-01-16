import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagedResult } from '../models/review/paged-result.model';
import { ReviewCreate } from '../models/review/review-create.model';
import { ReviewPaging } from '../models/review/review-paging.model';
import { Review } from '../models/review/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) {

  }

  create(model: ReviewCreate) : Observable<Review> {
    return this.http.post<Review>(`${environment.webApi}/Review`, model);
  }

  getAll(reviewPaging: ReviewPaging) : Observable<PagedResult<Review>> {
    return this.http.get<PagedResult<Review>>(
      `${environment.webApi}/Review?Page=${reviewPaging.page}&PageSize=${reviewPaging.pageSize}`);
  }

  get(reviewId: number) : Observable<Review> {
    return this.http.get<Review>(`${environment.webApi}/Review/${reviewId}`);
  }

  getByApplicationUserId(applicationUserId: number) : Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.webApi}/Review/user/${applicationUserId}`);
  }

  getMostFamous() : Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.webApi}/Review/famous`);
  }

  delete(reviewId: number) : Observable<number> {
    return this.http.delete<number>(`${environment.webApi}/Review/${reviewId}`);
  }
}
