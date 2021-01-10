using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TravelReview.Models.Review
{
    public class ReviewCreate
    {
        public int ReviewId { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [MinLength(10, ErrorMessage = "Must be 10-50 characters")]
        [MaxLength(50, ErrorMessage = "Must be 10-50 characters")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Content is required")]
        [MinLength(50, ErrorMessage = "Must be 50-3000 characters")]
        [MaxLength(3000, ErrorMessage = "Must be 50-3000 characters")]
        public string Content { get; set; }

        public int? PhotoId { get; set; }
    }
}
