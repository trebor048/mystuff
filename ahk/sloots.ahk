CoordMode, Mouse, Screen

Loop
{
    F22::
        ; Click at Screen: -1413, 913 three times
        Loop 3 {
            Click, -1413, 913
            Sleep, 10 ; Adjust sleep time as needed between clicks at the same coordinates
        }

        ; Sleep for 250 milliseconds
        Sleep, 250

        ; Click at Screen: -1412, 569 three times
        Loop 3 {
            Click, -1412, 569
            Sleep, 10 ; Adjust sleep time as needed between clicks at the same coordinates
        }

        ; Add any additional actions or code you want to execute here

        return
}

; Exit the script if the loop is interrupted (e.g., by closing the script)
ExitApp
