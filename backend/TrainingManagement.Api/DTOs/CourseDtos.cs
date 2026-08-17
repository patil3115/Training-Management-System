using System.ComponentModel.DataAnnotations;
using TrainingManagement.Api.Enums;

namespace TrainingManagement.Api.DTOs;

// ─── Request DTOs ───

public class CourseCreateDto
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(250, ErrorMessage = "Description cannot exceed 250 characters.")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Category is required.")]
    public CategoryEnum Category { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Duration must be greater than 0 hours.")]
    public int DurationHours { get; set; }

    [Required(ErrorMessage = "Level is required.")]
    public LevelEnum Level { get; set; }

    [Required(ErrorMessage = "Start date is required.")]
    public DateTime StartDate { get; set; }

    [Required(ErrorMessage = "End date is required.")]
    public DateTime EndDate { get; set; }
}

public class CourseUpdateDto : CourseCreateDto
{
}

// ─── Response DTOs ───

public class CourseResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public int DurationHours { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int CurrentEnrollmentCount { get; set; }
}
