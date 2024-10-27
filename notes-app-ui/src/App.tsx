import { useState } from 'react';
import './App.css';

// Defining a TypeScript type for a Note, which includes an id, title, and content.
type Note = {
  id: number;
  title: string;
  content: string;
}

// Main component
const App = () => {
  // State to store an array of notes, initialized with some default notes.
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: 'note 1', content: 'note content 1' },
    { id: 2, title: 'note 2', content: 'note content 2' },
    { id: 3, title: 'note 3', content: 'note content 3' },
    { id: 4, title: 'note 4', content: 'note content 4' },
    { id: 5, title: 'note 5', content: 'note content 5' },
  ]);

  // States for handling new note input
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // State for handling editing notes
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  // State to track which note is flying away
  const [flyAwayNoteId, setFlyAwayNoteId] = useState<number | null>(null);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  // Function to handle form submission and add a new note to the list
  const handleAddNote = (event: React.FormEvent) => {
    event.preventDefault(); // Prevents page reload on form submission

    // Creating a new note object with a unique id, title, and content from form inputs
    const newNote: Note = {
      id: notes.length + 1, // New id based on current note count
      title: title,
      content: content
    };

    // Updating notes state by adding the new note at the start of the array
    setNotes([newNote, ...notes]);

    // Resetting the form fields
    setTitle("");
    setContent("");
  };

  const handleUpdateNote = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote) {
      return;
    }

    const updatedNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content
    };

    const updatedNotesList = notes.map((note) =>
      note.id === selectedNote.id
        ? updatedNote
        : note
    );

    setNotes(updatedNotesList);
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  const deleteNote = (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();
    setFlyAwayNoteId(noteId);

    // Delay the note deletion to allow for fly-away animation
    setTimeout(() => {
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      setFlyAwayNoteId(null); // Reset fly-away state
    }, 300); // Match this duration with the CSS transition
  }

  return (
    <div className='div-container'>
      {/* Form for adding new notes */}
      <form className='note-form' onSubmit={(event) => selectedNote ? handleUpdateNote(event) : handleAddNote(event)}>
        {/* Input field for the note title */}
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder='Title'
          required
        />
        {/* Textarea for the note content */}
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder='Content'
          rows={10}
          required
        />
        {selectedNote ? (
          <div className='edit-buttons'>
            <button type='submit'>Update</button>
            <button onClick={handleCancel}> Cancel</button>
          </div>
        ) : (
          <button type='submit'>Add Note</button>
        )}
      </form>

      {/* Displaying the list of notes */}
      <div className='notes-grid'>
        {notes.map((note) => (
          // Individual note item
          <div
            key={note.id}
            className={`note-item ${flyAwayNoteId === note.id ? 'fly-away' : ''}`}
            onClick={() => handleNoteClick(note)}
          >
            {/* Header of the note, with a button for deleting */}
            <div className='notes-header'>
              <button onClick={(event) => deleteNote(event, note.id)}>x</button>
            </div>
            {/* Displaying note title and content */}
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
