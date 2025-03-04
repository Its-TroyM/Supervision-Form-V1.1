@echo off
echo ====================================================
echo     Wayne Center - Clinical Supervision Form
echo ====================================================
echo.

:: Check if running with elevated privileges (not recommended)
net session >nul 2>&1
if %errorLevel% == 0 (
    echo WARNING: This form doesn't need administrator privileges.
    echo Please run normally by double-clicking the file.
    echo.
    pause
    exit /b 1
)

:: Check if files exist
if not exist "%~dp0supervision-form.html" (
    echo ERROR: Required form files not found.
    echo Please make sure all files are in the same folder.
    echo.
    pause
    exit /b 1
)

echo Opening form in your default browser...
echo.
echo If you need help, please refer to the README.txt file.
echo.

:: Start the form in the default browser
start "" "%~dp0supervision-form.html"

:: Create Saved Forms directory if it doesn't exist
if not exist "%~dp0Saved Forms" (
    mkdir "%~dp0Saved Forms"
    echo Created "Saved Forms" folder for your completed forms.
)

exit /b 0
