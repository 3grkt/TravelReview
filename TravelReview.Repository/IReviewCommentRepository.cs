using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TravelReview.Models.ReviewComment;

namespace TravelReview.Repository
{
    public interface IReviewCommentRepository
    {
        public Task<ReviewComment> UpsertAsync(ReviewCommentCreate reviewCommentCreate, int applicationUserId);

        public Task<List<ReviewComment>> GetAllAsync(int reviewId);

        public Task<ReviewComment> GetAsync(int reviewCommentId);

        public Task<int> DeleteAsync(int reviewCommentId);
    }
}
