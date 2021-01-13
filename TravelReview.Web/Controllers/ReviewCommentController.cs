using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using TravelReview.Models.ReviewComment;
using TravelReview.Repository;

namespace TravelReview.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewCommentController : ControllerBase
    {
        private readonly IReviewCommentRepository _reviewCommentRepository;

        public ReviewCommentController(IReviewCommentRepository reviewCommentRepository)
        {
            _reviewCommentRepository = reviewCommentRepository;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ReviewComment>> Create(ReviewCommentCreate reviewCommentCreate)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);

            var createdReviewComment = await _reviewCommentRepository.UpsertAsync(reviewCommentCreate, applicationUserId);

            return Ok(createdReviewComment);
        }

        [HttpGet("{reviewId}")]
        public async Task<ActionResult<List<ReviewComment>>> GetAll(int reviewId)
        {
            var reviewComments = await _reviewCommentRepository.GetAllAsync(reviewId);

            return Ok(reviewComments);
        }

        [Authorize]
        [HttpDelete("{reviewCommentId}")]
        public async Task<ActionResult<int>> Delete(int reviewCommentId)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);

            var foundReviewComment = await _reviewCommentRepository.GetAsync(reviewCommentId);

            if (foundReviewComment == null)
            {
                return BadRequest("Comment does not exist.");
            }

            if (foundReviewComment.ApplicationUserId == applicationUserId)
            {
                var affectedRows = await _reviewCommentRepository.DeleteAsync(reviewCommentId);

                return Ok(affectedRows);
            }
            else
            {
                return BadRequest("This comment was not created by the current user.");
            }
        }
    }
}
