/**
 * @module noteManager
 * @description Manages notes using browser local storage.
 * @responsibilities
 * - Get, save, delete, and find notes.
 * - Search notes by title or content.
 * - Generate unique IDs for new notes.
 */

// --- Constants and Initializations ---

const NOTES_KEY = "notes";
let notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];

// --- Helper Functions ---

function generateId() {
  return `note_${new Date().getTime()}`;
}

function saveToStorage() {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// --- Core Note Management Functions ---

export function getNotes() {
  return notes;
}

export function saveNote(noteData, id = null) {
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
    // Add new notes to the beginning of the array
    notes.unshift(newNote);
  }
  saveToStorage();
}

export function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveToStorage();
}

export function findNoteById(id) {
  return notes.find((note) => note.id === id);
}

export function searchNotes(query) {
  const lowerCaseQuery = query.toLowerCase();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowerCaseQuery) ||
      stripHtml(note.content).toLowerCase().includes(lowerCaseQuery)
  );
}