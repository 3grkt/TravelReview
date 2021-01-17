import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReviewCommentCreate } from 'src/app/models/review-comment/review-comment-create.model';
import { ReviewCommentViewModel } from 'src/app/models/review-comment/review-comment-view-model.model';
import { ReviewComment } from 'src/app/models/review-comment/review-comment.model';
import { AccountService } from 'src/app/services/account.service';
import { ReviewCommentService } from 'src/app/services/review-comment.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input() comments: Array<ReviewCommentViewModel> = [];

  constructor(
    public accountService: AccountService,
    private toastr: ToastrService,
    private reviewCommentService: ReviewCommentService
  ) { }

  ngOnInit(): void {
  }

  editComment(comment: ReviewCommentViewModel) {
    comment.isEditable = true;
  }

  showDeleteConfirm(comment: ReviewCommentViewModel) {
    comment.deleteConfirm = true;
  }

  cancelDeleteConfirm(comment: ReviewCommentViewModel) {
    comment.deleteConfirm = false;
  }

  deleteConfirm(comment: ReviewCommentViewModel, comments: ReviewCommentViewModel[]) {
    this.reviewCommentService.delete(comment.reviewCommentId?? 0).subscribe(() => {
      let index = 0;

      for (let i=0; i<comments.length; i++) {
        if (comments[i].reviewCommentId === comment.reviewCommentId) {
          index = i;
        }
      }

      if (index > -1) {
        comments.splice(index, 1);
      }

      this.toastr.info("Review comment deleted.");
    });
  }

  replyComment(comment: ReviewCommentViewModel) {
    let replyComment: ReviewCommentViewModel = {
      parentReviewCommentId: comment.reviewCommentId,
      content: '',
      reviewId: comment.reviewId,
      reviewCommentId: -1,
      username: this.accountService.currentUserValue.username,
      publishDate: new Date(),
      updateDate: new Date(),
      isEditable: false,
      deleteConfirm: false,
      isReplying: true,
      comments: []
    };

    comment.comments.push(replyComment);
  }

  onCommentSaved(reviewComment: ReviewComment, comment: ReviewCommentViewModel) {
    comment.reviewCommentId = reviewComment.reviewCommentId;
    comment.parentReviewCommentId = reviewComment.parentReviewCommentId??null;
    comment.reviewId = reviewComment.reviewId;
    comment.content = reviewComment.content;
    comment.publishDate = reviewComment.publishDate;
    comment.updateDate = reviewComment.updateDate;
    comment.username = reviewComment.username;
    comment.isEditable = false;
    comment.isReplying = false;
  }
}
