using System;
using System.Collections.Generic;
using System.Text;

namespace TravelReview.Models.Review
{
    public class ReviewPaging
    {
        public int Page { get; set; } = 1;

        public int PageSize { get; set; } = 6;
    }
}
