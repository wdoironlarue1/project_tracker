using ProjectTracker.Data;
using Microsoft.AspNetCore.Mvc;
using ProjectTracker.Models;
using System;
using System.Linq;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;



namespace ProjectTracker.Controllers
{
    public class IssueController : BaseController
    {
        public IssueController(ProjectTrackerContext context) : base(context)
        {
        }

        public IActionResult Issues(int userId, int projectId)
        {
            // need to add a check that the user has permissions to view this project
            var issues = from i in _context.Issue
                         where i.ProjectId == projectId
                         select i;
            return Ok(issues.ToList());
        }

        public IActionResult Create([Bind("Id, IssueType, Summary, Description")] Issue issue, string createdBy, int projectId)
        {
            User user = GetUser(createdBy);
            // add to the join table
            issue.ProjectId = projectId;
            issue.IssueStage = Constants.ISSUE_STAGE_TO_DO;
            issue.DateCreated = DateTime.Now.Date;
            issue.CreatorId = user.Id;


            if (ModelState.IsValid)
            {
                _context.Add(issue);
                _context.SaveChanges();
            }
            return Ok(issue.Id);
        }


        public IActionResult Delete(int id)
        {
            var issue = _context.Issue.Find(id);
            if (issue != null)
            {
                _context.Issue.Remove(issue);
                _context.SaveChanges();
                return Ok();
            }
            return Problem();
        }

        public IActionResult Edit(int id, string summary, string description, int issueStage, int issueType)
        {
            var issue = _context.Issue.Find(id);
            if (issue != null)
            {
                issue.Summary = summary;
                issue.Description = description;
                issue.IssueStage = issueStage;
                issue.IssueType = issueType;

                _context.SaveChanges();
                return Ok();
            }
            return Problem();

        }

        public IActionResult Move(int id, int issueStage)
        {
            var entity = _context.Issue.Find(id);
            if (entity != null)
            {
                entity.IssueStage = issueStage;

                _context.SaveChanges();
                return Ok();
            }
            return Problem();
        }

        private bool IssueExists(int id)
        {
            return _context.Issue.Any(e => e.Id == id);
        }
    }
}