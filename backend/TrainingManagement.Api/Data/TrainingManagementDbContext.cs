using Microsoft.EntityFrameworkCore;
using TrainingManagement.Api.Models;
using TrainingManagement.Api.Enums;

namespace TrainingManagement.Api.Data;

public class TrainingManagementDbContext : DbContext
{
    public TrainingManagementDbContext(DbContextOptions<TrainingManagementDbContext> options)
        : base(options)
    {
    }

    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Learner> Learners => Set<Learner>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ─── Course Configuration ───
        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.Property(c => c.Title)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(c => c.Description)
                .HasMaxLength(250);

            entity.Property(c => c.Category)
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.Property(c => c.Level)
                .HasConversion<string>()
                .HasMaxLength(50);
        });

        // ─── Learner Configuration ───
        modelBuilder.Entity<Learner>(entity =>
        {
            entity.HasKey(l => l.Id);

            entity.Property(l => l.FullName)
                .IsRequired();

            entity.Property(l => l.Email)
                .IsRequired();

            entity.HasIndex(l => l.Email)
                .IsUnique();
        });

        // ─── Enrollment Configuration ───
        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(50);

            // Composite unique index to prevent duplicate active enrollments
            entity.HasIndex(e => new { e.CourseId, e.LearnerId })
                .IsUnique();

            entity.HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(e => e.CourseId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Learner)
                .WithMany(l => l.Enrollments)
                .HasForeignKey(e => e.LearnerId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
