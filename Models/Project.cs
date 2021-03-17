using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace ProjectTracker.Models
{
    public class Project
    {
        public int Id {get; set;}
        public string Name {get; set;}
        public int Type {get; set;}
        public int CreatorId {get; set;}

        [DataType(DataType.Date)]
        public DateTime DateCreated {get; set;} 

        public List<Issue> Issues {get; set;}
        public List<User> Users {get; set;}
    }
}