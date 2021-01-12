using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using TravelReview.Models.Photo;
using TravelReview.Repository;
using TravelReview.Services;

namespace TravelReview.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        private readonly IPhotoRepository _photoRepository;
        private readonly IReviewRepository _reviewRepository;
        private readonly IPhotoService _photoService;

        public PhotoController(IPhotoRepository photoRepository,
                IReviewRepository reviewRepository,
                IPhotoService photoService)
        {
            _photoRepository = photoRepository;
            _reviewRepository = reviewRepository;
            _photoService = photoService;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Photo>> UploadPhoto(IFormFile file)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);

            var uploadResult = await _photoService.AddPhotoAsync(file);

            if (uploadResult.Error != null)
            {
                return BadRequest(uploadResult.Error.Message);
            }

            var photoCreate = new PhotoCreate
            {
                PublicId = uploadResult.PublicId,
                ImageUrl = uploadResult.SecureUrl.AbsoluteUri,
                Description = file.FileName
            };

            var photo = await _photoRepository.InsertAsync(photoCreate, applicationUserId);

            return Ok(photo);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<Photo>>> GetByApplicationUserId()
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);

            var photos = await _photoRepository.GetAllByUserIdAsync(applicationUserId);

            return Ok(photos);
        }

        [HttpGet("{photoId}")]
        public async Task<ActionResult<Photo>> Get(int photoId)
        {
            var photo = await _photoRepository.GetAsync(photoId);

            return Ok(photo);
        }

        [Authorize]
        [HttpDelete("{photoId}")]
        public async Task<ActionResult<int>> Delete(int photoId)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);

            var foundPhoto = await _photoRepository.GetAsync(photoId);

            if(foundPhoto != null)
            {
                if(foundPhoto.ApplicationUserId == applicationUserId)
                {
                    var reviews = await _reviewRepository.GetAllByUserIdAsync(applicationUserId);

                    var usedInReview = reviews.Any(r => r.PhotoId == photoId);

                    if (usedInReview)
                    {
                        return BadRequest("Cannot remove photo as it's being used in published review(s).");
                    }

                    var deleteResult = await _photoService.DeletePhotoAsync(foundPhoto.PublicId);

                    if (deleteResult.Error != null)
                    {
                        return BadRequest(deleteResult.Error.Message);
                    }

                    var affectRows = await _photoRepository.DeleteAsync(foundPhoto.PhotoId);

                    return Ok(affectRows);
                }
                else
                {
                    return BadRequest("Photo was not uploaded by the current user.");
                }
            }

            return BadRequest("Photo does not exist.");
        }
    }
}
