#NoEnv
SendMode Input
SetWorkingDir %A_ScriptDir%

F22::
    Random, rand3, 1, 4 ; Choose between four bet options (25% each)
    Random, randValue, 33000, 69000 ; Generate a random bet value between 1k and 50k

    If (rand3 = 1) {
        SendInput .bd %randValue% l r
    } else if (rand3 = 2) {
        SendInput .bd %randValue% h r
    } else if (rand3 = 3) {
        SendInput .bd %randValue% l
    } else {
        SendInput .bd %randValue% h
    }
    
    Send {Enter}
return

Esc::ExitApp
