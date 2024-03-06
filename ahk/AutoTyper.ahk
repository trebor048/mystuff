#Persistent  ; Keep the script running

; Create the GUI
Gui, Add, Text, , Hotkey:
Gui, Add, Edit, vHotkey
Gui, Add, Text, , Sleep Time (ms):
Gui, Add, Edit, vSleepTime
Gui, Add, Text, , Text to send:
Gui, Add, Edit, vTextToSend w500 h200, ; Type your text here, separate blocks with a comma.
Gui, Add, Button, Default, OK
Gui, Add, Button, Cancel
Gui, Show, , Send Text Script
return

; Button OK
ButtonOK:
Gui, Submit  ; Save the input from the user
hotkey, %Hotkey%, SendText  ; Create a hotkey to send text
Gui, Destroy
return

; Button Cancel
ButtonCancel:
ExitApp

; Hotkey action
SendText:
StringSplit, textArray, TextToSend, `,  ; Split the text into an array by comma
Loop, %textArray0%  ; Loop through the array
{
    textToSend := textArray%A_Index%
    SendInput, %textToSend%{Enter}  ; Send the text block
    if (A_Index < textArray0)
    {
        Sleep, %SleepTime%  ; Sleep after sending unless it's the last block
    }
}
return

; GUI Close Event
GuiClose:
ExitApp
