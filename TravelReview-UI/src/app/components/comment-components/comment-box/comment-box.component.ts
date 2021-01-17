import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReviewCommentCreate } from 'src/app/models/review-comment/review-comment-create.model';
import { ReviewCommentViewModel } from 'src/app/models/review-comment/review-comment-view-model.model';
import { ReviewComment } from 'src/app/models/review-comment/review-comment.model';
import { ReviewCommentService } from 'src/app/services/review-comment.service';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css']
})
export class CommentBoxComponent implements OnInit {

  @Input() comment: ReviewCommentViewModel = new ReviewCommentViewModel(0, 0, 0, "", "", null, null, false, false, false, []);
  @Output() commentSaved = new EventEmitter<ReviewComment>();

  @ViewChild('commentForm') commentForm: NgForm = new NgForm([], []);

  constructor(
    private reviewCommentService: ReviewCommentService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  resetComment() {
    this.commentForm.reset();
  }

  onSubmit() {
    let reviewCommentCreate: ReviewCommentCreate = {
      reviewCommentId: this.comment.reviewCommentId,
      parentReviewCommentId: this.comment.parentReviewCommentId,
      reviewId: this.comment.reviewId,
      content: this.comment.content
    };

    this.reviewCommentService.create(reviewCommentCreate).subscribe(reviewComment => {
      this.commentSaved.emit(reviewComment);
      this.resetComment();
      this.toastr.info("Comment saved.");
    });
  }
}
