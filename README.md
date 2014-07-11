photobooth
==========

HTML5 photobooth application using webcam and printer

Live demo: http://balbuf.com/photobooth/

## Notes

- This was meant to be deployed using Chrome in Kiosk mode, which allows unprompted printing. As well, it is meant to be hooked up to dedicated buttons for user interaction, so it does not currently accept mouse input. To interact, use Left and Right arrow keys to make selections, Space bar to confirm selection, and Esc to return to the home menu at any time.
- The application was hastily developed for an event and is a work in progress to make the code more elegant.
- By default, the camera is expected to be in portrait orientation, so it will look rotated on a standard laptop. The webcam is rotated 90 degrees in practice. 
- The application uses server-side processing to compile the final image for printing, so this necessitates an active internet connection.

## Future Improvements

- Changing of numeric defaults: # of snapshots, duration of snapshot countdown.
- Client-side image processing/rendering to eliminate the need for an active internet connection and provide faster image compiling.
- Custom filters using pixel-manipulation functions.
- More dynamic/attractive interface.
- Mouse interaction, especially to cater to touchscreen interfaces.
