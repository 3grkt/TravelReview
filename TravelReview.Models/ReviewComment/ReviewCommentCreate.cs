using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TravelReview.Models.ReviewComment
{
    public class ReviewCommentCreate
    {
        public int ReviewCommentId { get; set; }

        public int? ParentReviewCommentId { get; set; }

        public int ReviewId { get; set; }

        [Required(ErrorMessage = "Content is required")]
        [MinLength(10, ErrorMessage = "Must be 10-300 characters")]
        [MaxLength(300, ErrorMessage = "Must be 10-300 characters")]
        public string Content { get; set; }
    }
}
