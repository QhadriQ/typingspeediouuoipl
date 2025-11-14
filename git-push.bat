@echo off
echo === Pushing TypeSpeed to GitHub ===
echo.

git init
git add .
git commit -m "Initial commit: TypeSpeed - Modern Typing Speed Test"
git branch -M main
git remote add origin https://github.com/QhadriQ/typing-speed-test.git
git push -u origin main

echo.
echo Code pushed to https://github.com/QhadriQ/typing-speed-test.git
echo.
pause