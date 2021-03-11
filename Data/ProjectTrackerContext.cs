using Microsoft.EntityFrameworkCore;
using ProjectTracker.Models;

namespace ProjectTracker.Data
{
    public class ProjectTrackerContext : DbContext
    {
        public ProjectTrackerContext(DbContextOptions<ProjectTrackerContext> options)
            : base(options)
        {
        }

        public DbSet<Issue> Issue { get; set; }

        public DbSet<Project> Project { get; set; }

        public DbSet<User> User { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasIndex(u => u.Auth0Key).IsUnique();
        }
    }
}