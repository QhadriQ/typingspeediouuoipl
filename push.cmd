@echo off
"C:\Program Files\Git\cmd\git.exe" init
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "Initial commit: TypeSpeed - Modern Typing Speed Test"
"C:\Program Files\Git\cmd\git.exe" branch -M main
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/QhadriQ/typing-speed-test.git
"C:\Program Files\Git\cmd\git.exe" push -u origin main
pause