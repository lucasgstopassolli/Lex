let notes = JSON.parse(localStorage.getItem("simple-notes") || "[]");
let editingId = null;

function saveToStorage() {
  localStorage.setItem("simple-notes", JSON.stringify(notes));
}

function generateId() {
  return Date.now().toString();
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderNotes(notesToShow = notes) {
  const container = document.getElementById("notesList");

  if (notesToShow.length === 0) {
    container.innerHTML =
      '<div class="empty-state">Nenhuma nota encontrada</div>';
    return;
  }

  container.innerHTML = notesToShow
    .map(
      (note) => `
        <div class="note-item" data-id="${note.id}">
          <div class="note-title">${note.title}</div>
          <div class="note-content">${note.content}</div>
          <div class="note-date">${formatDate(note.date)}</div>
          <div class="note-actions">
            <button class="btn btn-outline-primary btn-sm edit-button">Editar</button>
            <button class="btn btn-outline-danger btn-sm delete-button">Excluir</button>
          </div>
        </div>
      `
    )
    .join("");
}

function saveNote() {
  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();

  if (!title || !content) {
    alert("Preencha título e conteúdo!");
    return;
  }

  if (editingId) {
    // Editar nota existente
    const index = notes.findIndex((n) => n.id === editingId);
    notes[index] = { ...notes[index], title, content, date: new Date() };
  } else {
    // Nova nota
    notes.unshift({
      id: generateId(),
      title,
      content,
      date: new Date(),
    });
  }

  saveToStorage();
  renderNotes();
  closeModal();
}

function editNote(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  editingId = id;

  document.getElementById("modalTitle").textContent = "Editar Nota";
  document.getElementById("noteTitle").value = note.title;
  document.getElementById("noteContent").value = note.content;

  new bootstrap.Modal(document.getElementById("noteModal")).show();
}

function deleteNote(id) {
  if (confirm("Excluir esta nota?")) {
    notes = notes.filter((n) => n.id !== id);
    saveToStorage();
    renderNotes();
  }
}

function closeModal() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("noteModal")
  );
  modal.hide();

  // Reset form
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
  document.getElementById("modalTitle").textContent = "Nova Nota";
  editingId = null;
}

function searchNotes() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
  );
  renderNotes(filtered);
}

// Event delegation para botões de editar/excluir
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

// Event listeners
document.getElementById("saveNote").addEventListener("click", saveNote);
document.getElementById("searchInput").addEventListener("input", searchNotes);
document
  .getElementById("noteModal")
  .addEventListener("hidden.bs.modal", closeModal);

// Inicialização
renderNotes();
