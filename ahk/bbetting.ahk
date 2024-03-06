#NoEnv
SendMode Input
SetWorkingDir %A_ScriptDir%

F20::
    Random, rand1, 2, 999
    Random, rand2, 1, 2
    If (rand2 = 1)
        rand2Char := "h"
    Else
        rand2Char := "t"
    
    SendInput .bf %rand1% %rand2Char%
    Send {Enter}
return
Esc::ExitApp




