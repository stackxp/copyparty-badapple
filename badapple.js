"use strict";

// Written by stackxp
// GitHub: https://github.com/stackxp/copyparty-badapple/

(async () => {
	let qs = (q, o=document) => o.querySelector(q)
	let qsa = (q, o=document) => o.querySelectorAll(q)
	let rempx = (s) => parseInt(s.replace(/px$/, ""))

	const pixelWidth = "300px",
		pixelHeight = "240px",
		modal_title = "<h2>Copyparty Grid Video Player</h2>"
	
	async function run(video_path, zoom, filename) {
		const video = document.createElement("video")
		try {
			await new Promise((res, rej) => {
				video.onloadedmetadata = (v) => res(v)
				video.onerror = () => rej()	
				video.src = video_path
				video.load()
			})
		} catch {
			modal.alert("<h2>Copyparty grid video player</h2>The video file couldn't be found!")
			return
		}

		// Preparing
		let canvas = new OffscreenCanvas(1, 1)
		let ctx = canvas.getContext("2d")

		let grid = qs("#ggrid")
		grid.innerHTML = ""
		grid.style.zoom = zoom

		// Calculate grid size
		let grid_style = getComputedStyle(grid)
		let grid_file_height = rempx(grid_style.fontSize) * thegrid.sz + rempx(grid_style.rowGap)
		let grid_head_height = rempx(getComputedStyle(qs("#ghead")).height)

		canvas.width = (grid_style.gridTemplateColumns.match(/ /g) || []).length + 1
		canvas.height = Math.floor((window.innerHeight - grid_head_height) / grid_file_height / zoom) - 1
		let num_pixels = canvas.width * canvas.height
		
		// Populate grid (that giant data uri is an empty 1x1 image)
		for (let i = 0; i < num_pixels; i++)
			grid.innerHTML += `<a href="${video_path}"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" style="width: ${pixelWidth}; height: ${pixelHeight};"><span>${filename}</span></a>`

		let intIdx = setInterval(() => {
			// Very efficient
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
			let data = ctx.getImageData(0, 0, canvas.width, canvas.height).data

			for (let i = 0; i < num_pixels; i++) {
				let color = Array.from(data.slice(i * 4, i * 4 + 3))
				let hex = "#" + color.map((x) => x.toString(16).padStart(2, "0")).join("")

				grid.childNodes[i].firstChild.style.background = hex
			}
		}, 16)
		
		video.onended = () => {
			clearInterval(intIdx)
			location.reload()
		}

		video.volume = 0.8
		video.play()
	}

	const waitModalPrompt = (html, def) => new Promise((res, rej) => {
		modal.prompt(html, def, res, rej)
	})

	// Enable the grid, if not already
	if (!thegrid.en)
		qs("#griden").click()

	try {
		modal.hide()

		// Configuration
		let video_path = await waitModalPrompt(modal_title + "Select the video file to be played:", "./badapple.mp4")
		let rawzoom = await waitModalPrompt(modal_title + "Select a grid zoom:", "50%")
		let zoom = parseFloat(rawzoom.replace(/%$/, "")) / 100
		if (isNaN(zoom) || zoom <= 0)
			return modal.alert(modal_title + "Please enter a valid zoom value (float, greater than 0%)")
		let filename = await waitModalPrompt(modal_title + "Enter a file name for the grid items (purely visual):", "BADAPPLE!!")

		run(video_path, zoom, filename)
	} catch {}

})()