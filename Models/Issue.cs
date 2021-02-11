using System;
using System.ComponentModel.DataAnnotations;

namespace ProjectTracker.Models
{
    public class Issue
    {
        public int Id {get; set;}
        [DataType(DataType.Date)]
        public int IssueType {get; set;}
        public int IssueStage {get; set;}
        public string Summary {get; set;}
        public string Description {get; set;}
        public int CreatedBy {get; set;}
        [DataType(DataType.Date)]
        public DateTime DateCreated {get; set;}

    }
}