<script>
	let guests = JSON.parse(localStorage.getItem('guests')) || [];
	let firstName = '';
	let lastName = '';
	let idCardNumber = '';
	let editingIndex = -1;
  
	function addGuest() {
	  if (firstName && lastName && idCardNumber) {
		const newGuest = { firstName, lastName, idCardNumber };
		if (editingIndex === -1) {
		  guests = [...guests, newGuest];
		} else {
		  guests[editingIndex] = newGuest;
		  editingIndex = -1;
		}
		localStorage.setItem('guests', JSON.stringify(guests));
		resetForm();
	  } else {
		alert('Please fill in all fields.');
	  }
	}
  
	function resetForm() {
	  firstName = '';
	  lastName = '';
	  idCardNumber = '';
	  editingIndex = -1;
	}
  
	function deleteGuest(index) {
		if (index >= 0 && index < guests.length) {
			guests.splice(index, 1);
			localStorage.setItem('guests', JSON.stringify(guests));
		} else {
			console.error("Invalid index for deleting guest");
		}
	}

	function editGuest(index) {
	  const guest = guests[index];
	  firstName = guest.firstName;
	  lastName = guest.lastName;
	  idCardNumber = guest.idCardNumber;
	  editingIndex = index;
	}
  </script>  
  
  <main class="container mt-5">
	<div class="card">
	  <div class="card-header">
		<h1 class="card-title text-center">Guest Registration</h1>
	  </div>
	  <div class="card-body">
		<form on:submit|preventDefault={addGuest}>
		  <div class="mb-3">
			<label for="firstName" class="form-label">First Name:</label>
			<input type="text" id="firstName" class="form-control" bind:value={firstName} required>
		  </div>
  
		  <div class="mb-3">
			<label for="lastName" class="form-label">Last Name:</label>
			<input type="text" id="lastName" class="form-control" bind:value={lastName} required>
		  </div>
  
		  <div class="mb-3">
			<label for="idCardNumber" class="form-label">ID Card Number:</label>
			<input type="text" id="idCardNumber" class="form-control" bind:value={idCardNumber} required>
		  </div>
  
		  <div class="text-center">
			<button type="submit" class="btn btn-primary">Register</button>
		  </div>
		</form>
	  </div>
	</div>
  
	<div class="mt-4">
	  <h2>Guest List</h2>
	  <ul>
		{#each guests as guest, index (guest.idCardNumber)}
		  <li>
			{guest.firstName} {guest.lastName} ({guest.idCardNumber})
			{#if index === editingIndex}
			  <button on:click={() => addGuest()} class="btn btn-success btn-sm">Save</button>
			  <button on:click={() => resetForm()} class="btn btn-secondary btn-sm">Cancel</button>
			{:else}
			  <button on:click={() => editGuest(index)} class="btn btn-warning btn-sm">Edit</button>
			  <button on:click={() => deleteGuest(index)} class="btn btn-danger btn-sm">Delete</button>
			{/if}
		  </li>
		{/each}
	  </ul>
	</div>
  </main>
  
  <style>
	.card {
	  max-width: 400px;
	  margin: 0 auto;
	}
  </style>
  