"use strict"

const pixel_size = "5rem"

window.badapple = (options = {}) => {
	options = Object.assign({video_path: "./badapple.mp4", grid_text: "BAD APPLE!!"}, options)

	let qs = (q, o=document) => o.querySelector(q)
	let qsa = (q, o=document) => o.querySelectorAll(q)

	let base = null
	let canvas = new OffscreenCanvas(1, 1)
	let ctx = canvas.getContext("2d")

	let the_grid = qs("#ggrid")
	if (qs("#gfiles").style.display == "none")
		throw Error("Please make sure you have the grid view enabled!")

	// Create a copy of the first grid item
	let first_file = qs("a", the_grid)
	first_file.href = options.video_path
	first_file.firstChild.style.width = first_file.firstChild.style.height = pixel_size
	first_file.firstChild.style.border = "1px solid transparent" // Disable empty image border
	first_file.firstChild.src = ""
	first_file.lastChild.innerHTML = options.grid_text
	
	// Determine grid size (cursed)
	let grid_style = getComputedStyle(the_grid)
	let item_rect = first_file.getBoundingClientRect()
	canvas.width = (grid_style.gridTemplateColumns.match(/ /g) || []).length + 1
	canvas.height = Math.round((window.innerHeight - item_rect.top) / item_rect.height)
	let num_pixels = canvas.width * canvas.height
	
	base = first_file.cloneNode(true)
	qsa("a", the_grid).forEach((e) => e.remove())

	// Fill dat grid
	let grid = []
	for (let i = 0; i < num_pixels; i++) {
		let n = base.cloneNode(true)
		the_grid.appendChild(n)
		grid.push(n.firstChild)
	}
	
	let video = document.createElement("video")
	video.onerror = () => {
		modal.alert("<h6>Error</h6><br>Video not found!")
	}
	
	// Updating the grid
	let id = setInterval(() => {
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
		let data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
		
		for (let i = 0; i < num_pixels; i++) {
			let values = data.slice(i * 4, (i + 1) * 4)
			let string = new Array(...values).map((v) => v.toString(16).padStart(2, "0")).join("")
			grid[i].style.background = "#" + string
		}
	}, 16)
	
	video.onended = () => clearInterval(id)
	video.src = options.video_path
	
	setTimeout(() => {
		modal.hide()
		video.play()
	}, 50)

	window.vid = video
}