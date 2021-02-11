using Microsoft.EntityFrameworkCore;
using ProjectTracker.Models;

namespace ProjectTracker.Data
{
    public class ProjectTrackerContext : DbContext
    {
        public ProjectTrackerContext (DbContextOptions<ProjectTrackerContext> options) 
            : base(options)
            {
            }

            public DbSet<Issue> Issue {get; set;}
    }
}