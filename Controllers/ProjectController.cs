using ProjectTracker.Data;
using Microsoft.AspNetCore.Mvc;
using ProjectTracker.Models;
using System;
using System.Linq;
// using System.Text.Json;
// using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using Newtonsoft.Json;




namespace ProjectTracker.Controllers
{
    public class ProjectController : BaseController
    {
        public ProjectController(ProjectTrackerContext context) : base(context)
        {
        }

        public string Projects(string userId)
        {
            //add check to grab projects that the user was added to
            var projects = from p in _context.Project.Include(p => p.Users)
                           join u in _context.User
                               on p.CreatorId equals u.Id
                           where u.Auth0Key == userId
                           select p;

            string test = JsonConvert.SerializeObject(projects.ToList(), Formatting.Indented,
            new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }
            );
            return test;
        }

        public string Project(int userId, int projectId)
        {
            // need to add a check that the user has permissions to view this project
            var project = _context.Project
                .Include(p => p.Users)
                .Include(p => p.Issues) 
                .FirstOrDefault(p => p.Id == projectId);
            return JsonConvert.SerializeObject(project, Formatting.Indented,
            new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }
            );
        }

        public int Create([Bind("Id, Type, Name")] Project project, string creatorId)
        {
            User user = GetUser(creatorId);
            project.CreatorId = user.Id;
            project.DateCreated = DateTime.Now.Date;
            project.Users = new List<User>(new User[] { user });
            if (ModelState.IsValid)
            {
                _context.Add(project);
                _context.SaveChanges();
            }
            return project.Id;
        }
    }
}