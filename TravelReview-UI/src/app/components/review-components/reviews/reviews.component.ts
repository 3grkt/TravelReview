import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PagedResult } from 'src/app/models/review/paged-result.model';
import { ReviewPaging } from 'src/app/models/review/review-paging.model';
import { Review } from 'src/app/models/review/review.model';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  pagedReviewResult: PagedResult<Review> = new PagedResult<Review>([], 0);

  constructor(
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.loadPagedReviewResult(1, 6);
  }

  pageChanged(event: PageChangedEvent) : void {
    this.loadPagedReviewResult(event.page, event.itemsPerPage);
  }

  loadPagedReviewResult(page: number, itemsPerPage: number) {
    let reviewPaging = new ReviewPaging(page, itemsPerPage);

    this.reviewService.getAll(reviewPaging).subscribe(pagedReviews => {
      this.pagedReviewResult = pagedReviews;
    });
  }
}
