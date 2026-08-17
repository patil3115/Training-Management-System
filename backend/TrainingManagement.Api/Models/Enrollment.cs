using System.ComponentModel.DataAnnotations;
using TrainingManagement.Api.Enums;

namespace TrainingManagement.Api.Models;

public class Enrollment
{
    public int Id { get; set; }

    public int CourseId { get; set; }

    public int LearnerId { get; set; }

    public DateTime EnrolledOn { get; set; }

    public StatusEnum Status { get; set; }

    public Course Course { get; set; } = null!;

    public Learner Learner { get; set; } = null!;
}
