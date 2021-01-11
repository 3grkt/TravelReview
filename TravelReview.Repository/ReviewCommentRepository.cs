using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelReview.Models.Review;
using TravelReview.Models.ReviewComment;

namespace TravelReview.Repository
{
    public class ReviewCommentRepository : IReviewCommentRepository
    {
        private readonly IConfiguration _config;

        public ReviewCommentRepository(IConfiguration config)
        {
            _config = config;
        }

        public async Task<int> DeleteAsync(int reviewCommentId)
        {
            int affectedRows = 0;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                affectedRows = await connection.ExecuteAsync(
                        "ReviewComment_Delete",
                        new { ReviewCommentId = reviewCommentId },
                        commandType: CommandType.StoredProcedure);
            }

            return affectedRows;
        }

        public async Task<List<ReviewComment>> GetAllAsync(int reviewId)
        {
            IEnumerable<ReviewComment> reviewComments;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                reviewComments = await connection.QueryAsync<ReviewComment>(
                        "ReviewComment_GetAll",
                        new { ReviewId = reviewId },
                        commandType: CommandType.StoredProcedure);
            }

            return reviewComments.ToList();
        }

        public async Task<ReviewComment> GetAsync(int reviewCommentId)
        {
            ReviewComment reviewComment;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                reviewComment = await connection.QueryFirstOrDefaultAsync<ReviewComment>(
                        "ReviewComment_Get",
                        new { ReviewCommentId = reviewCommentId },
                        commandType: CommandType.StoredProcedure);
            }

            return reviewComment;
        }

        public async Task<ReviewComment> UpsertAsync(ReviewCommentCreate reviewCommentCreate, int applicationUserId)
        {
            using (var dataTable = new DataTable())
            {
                dataTable.Columns.Add("ReviewCommentId", typeof(int));
                dataTable.Columns.Add("ParentReviewCommentId", typeof(int));
                dataTable.Columns.Add("ReviewId", typeof(int));
                dataTable.Columns.Add("Content", typeof(string));

                dataTable.Rows.Add(
                        reviewCommentCreate.ReviewCommentId, 
                        reviewCommentCreate.ParentReviewCommentId, 
                        reviewCommentCreate.ReviewId, 
                        reviewCommentCreate.Content);

                int? newReviewCommentId;

                using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();

                    newReviewCommentId = await connection.ExecuteScalarAsync<int?>(
                        "ReviewComment_Upsert",
                        new
                        {
                            ReviewComment = dataTable.AsTableValuedParameter("dbo.ReviewCommentType")
                        },
                        commandType: CommandType.StoredProcedure);
                }

                newReviewCommentId = newReviewCommentId ?? reviewCommentCreate.ReviewCommentId;

                ReviewComment reviewComment = await GetAsync(newReviewCommentId.Value);

                return reviewComment;
            }
        }
    }
}
