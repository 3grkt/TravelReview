using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TravelReview.Models.Review;

namespace TravelReview.Repository
{
    public interface IReviewRepository
    {
        public Task<Review> UpsertAsync(ReviewCreate reviewCreate, int applicationUserId);

        public Task<PagedResults<Review>> GetAllAsync(ReviewPaging reviewPaging);

        public Task<Review> GetAsync(int reviewId);

        public Task<List<Review>> GetAllByUserIdAsync(int applicationUserId);

        public Task<List<Review>> GetAllFamousAsync();

        public Task<int> DeleteAsync(int reviewId);
    }
}
