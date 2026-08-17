# ─── Build Stage ───
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ["backend/TrainingManagement.Api/TrainingManagement.Api.csproj", "backend/TrainingManagement.Api/"]
RUN dotnet restore "backend/TrainingManagement.Api/TrainingManagement.Api.csproj"

# Copy full source and publish release build
COPY backend/TrainingManagement.Api/. backend/TrainingManagement.Api/
WORKDIR "/src/backend/TrainingManagement.Api"
RUN dotnet publish "TrainingManagement.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ─── Runtime Stage ───
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Default port if not provided by host
ENV PORT=8080
EXPOSE 8080 10000

ENTRYPOINT ["dotnet", "TrainingManagement.Api.dll"]
