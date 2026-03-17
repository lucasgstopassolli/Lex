import { escapeHtml, stripHtml, alertTrigger, getAlertConfig } from '../utils/dom.js';

// --- Note Management (formerly manager.js) ---

const whiteHoleSvgUrl =
  typeof chrome !== "undefined" && chrome.runtime?.getURL
    ? chrome.runtime.getURL("img/svg/white-hole.svg")
    : "img/svg/white-hole.svg";

const NOTES_KEY = "notes";
let notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];

function generateId() {
  return `note_${new Date().getTime()}`;
}

function saveToStorage() {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function getNotes() {
  return notes;
}

function saveNote(noteData, id = null) {
  if (id) {
    const note = findNoteById(id);
    if (note) {
      Object.assign(note, { ...noteData, date: new Date() });
    }
  } else {
    const newNote = {
      id: generateId(),
      ...noteData,
      date: new Date(),
    };
    notes.unshift(newNote);
  }
  saveToStorage();
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveToStorage();
}

function findNoteById(id) {
  return notes.find((note) => note.id === id);
}

function searchNotes(query) {
  const lowerCaseQuery = query.toLowerCase();
  // The stripHtml function from manager.js is now imported from dom.js
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowerCaseQuery) ||
      stripHtml(note.content).toLowerCase().includes(lowerCaseQuery)
  );
}

// --- UI and Event Handling (formerly main.js) ---

const emptyHTML = `
    <div class="enter-animation d-flex align-items-center justify-content-center flex-column gap-4 p-4" style="height: 400px!important;">
      <div class="idle-pulse user-select-none">
        <img draggable="false" src="${whiteHoleSvgUrl}" class="d-block h-auto" alt="Empty State"
        style="opacity: 0.6; width: 250px; height: auto; transform: rotate(16deg)!important;">
      </div>
      <div class="d-flex flex-column justify-content-center gap-2 user-select-none">
        <p class="text-nowrap fs-4 fw-normal mb-0" style="line-height: normal">"O silêncio antecede a criação"</p>
        <p class="fw-light text-end mb-0 fst-italic" style="line-height: normal; font-size: 0.8rem">Autor desconhecido</p>
      </div>
    </div>    
`;

let editingId = null;
let quill = null; // Quill instance
const container = document.getElementById("notesList");
const noteModal = document.getElementById("noteModal");

function initQuillEditor() {
    if (quill) return;

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

function renderNotes(notesToShow) {
  if (notesToShow.length === 0) {
    container.innerHTML = emptyHTML;
    return;
  }

  container.innerHTML = notesToShow.map((note) => `
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
            <button class="btn btn-outline-danger delete-button lh-1" style="padding: 0.6rem!important;">
              <img src="https://api.iconify.design/material-symbols:delete-rounded.svg?color=%23ffffff" alt="Delete" width="18" style="pointer-events: none;">
            </button>
          </div>
        </div>
      </div>
  `).join("");
}

function openEditModal(id) {
    const note = findNoteById(id);
    if (!note) return;

    editingId = id;
    document.getElementById("modalContent").textContent = "Editar Nota";
    document.getElementById("noteTitle").value = note.title;
    
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
        alertTrigger(getAlertConfig("fillTitle"));
        return;
    }
    
    saveNote({ title, content: cleanContent }, editingId);
    renderNotes(getNotes());
    
    const modal = bootstrap.Modal.getInstance(noteModal);
    if (modal) modal.hide();
}

function handleSearch() {
    const query = document.getElementById("searchInput").value;
    const filteredNotes = searchNotes(query);
    renderNotes(filteredNotes);
}

// --- Event Listeners Setup ---
function setupNoteEventListeners() {
    document.getElementById("saveNote").addEventListener("click", handleSave);
    document.getElementById("searchInput").addEventListener("input", handleSearch);

    noteModal.addEventListener("shown.bs.modal", initQuillEditor);
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
                deleteNote(noteId);
                renderNotes(getNotes());
            }
        }
    });
}


// --- Initialization ---
function initializeNotes() {
    renderNotes(getNotes());
    setupNoteEventListeners();
}

initializeNotes();
