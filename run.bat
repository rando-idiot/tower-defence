@echo off
REM Check if the binary exists
if exist "dist\tower_defense_win.exe" (
    REM Run the game
    dist\tower_defense_win.exe
) else (
    echo Error: Game binary not found. Please run build script first.
    pause
    exit /b 1
) 