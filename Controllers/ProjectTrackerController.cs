using ProjectTracker.Data;
using Microsoft.AspNetCore.Mvc;
using ProjectTracker.Models;
using System;
using System.Linq;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;



namespace ProjectTracker.Controllers
{
    public class ProjectTrackerController : Controller
    {
        private readonly ProjectTrackerContext _context;

        public ProjectTrackerController(ProjectTrackerContext context)
        {
            _context = context;
        }

        public string Issues()
        {
            var issues = from i in _context.Issue
                         select i;
            return JsonSerializer.Serialize(issues.ToList());
        }

        public int CreateNewIssue([Bind("Id, IssueType, Summary, Description")] Issue issue)
        {
            issue.IssueStage = Constants.ISSUE_STAGE_TO_DO;
            issue.DateCreated = DateTime.Now.Date;
            if (ModelState.IsValid)
            {
                _context.Add(issue);
                _context.SaveChanges();
            }
            return issue.Id;
        }


        public string Delete(int Id)
        {
            var issue = _context.Issue.Find(Id);
            _context.Issue.Remove(issue);
            _context.SaveChanges();
            return "{\"message\": \"delete\"}";
        }

        public string Edit(int id, string summary, string description, int issueStage, int issueType)
        {
            var entity = _context.Issue.FirstOrDefault(issue => issue.Id == id);
            if (entity != null)
            {
                entity.Summary = summary;
                entity.Description = description;
                entity.IssueStage = issueStage;
                entity.IssueType = issueType;

                _context.SaveChanges();
            }

            return "edit issue";
        }

        public string Move(int id, int issueStage)
        {
            var entity = _context.Issue.FirstOrDefault(issue => issue.Id == id);
            if (entity != null)
            {
                entity.IssueStage = issueStage;

                _context.SaveChanges();
            }
            return "move issue";
        }

        private bool IssueExists(int id)
        {
            return _context.Issue.Any(e => e.Id == id);
        }
    }
}