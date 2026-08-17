using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainingManagement.Api.Data;
using TrainingManagement.Api.DTOs;
using TrainingManagement.Api.Models;

namespace TrainingManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LearnersController : ControllerBase
{
    private readonly TrainingManagementDbContext _context;

    public LearnersController(TrainingManagementDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// POST /api/learners
    /// Creates a new learner or returns existing learner if email already exists.
    /// Email is normalized to lowercase for lookup.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<LearnerResponseDto>> CreateOrGetLearner([FromBody] LearnerCreateDto dto)
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

        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

        // Check if learner already exists
        var existingLearner = await _context.Learners
            .FirstOrDefaultAsync(l => l.Email.ToLower() == normalizedEmail);

        if (existingLearner != null)
        {
            return Ok(new LearnerResponseDto
            {
                Id = existingLearner.Id,
                FullName = existingLearner.FullName,
                Email = existingLearner.Email
            });
        }

        // Create new learner
        var learner = new Learner
        {
            FullName = dto.FullName.Trim(),
            Email = normalizedEmail
        };

        _context.Learners.Add(learner);
        await _context.SaveChangesAsync();

        var response = new LearnerResponseDto
        {
            Id = learner.Id,
            FullName = learner.FullName,
            Email = learner.Email
        };

        return CreatedAtAction(nameof(GetLearner), new { id = learner.Id }, response);
    }

    /// <summary>
    /// GET /api/learners/{id}
    /// Returns learner details, optionally including enrollments.
    /// Usage: GET /api/learners/1?include=enrollments
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<LearnerResponseDto>> GetLearner(int id, [FromQuery] string? include = null)
    {
        var learner = await _context.Learners
            .FirstOrDefaultAsync(l => l.Id == id);

        if (learner == null)
        {
            return NotFound(new ErrorResponseDto { Message = "Learner not found." });
        }

        var response = new LearnerResponseDto
        {
            Id = learner.Id,
            FullName = learner.FullName,
            Email = learner.Email
        };

        // Optionally include enrollments
        if (!string.IsNullOrWhiteSpace(include) &&
            include.Equals("enrollments", StringComparison.OrdinalIgnoreCase))
        {
            var enrollments = await _context.Enrollments
                .Include(e => e.Course)
                .Where(e => e.LearnerId == id)
                .Select(e => new LearnerEnrollmentDto
                {
                    Id = e.Id,
                    CourseId = e.CourseId,
                    CourseTitle = e.Course.Title,
                    Status = e.Status.ToString(),
                    EnrolledOn = e.EnrolledOn
                })
                .ToListAsync();

            response.Enrollments = enrollments;
        }

        return Ok(response);
    }
}
