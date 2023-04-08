#NoEnv
#SingleInstance, Force
#Warn
SendMode Input

switch := false

AppsKey::
    if (switch = false) {
        FileDelete, translator.txt
        FileAppend, 1, translator.txt

        switch := true
    }
    return

AppsKey Up::
    FileDelete, translator.txt
    FileAppend, 0, translator.txt

    switch := false
    return