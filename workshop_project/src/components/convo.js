import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useToast } from './toast';

export default function Convo({ showGestureHint, setShowGestureHint, refreshEntries }) {
  const [ui, setUi] = useState('initial');
  const [entry, setEntry] = useState('');
  const { triggerToast } = useToast();

 async function handleSubmitEntry() {
    setUi('loading')
    try {
        const response = await fetch('http://localhost:5000/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ prompt: entry}),
        });
        const data = await response.json();
        if(data.response) {
            console.log('AI response:', data.response);
            setUi('submitted');
            if(refreshEntries) {
                refreshEntries();
            }
        } else {
            throw new Error(data.error || 'no response from chat');
        }
    } catch(error) {
        throw new Error('error making entry', error);
        setUi('initial');
        triggerToast('Error submitting entry');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{textAlign: 'center}}'}}>Have A Conversation!</h1>
        {(ui === 'initial' || ui === 'loading') &&(
            <textarea
                style={{
                    width:'100%', 
                    height: '200px',
                    fontSize: '1rem',
                    padding: '0.5rem',
                    boxSizing: 'border-box'
                }}

                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                disabled={ui === 'loading'}
                placeholder="say something..."
            />
        )}

        {entry === '' && (
            <p style={{textAlign: 'center', color:'#888'}}>
                i suggest you say something...
            </p>
        )}

        {(entry !== '' && (ui === 'initial' || ui === 'loading')) && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                    onClick={handleSubmitEntry}
                    disabled={ui === 'loading'}
                    style={{
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        backgroundColor: '#d97706',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer'
                    }}
                    >
                        {ui === "loading" ? 'End Conversation' : 'Convo Entry'}
                    </button>
            </div>
        )}

        {(entry !== '' && (ui === 'initial' || ui === 'loading')) && (
            <div style={{ textAlign: 'center', marginTop: '1rem'}}>
                <button
                    onClick={handleSubmitEntry}
                    disabled={ui === 'loading'}
                    style={{
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        backgroundColor: '#d97706',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer'
                    }}
                    >
                        {ui ==='loading' ? 'End Conversation' : 'Convo Entry'}
                    </button>
            </div>
        )}

        {ui === 'submitted' && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem'}}>
                    Your entry has been submitted!
                    {/* the AI component would continue to call the API and process each response */}
                </p>
                <div>
                    <button
                        onClick={() => {
                            // could scroll to past entries
                            document.getElementById('past-entries')?.scrollIntoView({ behavior: 'smooth'});
                        }}
                        style={{
                            margin: '0.5rem',
                            padding: '0.75rem 1.25rem',
                            fontSize: '1rem',
                            backgroundColor: '#d97706',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                       >
                        go up
                       </button>
                       <button
                          onClick={() => {
                            // reset the form to add a new entry
                            setUi('initial');
                            setEntry('');
                          }}

                          style={{
                            margin: '0.5rem',
                            padding: '0.75rem 1.25rem',
                            fontSize: '1rem',
                            backgroundColor: 'white',
                            border: '2px solid #d97706',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                            type more if u want
                       </button>
                </div>
            </div>
        )}

    </div>

    );
}