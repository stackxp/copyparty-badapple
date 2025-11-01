# Copyparty grid video player

Play any video in the copyparty grid view using just a single JavaScript file and a video.

## How to use

1. Copy `badapple.js` and the video (as "badapple.mp4") into a folder on your copyparty server
2. Click the π-symbol below the file view.
3. Type `import("[path to where you are]/badapple.js")` and press enter.
4. Switch to grid view by pressing `g`.
5. Click the π again and type `badapple()`.
6. Zoom out by pressing `CTRL` and scrolling down.
7. Press enter.
8. Done! :thumbsup:

> [!NOTE]
> You can also use some arguments in the `badapple()` function, for example:
> ```js
> badapple({
> 	video_path: "/videos/liar_dancer.mp4",
> 	grid_text: "Liar dancer"
> })
> ```