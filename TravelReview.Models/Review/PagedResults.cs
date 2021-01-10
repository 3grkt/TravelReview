using System;
using System.Collections.Generic;
using System.Text;

namespace TravelReview.Models.Review
{
    public class PagedResults<T>
    {
        public IEnumerable<T> Items { get; set; }

        public int TotalCount { get; set; }
    }
}
