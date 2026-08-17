# Training Management Portal

A full-stack internal technology training management portal for managing courses, learner enrollments, and training administration.

## Technology Stack

### Backend
- **ASP.NET Core 10.0 Web API** (C#)
- **Entity Framework Core 10.0** (Code First)
- **SQL Server** (database)
- **Swagger/OpenAPI** (API documentation)

### Frontend
- **React 19** with **TypeScript**
- **Vite** (build tool)
- **React Router v7** (client-side routing)
- **Fetch API** (HTTP client)
- **Vanilla CSS** (custom design system)

---

## Architecture

```
TrainingManagementPortal/
├── backend/
│   └── TrainingManagement.Api/
│       ├── Controllers/          # API controllers (Courses, Learners, Enrollments)
│       ├── Data/                 # DbContext + Seed data initializer
│       ├── DTOs/                 # Request/Response data transfer objects
│       ├── Enums/                # CategoryEnum, LevelEnum, StatusEnum
│       ├── Models/               # EF Core entity models
│       ├── Migrations/           # EF Core code-first migrations
│       ├── Program.cs            # Application entry point & configuration
│       └── appsettings.json      # Configuration (connection strings, etc.)
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Route-level page components
│   │   ├── services/             # API service layer
│   │   ├── types/                # TypeScript interfaces
│   │   ├── utils/                # Utility functions
│   │   ├── App.tsx               # Root component with routing
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Global styles & design system
│   ├── .env                      # Environment variables
│   └── package.json
└── README.md
```

---

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download) (or .NET 8/9 with minor csproj adjustments)
- [Node.js 18+](https://nodejs.org/) and npm
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (Express, Developer, or LocalDB)
- EF Core CLI tool

### Install EF Core CLI (if not already installed)

```bash
dotnet tool install --global dotnet-ef
```

---

## SQL Server Setup

### Option 1: SQL Server (Express/Developer)
Ensure SQL Server is running on `localhost` with **Windows Authentication** (Trusted Connection).

### Option 2: SQL Server with Username/Password
Update the connection string in `backend/TrainingManagement.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TrainingManagementDb;User Id=sa;Password=YourPassword;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

### Option 3: SQL Server LocalDB
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=TrainingManagementDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

---

## Backend Setup

### 1. Navigate to the backend project

```bash
cd backend/TrainingManagement.Api
```

### 2. Restore NuGet packages

```bash
dotnet restore
```

### 3. Update the database (apply migrations)

```bash
dotnet ef database update
```

> **Note:** The application also automatically applies pending migrations and seeds demo data on startup.

### 4. Run the API

```bash
dotnet run
```

The API will start at: **http://localhost:5000**

### 5. Access Swagger

Open your browser to: **http://localhost:5000/swagger**

---

## Frontend Setup

### 1. Navigate to the frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API URL (optional)

The `.env` file contains:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Update this if your backend runs on a different port.

### 4. Run the development server

```bash
npm run dev
```

The frontend will start at: **http://localhost:5173**

---

## API Endpoints

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/courses` | List all courses (supports `?category=`, `?level=`, `?search=` query params) |
| `GET` | `/api/courses/{id}` | Get course details by ID |
| `POST` | `/api/courses` | Create a new course |
| `PUT` | `/api/courses/{id}` | Update an existing course |
| `DELETE` | `/api/courses/{id}` | Delete a course (prevents deletion if learners are enrolled) |

### Learners

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/learners` | Create or get existing learner by email |
| `GET` | `/api/learners/{id}` | Get learner details (supports `?include=enrollments`) |

### Enrollments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/enrollments` | Create a new enrollment |
| `GET` | `/api/courses/{courseId}/enrollments` | List enrollments for a course (Admin/Instructor view) |
| `GET` | `/api/learners/{learnerId}/enrollments` | List enrollments for a learner (My Enrollments view) |

---

## Example API Requests

### Get all courses
```bash
curl http://localhost:5000/api/courses
```

### Filter courses by category and level
```bash
curl "http://localhost:5000/api/courses?category=Frontend&level=Beginner"
```

### Search courses
```bash
curl "http://localhost:5000/api/courses?search=react"
```

### Get course details
```bash
curl http://localhost:5000/api/courses/1
```

### Create/Get learner
```bash
curl -X POST http://localhost:5000/api/learners \
  -H "Content-Type: application/json" \
  -d '{"fullName": "John Doe", "email": "john@example.com"}'
```

### Enroll in a course
```bash
curl -X POST http://localhost:5000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{"courseId": 1, "learnerId": 1}'
```

### Get course enrollments (Admin view)
```bash
curl http://localhost:5000/api/courses/1/enrollments
```

### Get learner enrollments (My Enrollments)
```bash
curl http://localhost:5000/api/learners/1/enrollments
```

---

## Frontend Routes

| Route | Page | Description |
|-------|------|-------------|
| `/courses` | Course List | Browse and filter all courses (Learner) |
| `/courses/:id` | Course Details | View course details, enroll, view enrollments (Learner) |
| `/learners/:id/enrollments` | My Enrollments | View learner's enrollment history (Learner) |
| `/my-enrollments` | Redirects | Redirects to `/learners/1/enrollments` |
| `/profile` | Profile | Learner profile with enrollment lookup |
| `/admin` | Admin Dashboard | Manage all courses (Create, Edit, Delete, View Enrollments) |
| `/admin/courses/new` | Create Course | Form to publish a new course |
| `/admin/courses/:id/edit` | Edit Course | Form to modify an existing course |
| `/admin/courses/:id/enrollments` | Course Enrollments | Dedicated admin page showing enrolled learners per course |

---

## Enrollment Workflow

1. User browses courses at `/courses`
2. Clicks "View Details" to navigate to `/courses/:id`
3. Fills in the enrollment form (Name + Email)
4. Frontend calls `POST /api/learners` to create/get the learner
5. Frontend calls `POST /api/enrollments` with the returned learner ID
6. Success message displayed, enrollment count refreshes dynamically
7. Duplicate enrollments return a 409 Conflict error

---

## Seed Data

The application automatically seeds the following demo data on first run:

**Courses (8):**
- React Fundamentals (Frontend, Beginner, 12h)
- Data Science Basics (DataScience, Intermediate, 20h)
- Project Management (Business, Intermediate, 15h)
- UI/UX Design (Design, Advanced, 10h)
- Cloud Architecture with AWS (Cloud, Advanced, 24h)
- ASP.NET Core Mastery (Backend, Intermediate, 16h)
- Angular for Enterprise Apps (Frontend, Advanced, 18h)
- Python for Data Analysis (DataScience, Beginner, 14h)

**Learners:** 40 realistic learners with corporate email addresses

**Enrollments:** 95+ enrollments distributed across courses (React Fundamentals has 35 learners)

---

## Troubleshooting

### Backend won't start
- Verify SQL Server is running and accessible
- Check the connection string in `appsettings.json`
- Run `dotnet ef database update` to ensure migrations are applied

### Frontend can't reach API
- Ensure the backend is running on port 5000
- Check `.env` file has correct `VITE_API_BASE_URL`
- Verify CORS is configured (defaults to allowing `localhost:5173`)

### Database migration errors
- Delete the database and re-run: `dotnet ef database update`
- Or drop and recreate: `dotnet ef database drop --force && dotnet ef database update`

### Port conflicts
- Backend: Change the port in `Properties/launchSettings.json`
- Frontend: Vite will auto-increment the port if 5173 is taken

---

## EF Core Migration Commands

```bash
# Add a new migration
dotnet ef migrations add MigrationName

# Apply migrations to database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove

# Drop database
dotnet ef database drop --force

# Generate SQL script
dotnet ef migrations script
```
