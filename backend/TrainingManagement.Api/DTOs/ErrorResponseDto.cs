namespace TrainingManagement.Api.DTOs;

/// <summary>
/// Standardized error response returned by all API error paths.
/// </summary>
public class ErrorResponseDto
{
    public string Message { get; set; } = string.Empty;
    public Dictionary<string, string[]>? Errors { get; set; }
}
