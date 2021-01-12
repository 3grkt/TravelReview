using System;
using System.Collections.Generic;
using System.Text;
using TravelReview.Models.Account;

namespace TravelReview.Services
{
    public interface ITokenService
    {
        public string CreateToken(ApplicationUserIdentity user);
    }
}
