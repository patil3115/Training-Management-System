using TrainingManagement.Api.Enums;
using TrainingManagement.Api.Models;

namespace TrainingManagement.Api.Data;

public static class DbInitializer
{
    public static void Seed(TrainingManagementDbContext context)
    {
        // Don't seed if data already exists
        if (context.Courses.Any())
            return;

        // ─── Courses ───
        var courses = new List<Course>
        {
            new Course
            {
                Title = "React Fundamentals",
                Description = "Learn the basics of React, including components, state, and hooks.",
                Category = CategoryEnum.Frontend,
                Level = LevelEnum.Beginner,
                DurationHours = 12,
                StartDate = new DateTime(2024, 5, 10),
                EndDate = new DateTime(2024, 6, 10)
            },
            new Course
            {
                Title = "Data Science Basics",
                Description = "Introduction to data science concepts, Python libraries, and data visualization techniques.",
                Category = CategoryEnum.DataScience,
                Level = LevelEnum.Intermediate,
                DurationHours = 20,
                StartDate = new DateTime(2024, 6, 1),
                EndDate = new DateTime(2024, 7, 15)
            },
            new Course
            {
                Title = "Project Management",
                Description = "Master project management methodologies including Agile, Scrum, and Waterfall approaches.",
                Category = CategoryEnum.Business,
                Level = LevelEnum.Intermediate,
                DurationHours = 15,
                StartDate = new DateTime(2024, 5, 15),
                EndDate = new DateTime(2024, 6, 30)
            },
            new Course
            {
                Title = "UI/UX Design",
                Description = "Advanced design principles covering user research, wireframing, prototyping, and usability testing.",
                Category = CategoryEnum.Design,
                Level = LevelEnum.Advanced,
                DurationHours = 10,
                StartDate = new DateTime(2024, 5, 20),
                EndDate = new DateTime(2024, 6, 20)
            },
            new Course
            {
                Title = "Cloud Architecture with AWS",
                Description = "Design scalable, reliable cloud solutions using AWS services and best practices.",
                Category = CategoryEnum.Cloud,
                Level = LevelEnum.Advanced,
                DurationHours = 24,
                StartDate = new DateTime(2024, 7, 1),
                EndDate = new DateTime(2024, 8, 15)
            },
            new Course
            {
                Title = "ASP.NET Core Mastery",
                Description = "Build production-grade web APIs using ASP.NET Core, Entity Framework Core, and C#.",
                Category = CategoryEnum.Backend,
                Level = LevelEnum.Intermediate,
                DurationHours = 16,
                StartDate = new DateTime(2024, 6, 15),
                EndDate = new DateTime(2024, 7, 31)
            },
            new Course
            {
                Title = "Angular for Enterprise Apps",
                Description = "Build large-scale enterprise applications using Angular with TypeScript and RxJS.",
                Category = CategoryEnum.Frontend,
                Level = LevelEnum.Advanced,
                DurationHours = 18,
                StartDate = new DateTime(2024, 8, 1),
                EndDate = new DateTime(2024, 9, 15)
            },
            new Course
            {
                Title = "Python for Data Analysis",
                Description = "Master data analysis workflows using Python, Pandas, NumPy, and Matplotlib.",
                Category = CategoryEnum.DataScience,
                Level = LevelEnum.Beginner,
                DurationHours = 14,
                StartDate = new DateTime(2024, 7, 10),
                EndDate = new DateTime(2024, 8, 25)
            }
        };

        context.Courses.AddRange(courses);
        context.SaveChanges();

        // ─── Learners (35+ realistic learners) ───
        var learners = new List<Learner>
        {
            new Learner { FullName = "Alice Johnson", Email = "alice.johnson@company.com" },
            new Learner { FullName = "Bob Smith", Email = "bob.smith@company.com" },
            new Learner { FullName = "Carol Williams", Email = "carol.williams@company.com" },
            new Learner { FullName = "David Brown", Email = "david.brown@company.com" },
            new Learner { FullName = "Eva Martinez", Email = "eva.martinez@company.com" },
            new Learner { FullName = "Frank Garcia", Email = "frank.garcia@company.com" },
            new Learner { FullName = "Grace Lee", Email = "grace.lee@company.com" },
            new Learner { FullName = "Henry Wilson", Email = "henry.wilson@company.com" },
            new Learner { FullName = "Iris Anderson", Email = "iris.anderson@company.com" },
            new Learner { FullName = "Jack Thomas", Email = "jack.thomas@company.com" },
            new Learner { FullName = "Karen Jackson", Email = "karen.jackson@company.com" },
            new Learner { FullName = "Liam White", Email = "liam.white@company.com" },
            new Learner { FullName = "Monica Harris", Email = "monica.harris@company.com" },
            new Learner { FullName = "Nathan Clark", Email = "nathan.clark@company.com" },
            new Learner { FullName = "Olivia Lewis", Email = "olivia.lewis@company.com" },
            new Learner { FullName = "Peter Robinson", Email = "peter.robinson@company.com" },
            new Learner { FullName = "Quinn Walker", Email = "quinn.walker@company.com" },
            new Learner { FullName = "Rachel Young", Email = "rachel.young@company.com" },
            new Learner { FullName = "Sam King", Email = "sam.king@company.com" },
            new Learner { FullName = "Tina Wright", Email = "tina.wright@company.com" },
            new Learner { FullName = "Uma Scott", Email = "uma.scott@company.com" },
            new Learner { FullName = "Victor Adams", Email = "victor.adams@company.com" },
            new Learner { FullName = "Wendy Baker", Email = "wendy.baker@company.com" },
            new Learner { FullName = "Xavier Nelson", Email = "xavier.nelson@company.com" },
            new Learner { FullName = "Yolanda Hill", Email = "yolanda.hill@company.com" },
            new Learner { FullName = "Zachary Moore", Email = "zachary.moore@company.com" },
            new Learner { FullName = "Amber Taylor", Email = "amber.taylor@company.com" },
            new Learner { FullName = "Brian Mitchell", Email = "brian.mitchell@company.com" },
            new Learner { FullName = "Cynthia Perez", Email = "cynthia.perez@company.com" },
            new Learner { FullName = "Derek Roberts", Email = "derek.roberts@company.com" },
            new Learner { FullName = "Emily Turner", Email = "emily.turner@company.com" },
            new Learner { FullName = "Felix Phillips", Email = "felix.phillips@company.com" },
            new Learner { FullName = "Gina Campbell", Email = "gina.campbell@company.com" },
            new Learner { FullName = "Howard Parker", Email = "howard.parker@company.com" },
            new Learner { FullName = "Ingrid Evans", Email = "ingrid.evans@company.com" },
            new Learner { FullName = "James Edwards", Email = "james.edwards@company.com" },
            new Learner { FullName = "Kelly Collins", Email = "kelly.collins@company.com" },
            new Learner { FullName = "Lucas Stewart", Email = "lucas.stewart@company.com" },
            new Learner { FullName = "Maya Sanchez", Email = "maya.sanchez@company.com" },
            new Learner { FullName = "Noah Morris", Email = "noah.morris@company.com" },
        };

        context.Learners.AddRange(learners);
        context.SaveChanges();

        // ─── Enrollments ───
        // Enroll all 35 first learners in "React Fundamentals" (courseId = courses[0].Id)
        var reactCourse = courses[0];
        var enrollments = new List<Enrollment>();

        for (int i = 0; i < 35; i++)
        {
            enrollments.Add(new Enrollment
            {
                CourseId = reactCourse.Id,
                LearnerId = learners[i].Id,
                EnrolledOn = new DateTime(2024, 5, 10).AddDays(i % 10),
                Status = StatusEnum.Confirmed
            });
        }

        // Additional enrollments for other courses to make data realistic
        // Data Science Basics - 12 learners
        for (int i = 0; i < 12; i++)
        {
            enrollments.Add(new Enrollment
            {
                CourseId = courses[1].Id,
                LearnerId = learners[i + 5].Id,
                EnrolledOn = new DateTime(2024, 6, 1).AddDays(i % 7),
                Status = i < 10 ? StatusEnum.Confirmed : StatusEnum.Completed
            });
        }

        // Project Management - 8 learners
        for (int i = 0; i < 8; i++)
        {
            enrollments.Add(new Enrollment
            {
                CourseId = courses[2].Id,
                LearnerId = learners[i + 20].Id,
                EnrolledOn = new DateTime(2024, 5, 15).AddDays(i % 5),
                Status = StatusEnum.Confirmed
            });
        }

        // UI/UX Design - 5 learners
        for (int i = 0; i < 5; i++)
        {
            enrollments.Add(new Enrollment
            {
                CourseId = courses[3].Id,
                LearnerId = learners[i + 10].Id,
                EnrolledOn = new DateTime(2024, 5, 20).AddDays(i),
                Status = StatusEnum.Confirmed
            });
        }

        // Cloud Architecture - 15 learners
        for (int i = 0; i < 15; i++)
        {
            enrollments.Add(new Enrollment
            {
                CourseId = courses[4].Id,
                LearnerId = learners[i + 2].Id,
                EnrolledOn = new DateTime(2024, 7, 1).AddDays(i % 8),
                Status = i < 12 ? StatusEnum.Confirmed : StatusEnum.Cancelled
            });
        }

        // ASP.NET Core Mastery - 10 learners
        for (int i = 0; i < 10; i++)
        {
            enrollments.Add(new Enrollment
            {
                CourseId = courses[5].Id,
                LearnerId = learners[i + 25].Id,
                EnrolledOn = new DateTime(2024, 6, 15).AddDays(i % 6),
                Status = StatusEnum.Confirmed
            });
        }

        // Angular for Enterprise Apps - 3 learners
        for (int i = 0; i < 3; i++)
        {
            enrollments.Add(new Enrollment
            {
                CourseId = courses[6].Id,
                LearnerId = learners[i].Id,
                EnrolledOn = new DateTime(2024, 8, 1).AddDays(i),
                Status = StatusEnum.Confirmed
            });
        }

        // Python for Data Analysis - 7 learners
        for (int i = 0; i < 7; i++)
        {
            enrollments.Add(new Enrollment
            {
                CourseId = courses[7].Id,
                LearnerId = learners[i + 30].Id,
                EnrolledOn = new DateTime(2024, 7, 10).AddDays(i % 4),
                Status = StatusEnum.Confirmed
            });
        }

        context.Enrollments.AddRange(enrollments);
        context.SaveChanges();
    }
}
