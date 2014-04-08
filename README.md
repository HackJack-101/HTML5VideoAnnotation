HTML5VideoAnnotation
====================


### Installation
1. You have to install a web server like Apache on the machine
2. You have to access to the index.html with the web server, with a HTPP url like "http://localhost/project/index.html".

### Utilisation
1. Move your mp4 video file into the videos folder
2. Edit <video> HTML tag in index.html to set the video src
3. Edit window.frameRate into main.js to set the video frame rate.
4. Reload index.html (you can force reload with Ctrl-F5 or Shift-Ctrl-R)


### Hotkeys

| Keys          | Action                                                | 
|:-------------:|:------------------------------------------------------|
| P             | Play/Pause the video                                  |
| S             | Export or save the annotation file                    |
| Delete        | Remove the selected element with its annotation       |
| C             | Duplicate the previous annotated frame (i.e. layer)   |
| N             | (Debug) Edit category                                 |
| T             | (Debug) Display project log on Javascript console     |
