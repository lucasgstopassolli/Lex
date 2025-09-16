// main.js

import * as noteManager from './manager.js';

let editingId = null;
let quill = null; // Instância do Quill
const container = document.getElementById("notesList");
const noteModal = document.getElementById("noteModal");
const emptyHTML = `<div class="col-12 text-center text-muted"><p>Nenhuma nota ainda. Crie a sua primeira!</p></div>`;

// --- Funções de Inicialização e UI ---

function initQuillEditor() {
    if (quill) return; // Evita reinicializar

    quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['link', 'clean']
            ]
        }
    });
}

function formatDate(date) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function renderNotes(notesToShow) {
  if (notesToShow.length === 0) {
    container.innerHTML = emptyHTML;
    return;
  }

  container.innerHTML = notesToShow.map((note) => `
    <div class="col-lg-4">
      <div class="note-item card d-flex flex-row gap-2 rounded-3 justify-content-between" data-id="${note.id}">
        <div class="d-flex flex-column gap-2">
          <h5 class="note-title mb-1" style="color:var(--primary-400);">${note.title}</h5>
          <p class="d-inline-block note-content text-muted text-truncate" style="max-width: 14rem">
            ${escapeHtml(stripHtml(note.content))}
          </p>
        </div>
        <div class="d-flex flex-column gap-2">
          <div class="note-date align-self-end me-2" style="color:var(--primary-300)">${formatDate(note.date)}</div>
          <div class="note-actions d-flex gap-2">
            <button class="btn btn-primary btn-sm fw-normal edit-button lh-normal" style="padding: 0.6rem 1.4em!important;">Editar</button>
            <button class="btn btn-outline-danger delete-button lh-1" style="padding: 0.6rem 0.7rem!important;">
              <img src="img/svg/trash.svg" alt="Delete" width="18" style="pointer-events: none;">
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function openEditModal(id) {
    const note = noteManager.findNoteById(id);
    if (!note) return;

    editingId = id;
    document.getElementById("modalContent").textContent = "Editar Nota";
    document.getElementById("noteTitle").value = note.title;
    
    // Garante que o editor Quill esteja pronto e define o conteúdo
    initQuillEditor();
    quill.root.innerHTML = note.content;

    new bootstrap.Modal(noteModal).show();
}

function resetModal() {
    document.getElementById("noteTitle").value = "";
    if (quill) {
        quill.root.innerHTML = "";
    }
    editingId = null;
    document.getElementById("modalContent").textContent = "Nova Anotação";
}

function handleSave() {
    const title = document.getElementById("noteTitle").value.trim();
    const dirtyContent = quill.root.innerHTML;
    const cleanContent = DOMPurify.sanitize(dirtyContent);

    if (!title) {
        alert("Por favor, preencha o título!");
        return;
    }
    
    noteManager.saveNote({ title, content: cleanContent }, editingId);
    renderNotes(noteManager.getNotes());
    
    const modal = bootstrap.Modal.getInstance(noteModal);
    if (modal) modal.hide();
}

function handleSearch() {
    const query = document.getElementById("searchInput").value;
    const filteredNotes = noteManager.searchNotes(query);
    renderNotes(filteredNotes);
}

// --- Event Listeners ---
document.getElementById("saveNote").addEventListener("click", handleSave);
document.getElementById("searchInput").addEventListener("input", handleSearch);

// Inicializa o editor Quill quando o modal é aberto
noteModal.addEventListener("shown.bs.modal", initQuillEditor);
// Limpa o modal quando ele é fechado
noteModal.addEventListener("hidden.bs.modal", resetModal);

container.addEventListener("click", (e) => {
    const noteItem = e.target.closest(".note-item");
    if (!noteItem) return;

    const noteId = noteItem.dataset.id;
    if (e.target.classList.contains("edit-button")) {
        openEditModal(noteId);
    }
    if (e.target.classList.contains("delete-button")) {
        if (confirm("Deletar esta nota?")) {
            noteManager.deleteNote(noteId);
            renderNotes(noteManager.getNotes());
        }
    }
});

// --- Inicialização ---
renderNotes(noteManager.getNotes());
