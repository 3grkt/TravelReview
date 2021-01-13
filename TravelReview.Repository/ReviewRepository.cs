using Dapper;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using TravelReview.Models.Review;

namespace TravelReview.Repository
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly IConfiguration _config;

        public ReviewRepository(IConfiguration config)
        {
            _config = config;
        }

        public async Task<int> DeleteAsync(int reviewId)
        {
            int affectedRows = 0;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                affectedRows = await connection.ExecuteAsync(
                        "Review_Delete",
                        new { ReviewId = reviewId },
                        commandType: CommandType.StoredProcedure);
            }

            return affectedRows;
        }

        public async Task<PagedResults<Review>> GetAllAsync(ReviewPaging reviewPaging)
        {
            var results = new PagedResults<Review>();

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                using (var multi = await connection.QueryMultipleAsync(
                        "Review_GetAll",
                        new
                        {
                            Offset = (reviewPaging.Page - 1) * reviewPaging.PageSize,
                            PageSize = reviewPaging.PageSize
                        },
                        commandType: CommandType.StoredProcedure))
                {
                    results.Items = multi.Read<Review>();

                    results.TotalCount = multi.ReadFirst<int>();
                }

            }
            return results;
        }

        public async Task<List<Review>> GetAllByUserIdAsync(int applicationUserId)
        {
            IEnumerable<Review> reviews;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                reviews = await connection.QueryAsync<Review>(
                        "Review_GetByUserId",
                        new { ApplicationUserId = applicationUserId },
                        commandType: CommandType.StoredProcedure);
            }

            return reviews.ToList();
        }

        public async Task<List<Review>> GetAllFamousAsync()
        {
            IEnumerable<Review> famousReviews;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                famousReviews = await connection.QueryAsync<Review>(
                        "Review_GetAllFamous",
                        new { },
                        commandType: CommandType.StoredProcedure);
            }

            return famousReviews.ToList();
        }

        public async Task<Review> GetAsync(int reviewId)
        {
            Review review;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                review = await connection.QueryFirstOrDefaultAsync<Review>(
                        "Review_Get",
                        new { ReviewId = reviewId },
                        commandType: CommandType.StoredProcedure);
            }

            return review;
        }

        public async Task<Review> UpsertAsync(ReviewCreate reviewCreate, int applicationUserId)
        {
            using (var dataTable = new DataTable())
            {
                dataTable.Columns.Add("ReviewId", typeof(int));
                dataTable.Columns.Add("Title", typeof(string));
                dataTable.Columns.Add("Content", typeof(string));
                dataTable.Columns.Add("PhotoId", typeof(int));

                dataTable.Rows.Add(reviewCreate.ReviewId, reviewCreate.Title, reviewCreate.Content, reviewCreate.PhotoId);

                int? newReviewId;

                using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();

                    newReviewId = await connection.ExecuteScalarAsync<int?>(
                        "Review_Upsert",
                        new
                        {
                            Review = dataTable.AsTableValuedParameter("dbo.ReviewType"),
                            ApplicationUserId = applicationUserId
                        },
                        commandType: CommandType.StoredProcedure);
                }

                newReviewId = newReviewId ?? reviewCreate.ReviewId;

                Review review = await GetAsync(newReviewId.Value);

                return review;
            }
        }
    }
}
