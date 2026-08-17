using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Api.DTOs;

// ─── Request DTOs ───

public class LearnerCreateDto
{
    [Required(ErrorMessage = "Full name is required.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "A valid email address is required.")]
    public string Email { get; set; } = string.Empty;
}

// ─── Response DTOs ───

public class LearnerResponseDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<LearnerEnrollmentDto>? Enrollments { get; set; }
}
