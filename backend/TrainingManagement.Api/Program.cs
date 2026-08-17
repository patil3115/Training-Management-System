using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using TrainingManagement.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// ─── Database Configuration ───
var provider = builder.Configuration.GetValue<string>("DatabaseProvider") ?? "Sqlite";

builder.Services.AddDbContext<TrainingManagementDbContext>(options =>
{
    if (provider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
    {
        var connStr = builder.Configuration.GetConnectionString("SqlServerConnection") 
                      ?? builder.Configuration.GetConnectionString("DefaultConnection");
        options.UseSqlServer(connStr);
    }
    else
    {
        var connStr = builder.Configuration.GetConnectionString("SqliteConnection") 
                      ?? builder.Configuration.GetConnectionString("DefaultConnection")
                      ?? "Data Source=TrainingManagement.db";
        options.UseSqlite(connStr);
    }
});

// ─── JSON Serialization: enums as strings ───
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// ─── Swagger/OpenAPI ───
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ─── CORS ───
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// ─── Middleware Pipeline ───

// Global exception handler
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new
        {
            message = "An unexpected error occurred. Please try again later."
        });
    });
});

// Swagger (development only)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Training Management API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowFrontend");

app.MapControllers();

// ─── Database Initialization & Seeding ───
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TrainingManagementDbContext>();
    
    try
    {
        context.Database.EnsureCreated();
        DbInitializer.Seed(context);
        Console.WriteLine($"[Database] Successfully initialized and seeded using {provider} provider.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Database Error] Failed to initialize database: {ex.Message}");
    }
}

app.Run();
