using Microsoft.AspNetCore.Mvc;
using TimeTableAPI.Models;

namespace TimeTableAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TimeTableController : ControllerBase
{
    [HttpPost("generate")]
    public ActionResult<List<SubjectHours>> GenerateSubjects([FromBody] TimeTableRequest input)
    {
        var subjects = new List<SubjectHours>();
        for (int i = 1; i <= input.TotalSubjects; i++)
        {
            subjects.Add(new SubjectHours
            {
                SubjectName = $"Subject {i}",
                Hours = 0
            });
        }
        return Ok(subjects);
    }

    [HttpPost("timetable")]
    public ActionResult<string[][]> GenerateTimeTable(
    [FromBody] List<SubjectHours> subjectHours,
    [FromQuery] int workingDays,
    [FromQuery] int subjectsPerDay)
    {
        int totalHours = workingDays * subjectsPerDay;
        var flatList = new List<string>();

        foreach (var subject in subjectHours)
        {
            flatList.AddRange(Enumerable.Repeat(subject.SubjectName, subject.Hours));
        }

        if (flatList.Count != totalHours)
            return BadRequest($"Total hours do not match. Expected: {totalHours}, Received: {flatList.Count}");

        var random = new Random();

        // Create jagged array with subjectsPerDay rows (subjects per day), and workingDays columns (days)
        var timetable = new string[subjectsPerDay][];
        for (int i = 0; i < subjectsPerDay; i++)
        {
            timetable[i] = new string[workingDays];
        }

        for (int day = 0; day < workingDays; day++)
        {
            for (int subjectSlot = 0; subjectSlot < subjectsPerDay; subjectSlot++)
            {
                int index = random.Next(flatList.Count);
                timetable[subjectSlot][day] = flatList[index];
                flatList.RemoveAt(index);
            }
        }

        return Ok(timetable);
    }


}
