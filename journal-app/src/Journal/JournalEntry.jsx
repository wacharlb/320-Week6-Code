import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import db from '../db'

export default function JournalEntry() {
    const { id } = useParams();
    const [entry, setEntry] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const docRef = doc(db, "journal-entries", id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    // console.log("Document data:", docSnap.data());
                    setEntry(docSnap.data());
                    setHasError(false);
                    setIsLoading(false);
                } else {
                    // docSnap.data() will be undefined in this case
                    // console.log("No such document!");
                    throw new Error();
                }
            } catch {
                // error
                setHasError(true);
                setIsLoading(false);
            }
        }

        getData();
    }, [id])

    if(isLoading) {
        return <p>Loading...</p>
    }

    if(hasError) {
        return <p>Error!</p>
    }

    return (
        <div>
            <h1>Journal Entry: {id}</h1>
            <p>{entry.entry}</p>
        </div>
    );
}
