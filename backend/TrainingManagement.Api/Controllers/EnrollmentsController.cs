using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainingManagement.Api.Data;
using TrainingManagement.Api.DTOs;
using TrainingManagement.Api.Enums;
using TrainingManagement.Api.Models;

namespace TrainingManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentsController : ControllerBase
{
    private readonly TrainingManagementDbContext _context;

    public EnrollmentsController(TrainingManagementDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// POST /api/enrollments
    /// Creates a new enrollment. Validates course and learner exist,
    /// prevents duplicate active enrollments, sets server-generated date and Confirmed status.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<EnrollmentResponseDto>> CreateEnrollment([FromBody] EnrollmentCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ErrorResponseDto
            {
                Message = "Validation failed.",
                Errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                    )
            });
        }

        // Verify course exists
        var course = await _context.Courses.FindAsync(dto.CourseId);
        if (course == null)
        {
            return NotFound(new ErrorResponseDto { Message = "Course not found." });
        }

        // Verify learner exists
        var learner = await _context.Learners.FindAsync(dto.LearnerId);
        if (learner == null)
        {
            return NotFound(new ErrorResponseDto { Message = "Learner not found." });
        }

        // Check for duplicate enrollment (any status - enforced by unique index too)
        var existingEnrollment = await _context.Enrollments
            .FirstOrDefaultAsync(e => e.CourseId == dto.CourseId && e.LearnerId == dto.LearnerId);

        if (existingEnrollment != null)
        {
            return Conflict(new ErrorResponseDto
            {
                Message = "This learner is already enrolled in this course."
            });
        }

        var enrollment = new Enrollment
        {
            CourseId = dto.CourseId,
            LearnerId = dto.LearnerId,
            EnrolledOn = DateTime.UtcNow,
            Status = StatusEnum.Confirmed
        };

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        var response = new EnrollmentResponseDto
        {
            Id = enrollment.Id,
            CourseId = enrollment.CourseId,
            LearnerId = enrollment.LearnerId,
            CourseTitle = course.Title,
            LearnerName = learner.FullName,
            Status = enrollment.Status.ToString(),
            EnrolledOn = enrollment.EnrolledOn
        };

        return StatusCode(StatusCodes.Status201Created, response);
    }

    /// <summary>
    /// GET /api/courses/{courseId}/enrollments
    /// Returns all enrollments for a specific course (Admin/Instructor view).
    /// </summary>
    [HttpGet("/api/courses/{courseId}/enrollments")]
    public async Task<ActionResult<List<CourseEnrollmentDto>>> GetCourseEnrollments(int courseId)
    {
        var courseExists = await _context.Courses.AnyAsync(c => c.Id == courseId);
        if (!courseExists)
        {
            return NotFound(new ErrorResponseDto { Message = "Course not found." });
        }

        var enrollments = await _context.Enrollments
            .Include(e => e.Learner)
            .Where(e => e.CourseId == courseId)
            .Select(e => new CourseEnrollmentDto
            {
                Id = e.Id,
                LearnerId = e.LearnerId,
                LearnerName = e.Learner.FullName,
                LearnerEmail = e.Learner.Email,
                CourseId = e.CourseId,
                Status = e.Status.ToString(),
                EnrolledOn = e.EnrolledOn
            })
            .OrderBy(e => e.EnrolledOn)
            .ToListAsync();

        return Ok(enrollments);
    }

    /// <summary>
    /// GET /api/learners/{learnerId}/enrollments
    /// Returns all enrollments for a specific learner (My Enrollments view).
    /// </summary>
    [HttpGet("/api/learners/{learnerId}/enrollments")]
    public async Task<ActionResult<List<LearnerEnrollmentDto>>> GetLearnerEnrollments(int learnerId)
    {
        var learnerExists = await _context.Learners.AnyAsync(l => l.Id == learnerId);
        if (!learnerExists)
        {
            return NotFound(new ErrorResponseDto { Message = "Learner not found." });
        }

        var enrollments = await _context.Enrollments
            .Include(e => e.Course)
            .Where(e => e.LearnerId == learnerId)
            .Select(e => new LearnerEnrollmentDto
            {
                Id = e.Id,
                CourseId = e.CourseId,
                CourseTitle = e.Course.Title,
                Status = e.Status.ToString(),
                EnrolledOn = e.EnrolledOn
            })
            .OrderByDescending(e => e.EnrolledOn)
            .ToListAsync();

        return Ok(enrollments);
    }
}
