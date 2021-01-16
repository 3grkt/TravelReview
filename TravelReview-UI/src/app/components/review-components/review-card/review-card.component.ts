import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Review } from 'src/app/models/review/review.model';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent implements OnInit {

  @Input() review: Review = new Review(-1, "", "", -1, "", new Date, new Date);
  reviewPhotoUrl: string = "";

  constructor(
    private router: Router,
    private photoService: PhotoService
  ) { }

  ngOnInit(): void {
    if (!!this.review.photoId){
        this.photoService.get(this.review.photoId).subscribe(photo => {
          if (!!photo) {
            this.reviewPhotoUrl = photo.imageUrl;
          }
        })
    }

  }

  readMore(reviewId: number) {
    this.router.navigate([`/reviews/${reviewId}`]);
  }
}
