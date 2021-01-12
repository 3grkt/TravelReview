using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using TravelReview.Models.Review;
using TravelReview.Repository;

namespace TravelReview.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IPhotoRepository _photoRepository;

        public ReviewController(IReviewRepository reviewRepository,
                IPhotoRepository photoRepository)
        {
            _reviewRepository = reviewRepository;
            _photoRepository = photoRepository;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Review>> Create(ReviewCreate reviewCreate)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);

            if (reviewCreate.PhotoId.HasValue)
            {
                var photo = await _photoRepository.GetAsync(reviewCreate.PhotoId.Value);

                if (photo.ApplicationUserId != applicationUserId)
                {
                    return BadRequest("You did not upload the photo.");
                }
            }

            var review = await _reviewRepository.UpsertAsync(reviewCreate, applicationUserId);

            return Ok(review);
        }

        [HttpGet]
        public async Task<ActionResult<PagedResults<Review>>> GetAll([FromQuery] ReviewPaging reviewPaging)
        {
            var reviews = await _reviewRepository.GetAllAsync(reviewPaging);

            return Ok(reviews);
        }

        [HttpGet("{reviewId}")]
        public async Task<ActionResult<Review>> Get(int reviewId)
        {
            var review = await _reviewRepository.GetAsync(reviewId);

            return Ok(review);
        }

        [HttpGet("user/{applicationUserId}")]
        public async Task<ActionResult<List<Review>>> GetByApplicationUserId(int applicationUserId)
        {
            var reviews = await _reviewRepository.GetAllByUserIdAsync(applicationUserId);

            return Ok(reviews);
        }

        [HttpGet("famous")]
        public async Task<ActionResult<List<Review>>> GetAllFamous()
        {
            var reviews = await _reviewRepository.GetAllFamousAsync();

            return Ok(reviews);
        }

        [Authorize]
        [HttpDelete("{reviewId}")]
        public async Task<ActionResult<int>> Delete(int reviewId)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);

            var foundReview = await _reviewRepository.GetAsync(reviewId);

            if (foundReview == null)
            {
                return BadRequest("Review does not exists.");
            }

            if (foundReview.ApplicationUserId == applicationUserId)
            {
                var effectedRows = await _reviewRepository.DeleteAsync(reviewId);

                return Ok(effectedRows);
            }
            else
            {
                return BadRequest("You did not create this review.");
            }
        }
    }
}
