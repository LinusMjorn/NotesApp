import { useEffect, useState } from 'react';
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
  const [notes, setNotes] = useState<Note[]>([]);

  // States for handling new note input
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // State for handling editing notes
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notes")
        const notes: Note[] = await response.json()
        setNotes(notes)
      } catch (e) {
        console.log(e);
      }
    };

    fetchNotes();

  },[]);
  
  // State to track which note is flying away
  const [flyAwayNoteId, setFlyAwayNoteId] = useState<number | null>(null);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  // Function to handle form submission and add a new note to the list
  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();

    // Creating a new note object with a unique id, title, and content from form inputs
    try {
      const response = await fetch(
        "http://localhost:5000/api/notes",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            title, content
          })
        }
      );
      const newNote = await response.json(); 

      setNotes([newNote, ...notes]);
      // Resetting the form fields
      setTitle("");
      setContent("");
      
    } catch (e) {
      console.log(e)
    }
    // Updating notes state by adding the new note at the start of the array
   
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote.id}`,{
          method:"PUT",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            title, content
          })
        }
      )
      const updatedNote = await response.json(); 

      const updatedNotesList = notes.map((note) =>
        note.id === selectedNote.id
          ? updatedNote
          : note
      );
  
      setNotes(updatedNotesList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
      
    } catch (e) {
      console.log(e)
    }


  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  const deleteNote = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();

    try {
      await fetch(
        `http://localhost:5000/api/notes/${noteId}`,{
          method:"DELETE",
        })
      setFlyAwayNoteId(noteId);
      // Delay the note deletion to allow for fly-away animation
      setTimeout(() => {
        const updatedNotes = notes.filter((note) => note.id !== noteId);
        setNotes(updatedNotes);
        setFlyAwayNoteId(null); // Reset fly-away state
      }, 300); // Match this duration with the CSS transition
      
    } catch (e) {
      console.log(e)
    }


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
