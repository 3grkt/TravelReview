import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReviewCommentCreate } from '../models/review-comment/review-comment-create.model';
import { ReviewComment } from '../models/review-comment/review-comment.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewCommentService {

  constructor(private http: HttpClient) { 

  }

  create(model: ReviewCommentCreate) : Observable<ReviewComment>{
    return this.http.post<ReviewComment>(`${environment.webApi}/ReviewComment`, model);
  }

  delete(reviewCommentId: number) : Observable<number>{
    return this.http.delete<number>(`${environment.webApi}/ReviewComment/${reviewCommentId}`);
  }

  getAll(reviewId: number) : Observable<ReviewComment[]> {
    return this.http.get<ReviewComment[]>(`${environment.webApi}/ReviewComment/${reviewId}`);
  }
}
