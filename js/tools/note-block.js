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
    container.innerHTML = `
    <div class="d-flex align-items-center justify-content-center" style="height: 300px!important;">
      <div class="position-relative d-inline-block" style="width: 300px!important" >
        <p class="position-absolute top-50 start-50 text-nowrap" style="transform: translate(-50%, -50%);">Nenhuma anotação encontrada</p>
        <img src="svg/landscape.svg" class="idle-pulse d-block w-100 h-auto rounded-3" alt="Empty State" style="opacity: 0.2; width: 300px; height: auto; overflow: hidden; background: radial-gradient(circle,rgba(255, 114, 94, 0.1) 0%, rgba(255, 255, 255, 0) 50%);">
      </div>    
    </div>
    `;
    return;
  }

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
                    <button class="btn btn-primary btn-sm edit-button"
                        style="padding: 0.6rem 1.4rem!important;">Editar</button>
                    <button class="btn btn-outline-danger btn-sm delete-button"
                        style="padding: 0.6rem 1.4rem!important;">Excluir</button>
                </div>
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

  document.getElementById("modalContent").textContent = "Editar Nota";
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
