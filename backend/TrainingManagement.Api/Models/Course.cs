using System.ComponentModel.DataAnnotations;
using TrainingManagement.Api.Enums;

namespace TrainingManagement.Api.Models;

public class Course
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(250)]
    public string? Description { get; set; }

    public CategoryEnum Category { get; set; }

    public int DurationHours { get; set; }

    public LevelEnum Level { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public List<Enrollment> Enrollments { get; set; } = new();
}
