using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Api.DTOs;

// ─── Request DTOs ───

public class EnrollmentCreateDto
{
    [Required(ErrorMessage = "Course ID is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Course ID must be a positive integer.")]
    public int CourseId { get; set; }

    [Required(ErrorMessage = "Learner ID is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Learner ID must be a positive integer.")]
    public int LearnerId { get; set; }
}

// ─── Response DTOs ───

/// <summary>
/// General enrollment response with full details.
/// </summary>
public class EnrollmentResponseDto
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public int LearnerId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public string LearnerName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime EnrolledOn { get; set; }
}

/// <summary>
/// Enrollment from the course perspective (used for GET /api/courses/{id}/enrollments).
/// Shows learner details for each enrollment in a course.
/// </summary>
public class CourseEnrollmentDto
{
    public int Id { get; set; }
    public int LearnerId { get; set; }
    public string LearnerName { get; set; } = string.Empty;
    public string LearnerEmail { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime EnrolledOn { get; set; }
}

/// <summary>
/// Enrollment from the learner perspective (used for GET /api/learners/{id}/enrollments).
/// Shows course details for each enrollment a learner has.
/// </summary>
public class LearnerEnrollmentDto
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime EnrolledOn { get; set; }
}
