// Load notes from localStorage or start with an empty array
let notes = JSON.parse(localStorage.getItem("simple-notes") || "[]");
let editingId = null; // ID of the note being edited (null if not editing)

// Save the current notes array to localStorage
function saveToStorage() {
  localStorage.setItem("simple-notes", JSON.stringify(notes));
}

// Generate a unique ID based on the current timestamp
function generateId() {
  return Date.now().toString();
}

// Format a date in "pt-BR" locale with day, month, hour, and minute
function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Render the notes on the page
function renderNotes(notesToShow = notes) {
  const container = document.getElementById("notesList");

  // Show empty state if there are no notes
  if (notesToShow.length === 0) {
    container.innerHTML = emptyHTML;
    return;
  }

  // Build the HTML for each note
  container.innerHTML = notesToShow
    .map(
      (note) => `
        <div class="note-item card d-flex flex-row gap-2 rounded-3 justify-content-between"
            data-id="${note.id}">
            <div class="d-flex flex-column gap-2">
                <h5 class="note-title mb-1" style="color:var(--primary-400);">${
                  note.title
                }</h5>
                <p class="d-inline-block note-content text-muted text-truncate" style="max-width: 25rem">${
                  note.content
                }</p>
            </div>
            <div class="d-flex flex-column gap-2">
                <div class="note-date align-self-end me-2" style="color:var(--primary-300)">${formatDate(
                  note.date
                )}</div>
                <div class="note-actions d-flex gap-2">
                    <button class="btn btn-primary btn-sm fw-semibold edit-button lh-normal"
                        style="padding: 0.6rem 1.4em!important;">Editar</button>
                    <button class="btn btn-outline-danger delete-button lh-1"
                        style="padding: 0.6rem 0.8rem!important;">
                          <img src="svg/trash.svg" alt="Delete" width="18">
                        </button>
                </div>
            </div>
        </div>
      `
    )
    .join("");
}

// Save a new note or update an existing one
function saveNote() {
  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();

  // Validate fields
  if (!title || !content) {
    alert("Please fill in both title and content!");
    return;
  }

  // If editing an existing note
  if (editingId) {
    const index = notes.findIndex((n) => n.id === editingId);
    notes[index] = { ...notes[index], title, content, date: new Date() };
  } else {
    // Add new note at the beginning of the array
    notes.unshift({
      id: generateId(),
      title,
      content,
      date: new Date(),
    });
  }

  saveToStorage();
  renderNotes();
  closeModal(); // Close modal after saving
}

// Load a note into the modal for editing
function editNote(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  editingId = id;

  document.getElementById("modalContent").textContent = "Edit Note";
  document.getElementById("noteTitle").value = note.title;
  document.getElementById("noteContent").value = note.content;

  // Show the Bootstrap modal
  new bootstrap.Modal(document.getElementById("noteModal")).show();
}

// Delete a note with confirmation
function deleteNote(id) {
  if (confirm("Delete this note?")) {
    notes = notes.filter((n) => n.id !== id);
    saveToStorage();
    renderNotes();
  }
}

// Close the modal and reset form fields
function closeModal() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("noteModal")
  );
  modal.hide();

  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
  editingId = null;
}

// Filter notes based on the search input
function searchNotes() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
  );
  renderNotes(filtered);
}

// Handle clicks for edit and delete buttons
document.getElementById("notesList").addEventListener("click", function (e) {
  const parent = e.target.closest(".note-item");
  if (!parent) return;

  const noteId = parent.getAttribute("data-id");

  if (e.target.classList.contains("edit-button")) {
    editNote(noteId);
  }

  if (e.target.classList.contains("delete-button")) {
    deleteNote(noteId);
  }
});

// Save note when clicking the save button
document.getElementById("saveNote").addEventListener("click", saveNote);

// Filter notes while typing in the search input
document.getElementById("searchInput").addEventListener("input", searchNotes);

// Clear the form and state when modal is hidden
document
  .getElementById("noteModal")
  .addEventListener("hidden.bs.modal", closeModal);

// Initial render of the notes on page load
renderNotes();
