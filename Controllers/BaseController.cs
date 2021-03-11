using ProjectTracker.Data;
using Microsoft.AspNetCore.Mvc;
using ProjectTracker.Models;
using System;
using System.Linq;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;



namespace ProjectTracker.Controllers
{
    public abstract class BaseController : Controller
    {
        protected readonly ProjectTrackerContext _context;

        public BaseController(ProjectTrackerContext context)
        {
            _context = context;
        }

        protected User GetUser(string auth0Key)
        {
            return _context.User.FirstOrDefault(u => u.Auth0Key == auth0Key);
        }

        protected Project GetProject(int projectId) {
            return _context.Project.Include(p => p.Users).FirstOrDefault(p => p.Id == projectId);
        }
    }
}