import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Review } from 'src/app/models/review/review.model';
import { PhotoService } from 'src/app/services/photo.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  review: Review = new Review(-1, "", "", -1, "", new Date, new Date);
  reviewPhotoUrl: string = "";

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private photoService: PhotoService
  ) { }

  ngOnInit(): void {
    const reviewId = parseInt(this.route.snapshot.paramMap.get('id')?? "");
    this.reviewService.get(reviewId).subscribe(review => {
      this.review = review;

      if (!!this.review.photoId) {
        this.photoService.get(this.review.photoId).subscribe(photo => {
          this.reviewPhotoUrl = photo.imageUrl;
        })
      }
    })
  }

}
