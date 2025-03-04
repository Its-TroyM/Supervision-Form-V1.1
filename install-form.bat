@echo off
setlocal enabledelayedexpansion

echo ====================================================
echo     Wayne Center - Clinical Supervision Form Setup
echo ====================================================
echo.

:: Create desktop shortcut
echo Creating desktop shortcut...
set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = oWS.SpecialFolders("Desktop") ^& "\Wayne Center Supervision Form.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%~dp0Open-Form.bat" >> %SCRIPT%
echo oLink.WorkingDirectory = "%~dp0" >> %SCRIPT%
echo oLink.Description = "Wayne Center Clinical Supervision Form" >> %SCRIPT%
echo oLink.IconLocation = "%SystemRoot%\System32\SHELL32.dll,21" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%
cscript /nologo %SCRIPT%
del %SCRIPT%

:: Create Saved Forms directory if it doesn't exist
if not exist "%~dp0Saved Forms" (
    mkdir "%~dp0Saved Forms"
    echo Created "Saved Forms" folder for your completed forms.
)

echo.
echo Setup complete!
echo.
echo You can now access the form by:
echo  1. Double-clicking the shortcut on your desktop
echo  2. Double-clicking Open-Form.bat in this folder
echo.
echo For help using the form, please refer to the README.txt file.
echo.
pause
exit /b 0
