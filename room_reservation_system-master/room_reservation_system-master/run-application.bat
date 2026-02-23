@echo off
echo ========================================
echo Ocean View Resort - Starting Application
echo ========================================
echo.

echo Cleaning and building project...
call mvn clean install -DskipTests

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo.
    echo Please ensure:
    echo 1. Lombok plugin is installed in your IDE
    echo 2. Annotation processing is enabled
    echo 3. Java 17 is installed
    echo.
    echo See DATABASE_SETUP.md for detailed instructions
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build successful! Starting application...
echo ========================================
echo.
echo Application will start on: http://localhost:8080
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo H2 Console: http://localhost:8080/h2-console
echo.

call mvn spring-boot:run

pause
