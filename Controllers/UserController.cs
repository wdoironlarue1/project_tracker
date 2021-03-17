using ProjectTracker.Data;
using Microsoft.AspNetCore.Mvc;
using ProjectTracker.Models;
using System.IO;
using System.Linq;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;



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

        public string UsersLike(string searchString, int returnNumber)
        {
            var users = from u in _context.User
                        where EF.Functions.Like(u.NickName, searchString + "%")
                        select u;
            users.Take(returnNumber);
            return JsonSerializer.Serialize(users.ToList());
        }

        public string Add(int projectId, string userIdsString)
        {
            int[] userIds = Array.ConvertAll(userIdsString.Split(','), int.Parse);
            List<User> users = new List<User>();
            for (int i = 0; i < userIds.Length; i++)
            {
                users.Add(GetUser(userIds[i]));
            }
            Project project = GetProject(projectId);
            if (project != null)
            {
                project.Users = project.Users.Union(users).ToList();
                _context.SaveChanges();
            }
            return "";
        }

        public string Remove(int projectId, int userId) {
            Project project = GetProject(projectId);
            User user = project.Users.SingleOrDefault(user => user.Id == userId);
            if(user != null) {
                project.Users.Remove(user);
                _context.SaveChanges();
            }
            return "";
        }

        private bool UserExists(string auth0Key)
        {
            return _context.User.Any(e => e.Auth0Key == auth0Key);
        }
    }
}