import React, {useState} from 'react'
import { collection, addDoc } from "firebase/firestore"; 
import db from '../db'

function AddJournal() {
    const [entry, setEntry] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(entry);

        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "journal-entries"), {
            entry: entry,
            createdAt: new Date()
        });
        setEntry('');
        console.log("Document written with ID: ", docRef.id);
    }

    return (
        <>
            <h2>Add Journal</h2>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="entry-point"></label>
                <textarea id="entry-input" onChange={e => setEntry(e.target.value)} value={entry}/>
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default AddJournal