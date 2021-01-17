import { Component, OnInit } from '@angular/core';
import { Review } from 'src/app/models/review/review.model';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-famous-reviews',
  templateUrl: './famous-reviews.component.html',
  styleUrls: ['./famous-reviews.component.css']
})
export class FamousReviewsComponent implements OnInit {

  famousReviews: Review[] = [];

  constructor(
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.reviewService.getMostFamous().subscribe(reviews => {
      this.famousReviews = reviews;
    })
  }

}
