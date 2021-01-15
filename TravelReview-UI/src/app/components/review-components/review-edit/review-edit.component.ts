import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ToastrService } from 'ngx-toastr';
import { Photo } from 'src/app/models/photo/photo.model';
import { ReviewCreate } from 'src/app/models/review/review-create.model';
import { Review } from 'src/app/models/review/review.model';
import { PhotoService } from 'src/app/services/photo.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-review-edit',
  templateUrl: './review-edit.component.html',
  styleUrls: ['./review-edit.component.css']
})
export class ReviewEditComponent implements OnInit {

  reviewForm: FormGroup = new FormGroup({});
  confirmImageDelete: boolean = false;
  userPhotos: Photo[] = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private reviewService: ReviewService,
    private photoService: PhotoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const reviewId = parseInt(this.route.snapshot.paramMap.get('id')??"");

    this.reviewForm = this.formBuilder.group({
      reviewId: [reviewId],
      title: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(50)
      ]],
      content: ['', [
        Validators.required,
        Validators.minLength(300),
        Validators.maxLength(5000)
      ]],
      photoDescription: [null],
      photoId: [null]
    });

    this.photoService.getByApplicationUserId().subscribe(userPhotos => {
      this.userPhotos = userPhotos;
    });

    if (!!reviewId && reviewId !== -1) {
      this.reviewService.get(reviewId).subscribe(review => {
        this.updateForm(review);
      })
    }
  }

  getPhoto(photoId: number) {
    for (let i=0; i<this.userPhotos.length; i++) {
      if(this.userPhotos[i].photoId === photoId) {
        return this.userPhotos[i];
      }
    }
    return null;
  }

  isTouched(field: string) {
    return this.reviewForm.get(field)?.touched;
  }

  hasErrors(field: string) {
    return this.reviewForm.get(field)?.errors;
  }

  hasError(field: string, error: string) {
    return !!this.reviewForm.get(field)?.hasError(error);
  }

  isNew() {
    return parseInt(this.reviewForm.get('reviewId')?.value) === -1;
  }

  detachPhoto() {
    this.reviewForm.patchValue({
      photoId: null,
      photoDescription: null
    });
  }

  updateForm(review: Review) {
    let photoDescription = this.getPhoto(review.photoId?? 0)?.description;

    this.reviewForm.patchValue({
      reviewId: review.reviewId,
      title: review.title,
      content: review.content,
      photoId: review.photoId,
      photoDescription: photoDescription
    });
  }

  onSelect(event: TypeaheadMatch): void {
    let chosenPhoto: Photo = event.item;

    this.reviewForm.patchValue({
      photoId: chosenPhoto.photoId,
      photoDescription: chosenPhoto.description
    });
  }

  onSubmit() {
    let reviewCreate: ReviewCreate = new ReviewCreate(
      this.reviewForm.get("reviewId")?.value,
      this.reviewForm.get("title")?.value,
      this.reviewForm.get("content")?.value,
      this.reviewForm.get("photoId")?.value
    );

    this.reviewService.create(reviewCreate).subscribe(createdReview => {
      this.updateForm(createdReview);
      this.toastr.info("Review saved.");
    })
  }
}
