namespace TimeTableAPI.Models
{
    public class TimeTableRequest
    {
        public int WorkingDays { get; set; }
        public int SubjectsPerDay { get; set; }
        public int TotalSubjects { get; set; }
        public List<SubjectHours> Subjects { get; set; }
    }

    public class SubjectHours
    {
        public string SubjectName { get; set; }
        public int Hours { get; set; }
    }

}
