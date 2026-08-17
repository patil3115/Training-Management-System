using System.ComponentModel.DataAnnotations;

namespace TrainingManagement.Api.Models;

public class Learner
{
    public int Id { get; set; }

    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    public List<Enrollment> Enrollments { get; set; } = new();
}
