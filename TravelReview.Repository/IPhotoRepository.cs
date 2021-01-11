using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TravelReview.Models.Photo;

namespace TravelReview.Repository
{
    public interface IPhotoRepository
    {
        public Task<Photo> InsertAsync(PhotoCreate photoCreate, int applicationUserId);

        public Task<Photo> GetAsync(int photoId);

        public Task<List<Photo>> GetAllByUserIdAsync(int applicationUserId);

        public Task<int> DeleteAsync(int photoId);
    }
}
