using ProjectTracker.Data;
using Microsoft.AspNetCore.Mvc;
using ProjectTracker.Models;
using System;
using System.Linq;
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
            // select projects from project join user on userid == authkey where p.creatorid == u.id or 
            var projects = from u in _context.User
                           .Include(u => u.Projects)
                           .ThenInclude(p => p.Users)
                           where u.Auth0Key == userId
                           select (u.Projects);
            var thing = projects.ToList();
            string test = projects.ToQueryString();
            string result = JsonConvert.SerializeObject(projects.ToList().First(), Formatting.Indented,
            new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }
            );
            return result;
        }

        public string Project(string userId, int projectId)
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