// noteManager.js

// Carrega as notas do localStorage ou começa com um array vazio
let notes = JSON.parse(localStorage.getItem("simple-notes") || "[]");

// Salva o array de notas atual no localStorage
function saveToStorage() {
  localStorage.setItem("simple-notes", JSON.stringify(notes));
}

// Gera um ID único baseado no tempo
function generateId() {
  return Date.now().toString();
}

// Remove tags HTML para a busca no conteúdo
function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// --- Funções Exportadas ---

export function getNotes() {
  return notes;
}

export function findNoteById(id) {
    return notes.find(n => n.id === id);
}

export function saveNote(noteData, editingId) {
  if (editingId) {
    const index = notes.findIndex((n) => n.id === editingId);
    if (index > -1) {
      notes[index] = { ...notes[index], ...noteData, date: new Date() };
    }
  } else {
    notes.unshift({
      id: generateId(),
      ...noteData,
      date: new Date(),
    });
  }
  saveToStorage();
}

export function deleteNote(id) {
  notes = notes.filter((n) => n.id !== id);
  saveToStorage();
}

// Lógica de busca que retorna um array filtrado
export function searchNotes(query) {
    const lowerCaseQuery = query.toLowerCase();
    return notes.filter(
        (note) =>
            note.title.toLowerCase().includes(lowerCaseQuery) ||
            stripHtml(note.content).toLowerCase().includes(lowerCaseQuery)
    );
}