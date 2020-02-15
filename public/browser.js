function itemTemplate(item) {
	return `<li><span class="item-edit">${item.text}</span>
				<div class="butts">            	
            	<button data-id="${item._id}" class="delete-me">Delete</button>
            	<button data-id="${item._id}" class="edit-me">Edit</button>
            	</div>
            	</li>`
}

// Initial Page Loader Render
let ourHTML = items.map(function(item) {
	return itemTemplate(item)
}).join('')
document.getElementById("ourList").insertAdjacentHTML("beforeend", ourHTML)

// Create Feature
let createField = document.getElementById("ourField")

document.getElementById("ourForm").addEventListener("submit", function(e) {
	e.preventDefault()
	axios.post('/create-item', {text: createField.value}).then(function(response) {
		// Create the HTML for a new item
		document.getElementById("ourList").insertAdjacentHTML("beforeend", itemTemplate(response.data))
		ourField.value = ""
		ourField.focus()
	}).catch(function() {
		console.log("Please try again later.")
	})
})

document.addEventListener("click", function(e) {
	// Delete Feature
	if (e.target.classList.contains("delete-me")) {
		if (confirm("Are you sure you want to delete?")) {
			axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(function() {
				e.target.parentElement.parentElement.remove()
				}).catch(function() {
				console.log("Please try again later.")
			})
		}
	}

	// Update Feature
	if (e.target.classList.contains("edit-me")) {
		let userInput = prompt("Enter your amendments", e.target.parentElement.parentElement.querySelector(".item-edit").innerHTML)
			if (userInput) {
				axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function() {
				e.target.parentElement.parentElement.querySelector(".item-edit").innerHTML = userInput
				}).catch(function() {
				console.log("Please try again later.")
			})
		}
	}

})