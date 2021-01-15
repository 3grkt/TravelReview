import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Review } from 'src/app/models/review/review.model';
import { AccountService } from 'src/app/services/account.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userReviews: Review[] = [];

  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    let currentApplicationUserId = this.accountService.currentUserValue.applicationUserId;

    this.reviewService.getByApplicationUserId(currentApplicationUserId).subscribe(userReviews => {
      this.userReviews = userReviews;
    })
  }

  confirmDelete(review: Review) {
    review.deleteConfirm = true;
  }

  cancelDeleteConfirm(review: Review) {
    review.deleteConfirm = false;
  }

  deleteConfirmed(review: Review, reviews: Review[]) {
    this.reviewService.delete(review.reviewId).subscribe(() => {
      let index = -1;
      for (let i=0; i<reviews.length; i++) {
        if (reviews[i].reviewId === review.reviewId) {
          index = i;
        }
      }

      if (index > -1) {
        reviews.splice(index, 1);
      }

      this.toastr.info("Review deleted.");
    });
  }

  editReview(reviewId: number) {
    this.router.navigate([`/dashboard/${reviewId}`]);
  }

  createReview() {
    this.router.navigate(['/dashboard/-1']);
  }
}
