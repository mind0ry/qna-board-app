@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR:~0,-1%"
set "IMAGE_NAME=qna-board-app"
set "IMAGE_TAG=dev"
set "EXPORT_DIR=%SCRIPT_DIR%dist"
set "EXPORT_FILE=%EXPORT_DIR%\%IMAGE_NAME%-%IMAGE_TAG%.tar"

where docker >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker command was not found. Install or start Docker Desktop.
    exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker daemon is not running. Start Docker Desktop and try again.
    exit /b 1
)

echo [1/2] Building %IMAGE_NAME%:%IMAGE_TAG%...
docker build --file "%PROJECT_DIR%\Dockerfile" --tag "%IMAGE_NAME%:%IMAGE_TAG%" "%PROJECT_DIR%"
if errorlevel 1 (
    echo [ERROR] Docker image build failed.
    exit /b 1
)

if not exist "%EXPORT_DIR%" mkdir "%EXPORT_DIR%"
if errorlevel 1 (
    echo [ERROR] Failed to create export directory: %EXPORT_DIR%
    exit /b 1
)

echo [2/2] Exporting image to %EXPORT_FILE%...
docker save --output "%EXPORT_FILE%" "%IMAGE_NAME%:%IMAGE_TAG%"
if errorlevel 1 (
    echo [ERROR] Docker image export failed.
    exit /b 1
)

echo [SUCCESS] Export completed: %EXPORT_FILE%
exit /b 0
