import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, onSnapshot, query, orderBy, deleteDoc, setDoc } from "firebase/firestore";
import db from '../db'
import { Link } from 'react-router-dom';
import AddJournal from './AddJournal';

export default function Journal() {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleDelete = async (entryId) => {
        console.log("delete");
        console.log(entryId);
        await deleteDoc(doc(db, "journal-entries", entryId));
    }

    const handleEdit = async (entryId) => {
        const newData = window.prompt("New Entry");
        await setDoc(doc(db, "journal-entries", entryId), {
            entry: newData,
            createdAt: new Date()
        });
    }

    useEffect(() => {
        const getData = async () => {
            try {
                    // const querySnapshot = await getDocs(collection(db, "journal-entries"));
                    // console.log(querySnapshot);
                    // querySnapshot.forEach((doc) => {
                        //     doc.data() is never undefined for query doc snapshots
                        //     console.log(doc.id, " => ", doc.data());
                        // });

                const journalQuery = query(collection(db, "journal-entries"), orderBy("createdAt", "desc"));
                
                onSnapshot(journalQuery, snapshot => {
                    // console.log("Current data: ", snapshot.docs);
                    setEntries(snapshot.docs);
                    setIsLoading(false);
                });

                        
            } catch {
                setHasError(true);
                setIsLoading(false)
            }
        }

        getData();
        return () => onSnapshot;
    }, []);

    if(isLoading) {
        return <p>Loading...</p>
    }

    if(hasError) {
        return <p>Error!</p>
    }

    return (
        <div>
            <h1>Journal</h1>
            <AddJournal/>
            {entries.map(entry =>  {
                return (
                    <div key={entry.id}>
                        <p>{entry.data().entry}</p>
                        <span>
                            <Link to={`/journal/${entry.id}`}>View</Link>
                            <button onClick={() => {handleDelete(entry.id)}}>Delete Entry</button>
                            <button onClick={() => {handleEdit(entry.id)}}>Edit</button>
                        </span>
                    </div>
                )
            })}
        </div>
    );
}
