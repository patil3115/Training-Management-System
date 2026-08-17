using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainingManagement.Api.Data;
using TrainingManagement.Api.DTOs;
using TrainingManagement.Api.Enums;
using TrainingManagement.Api.Models;

namespace TrainingManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly TrainingManagementDbContext _context;

    public CoursesController(TrainingManagementDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/courses
    /// Returns all courses with optional filtering by category, level, and search term.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<CourseResponseDto>>> GetCourses(
        [FromQuery] string? category = null,
        [FromQuery] string? level = null,
        [FromQuery] string? search = null)
    {
        var query = _context.Courses.AsQueryable();

        // Filter by category
        if (!string.IsNullOrWhiteSpace(category) &&
            Enum.TryParse<CategoryEnum>(category, ignoreCase: true, out var categoryEnum))
        {
            query = query.Where(c => c.Category == categoryEnum);
        }

        // Filter by level
        if (!string.IsNullOrWhiteSpace(level) &&
            Enum.TryParse<LevelEnum>(level, ignoreCase: true, out var levelEnum))
        {
            query = query.Where(c => c.Level == levelEnum);
        }

        // Search by title or description
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(c =>
                c.Title.ToLower().Contains(searchLower) ||
                (c.Description != null && c.Description.ToLower().Contains(searchLower)));
        }

        var courses = await query
            .Select(c => new CourseResponseDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                Category = c.Category.ToString(),
                Level = c.Level.ToString(),
                DurationHours = c.DurationHours,
                StartDate = c.StartDate,
                EndDate = c.EndDate,
                CurrentEnrollmentCount = c.Enrollments.Count
            })
            .OrderBy(c => c.Title)
            .ToListAsync();

        return Ok(courses);
    }

    /// <summary>
    /// GET /api/courses/{id}
    /// Returns course details with dynamic enrollment count.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<CourseResponseDto>> GetCourse(int id)
    {
        var course = await _context.Courses
            .Select(c => new CourseResponseDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                Category = c.Category.ToString(),
                Level = c.Level.ToString(),
                DurationHours = c.DurationHours,
                StartDate = c.StartDate,
                EndDate = c.EndDate,
                CurrentEnrollmentCount = c.Enrollments.Count
            })
            .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null)
        {
            return NotFound(new ErrorResponseDto { Message = "Course not found." });
        }

        return Ok(course);
    }

    /// <summary>
    /// POST /api/courses
    /// Creates a new course with validation.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<CourseResponseDto>> CreateCourse([FromBody] CourseCreateDto dto)
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

        // Additional validation: EndDate >= StartDate
        if (dto.EndDate < dto.StartDate)
        {
            return BadRequest(new ErrorResponseDto
            {
                Message = "Validation failed.",
                Errors = new Dictionary<string, string[]>
                {
                    { "EndDate", new[] { "End date cannot be earlier than start date." } }
                }
            });
        }

        var course = new Course
        {
            Title = dto.Title,
            Description = dto.Description,
            Category = dto.Category,
            DurationHours = dto.DurationHours,
            Level = dto.Level,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        var response = new CourseResponseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            Category = course.Category.ToString(),
            Level = course.Level.ToString(),
            DurationHours = course.DurationHours,
            StartDate = course.StartDate,
            EndDate = course.EndDate,
            CurrentEnrollmentCount = 0
        };

        return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, response);
    }

    /// <summary>
    /// PUT /api/courses/{id}
    /// Updates an existing course.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<CourseResponseDto>> UpdateCourse(int id, [FromBody] CourseUpdateDto dto)
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

        // Validate: EndDate >= StartDate
        if (dto.EndDate < dto.StartDate)
        {
            return BadRequest(new ErrorResponseDto
            {
                Message = "Validation failed.",
                Errors = new Dictionary<string, string[]>
                {
                    { "EndDate", new[] { "End date cannot be earlier than start date." } }
                }
            });
        }

        var course = await _context.Courses
            .Include(c => c.Enrollments)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null)
        {
            return NotFound(new ErrorResponseDto { Message = "Course not found." });
        }

        course.Title = dto.Title;
        course.Description = dto.Description;
        course.Category = dto.Category;
        course.DurationHours = dto.DurationHours;
        course.Level = dto.Level;
        course.StartDate = dto.StartDate;
        course.EndDate = dto.EndDate;

        await _context.SaveChangesAsync();

        var response = new CourseResponseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            Category = course.Category.ToString(),
            Level = course.Level.ToString(),
            DurationHours = course.DurationHours,
            StartDate = course.StartDate,
            EndDate = course.EndDate,
            CurrentEnrollmentCount = course.Enrollments.Count
        };

        return Ok(response);
    }

    /// <summary>
    /// DELETE /api/courses/{id}
    /// Deletes a course. Prevents deletion if learners are enrolled in the course.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCourse(int id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
        {
            return NotFound(new ErrorResponseDto { Message = "Course not found." });
        }

        // Check if any enrollments exist for this course
        var hasEnrollments = await _context.Enrollments.AnyAsync(e => e.CourseId == id);
        if (hasEnrollments)
        {
            return Conflict(new ErrorResponseDto
            {
                Message = "This course cannot be deleted because learners are enrolled in it."
            });
        }

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Course deleted successfully." });
    }
}
