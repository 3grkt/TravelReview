import { asNativeElements, Component, Input, OnInit } from '@angular/core';
import { ReviewCommentViewModel } from 'src/app/models/review-comment/review-comment-view-model.model';
import { ReviewComment } from 'src/app/models/review-comment/review-comment.model';
import { AccountService } from 'src/app/services/account.service';
import { ReviewCommentService } from 'src/app/services/review-comment.service';

@Component({
  selector: 'app-comment-system',
  templateUrl: './comment-system.component.html',
  styleUrls: ['./comment-system.component.css']
})
export class CommentSystemComponent implements OnInit {

  @Input() reviewId: number = 0;
  standAloneComment: ReviewCommentViewModel = new ReviewCommentViewModel(0, 0, 0, "", "", null, null, false, false, false, []);
  reviewComments: Array<ReviewComment> = [];
  reviewCommentViewModels: Array<ReviewCommentViewModel> = [];


  constructor(
    private reviewCommentService: ReviewCommentService,
    public accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.reviewCommentService.getAll(this.reviewId).subscribe(reviewComments => {
      if (this.accountService.isLoggedIn()) {
        this.initComment(this.accountService.currentUserValue.username);
      }

      this.reviewComments = reviewComments;
      this.reviewCommentViewModels = [];

      for (let i=0; i<this.reviewComments.length; i++) {
        if (!this.reviewComments[i].parentReviewCommentId) {
          this.findCommentReplies(this.reviewCommentViewModels, i);
        }
      }
    })
  }

  initComment(username: string) {
    this.standAloneComment = {
      parentReviewCommentId: null,
      content: '',
      reviewId: this.reviewId,
      reviewCommentId: -1,
      username: username,
      publishDate: null,
      updateDate: null,
      isEditable: false,
      deleteConfirm: false,
      isReplying: false,
      comments: []
    };
  }

  findCommentReplies(reviewCommentViewModels: any[], index: number) {
    let firstElement = this.reviewComments[index];
    let newComments: ReviewCommentViewModel[] = [];

    let commentViewModel: ReviewCommentViewModel = {
      parentReviewCommentId: firstElement.parentReviewCommentId || null,
      content: firstElement.content,
      reviewId: firstElement.reviewId,
      reviewCommentId: firstElement.reviewCommentId,
      username: firstElement.username,
      publishDate: firstElement.publishDate,
      updateDate: firstElement.updateDate,
      isEditable: false,
      deleteConfirm: false,
      isReplying: false,
      comments: newComments
    };

    reviewCommentViewModels.push(commentViewModel);

    for (let i=0; i<this.reviewComments.length; i++) {
      if (this.reviewComments[i].parentReviewCommentId === firstElement.reviewCommentId) {
        this.findCommentReplies(newComments, i);
      }
    }
  }

  onCommentSaved(reviewComment: ReviewComment) {
    let commentViewModel: ReviewCommentViewModel = {
      parentReviewCommentId: reviewComment.parentReviewCommentId?? null,
      content: reviewComment.content,
      reviewId: reviewComment.reviewId,
      reviewCommentId: reviewComment.reviewCommentId,
      username: reviewComment.username,
      publishDate: reviewComment.publishDate,
      updateDate: reviewComment.updateDate,
      isEditable: false,
      deleteConfirm: false,
      isReplying: false,
      comments: []
    }

    this.reviewCommentViewModels.unshift(commentViewModel);
  }

  
}
