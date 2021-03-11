using ProjectTracker.Data;
using Microsoft.AspNetCore.Mvc;
using ProjectTracker.Models;
using System;
using System.Linq;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;



namespace ProjectTracker.Controllers
{
    public class UserController : BaseController
    {

        public UserController(ProjectTrackerContext context) : base(context)
        {
        }

        public int Create([Bind("Id, Auth0Key, FirstName, LastName, NickName, Email")] User user)
        {
            if (!UserExists(user.Auth0Key))
            {
                if (ModelState.IsValid)
                {
                    _context.Add(user);
                    _context.SaveChanges();
                }
                return user.Id;
            }
            return 1;
        }

        public string UsersLike(string searchString, int returnNumber){
            var users = from u in _context.User 
                        where EF.Functions.Like(u.NickName, searchString + "%")
                        select u;
            users.Take(returnNumber);
            return JsonSerializer.Serialize(users.ToList());
        }

        private bool UserExists(string auth0Key)
        {
            return _context.User.Any(e => e.Auth0Key == auth0Key);
        }
    }
}