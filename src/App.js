import React, { useState, useEffect } from 'react';

const prompts = [
  { text: "Hope is a good thing, maybe the best of things. – The Shawshank Redemption", credit: "The Shawshank Redemption" },
  { text: "You are not the darkness you endured. You are the light that refused to surrender.", credit: "Unknown" },
  { text: "There is no secret ingredient. It's just you. – Kung Fu Panda", credit: "Kung Fu Panda" },
  { text: "What emotion are you avoiding right now, and why?", credit: "Therapy Prompt" },
  { text: "What part of this still needs more kindness?", credit: "Therapist Prompt" },
  { text: "What would you tell your younger self today?", credit: "Reflection Prompt" },
  { text: "What are three things you're grateful for right now?", credit: "Gratitude Prompt" },
  { text: "How did you show kindness to yourself today?", credit: "Self-Care Prompt" }
];

const imageUrls = [
  "https://source.unsplash.com/1600x900/?nature,forest",
  "https://source.unsplash.com/1600x900/?mountains,nordic",
  "https://source.unsplash.com/1600x900/?lake,calm",
  "https://source.unsplash.com/1600x900/?sunset,trees",
  "https://source.unsplash.com/1600x900/?ocean,peace",
  "https://source.unsplash.com/1600x900/?winter,snow",
  "https://source.unsplash.com/1600x900/?northern,lights",
  "https://source.unsplash.com/1600x900/?fjord,norway"
];

function App() {
  const [promptIndex, setPromptIndex] = useState(-1);
  const [currentEntry, setCurrentEntry] = useState('');
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('journal_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [bgImage, setBgImage] = useState('');
  const [clock, setClock] = useState(new Date());
  const [lanternMode, setLanternMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');

  const getFormattedDate = () =>
    clock.toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });

  const getFormattedTime = () =>
    clock.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchNewImage();
    const timer = setInterval(() => {
      if (!lanternMode) fetchNewImage();
    }, 15 * 60 * 1000);
    return () => clearInterval(timer);
  }, [lanternMode]);

  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  }, [entries]);

  const fetchNewImage = () => {
    const random = Math.floor(Math.random() * imageUrls.length);
    setBgImage(imageUrls[random]);
  };

  const toggleLantern = () => {
    setLanternMode(!lanternMode);
  };

  const showPrompt = () => {
    let next;
    do {
      next = Math.floor(Math.random() * prompts.length);
    } while (next === promptIndex && prompts.length > 1);
    setPromptIndex(next);
  };

  const saveEntry = () => {
    if (!currentEntry.trim()) {
      showNotification('Please write something before saving!');
      return;
    }

    const newEntry = {
      id: Date.now(),
      content: currentEntry,
      date: new Date().toISOString(),
      prompt: promptIndex >= 0 ? prompts[promptIndex] : null,
      wordCount: currentEntry.trim().split(/\s+/).length
    };

    setEntries(prev => [newEntry, ...prev]);
    setCurrentEntry('');
    setPromptIndex(-1);
    showNotification('Entry saved successfully!');
  };

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    showNotification('Entry deleted');
  };

  const downloadEntry = () => {
    if (!currentEntry.trim()) {
      showNotification('No content to download!');
      return;
    }

    const blob = new Blob([currentEntry], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `northern-journal-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    showNotification('Entry downloaded!');
  };

  const downloadAllEntries = () => {
    if (entries.length === 0) {
      showNotification('No entries to download!');
      return;
    }

    const content = entries.map(entry => {
      const date = new Date(entry.date).toLocaleString();
      const prompt = entry.prompt ? `Prompt: ${entry.prompt.text}\n\n` : '';
      return `Date: ${date}\n${prompt}${entry.content}\n\n---\n\n`;
    }).join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `northern-journal-all-entries-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    showNotification('All entries downloaded!');
  };

  const copyEntry = () => {
    if (!currentEntry.trim()) {
      showNotification('No content to copy!');
      return;
    }
    navigator.clipboard.writeText(currentEntry);
    showNotification('Entry copied to clipboard!');
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const filteredEntries = entries.filter(entry =>
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.prompt && entry.prompt.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);

  return (
    <div className={`app ${lanternMode ? 'lantern-mode' : ''}`} style={{
      minHeight: '100vh',
      padding: '1rem',
      backgroundImage: lanternMode ? 'radial-gradient(circle, #2c1810 0%, #0f0a06 100%)' : `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      transition: 'all 1s ease-in-out',
      position: 'relative'
    }}>
      {/* Notification */}
      {notification && (
        <div className="notification" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-in'
        }}>
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: '12px',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontWeight: 'bold', color: '#333' }}>{getFormattedDate()}</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>{getFormattedTime()}</div>
        </div>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            {entries.length} entries • {totalWords} words
          </span>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            style={{
              backgroundColor: showHistory ? '#ff6b6b' : '#4ecdc4',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '3rem',
            margin: '0',
            color: lanternMode ? '#ff9500' : '#fff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            fontWeight: '300'
          }}>
            Northern Journal
          </h1>
          <p style={{
            fontStyle: 'italic',
            fontSize: '1.2rem',
            color: lanternMode ? '#ffb84d' : '#f0f0f0',
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
            margin: '0.5rem 0'
          }}>
            Healing begins in silence.
          </p>
        </div>

        {/* Prompt Section */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          padding: '2rem',
          margin: '2rem 0',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            {promptIndex >= 0 ? (
              <div>
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  color: '#333',
                  margin: '0 0 1rem 0',
                  fontWeight: '500'
                }}>
                  {prompts[promptIndex].text}
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#666',
                  fontStyle: 'italic',
                  margin: '0'
                }}>
                  — {prompts[promptIndex].credit}
                </p>
              </div>
            ) : (
              <p style={{
                fontSize: '1.1rem',
                color: '#666',
                margin: '0',
                textAlign: 'center'
              }}>
                Click below to receive a journal prompt to inspire your writing.
              </p>
            )}
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button onClick={showPrompt} style={{
              backgroundColor: '#6c5ce7',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              New Prompt
            </button>
            <button onClick={fetchNewImage} style={{
              backgroundColor: '#00b894',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              New Background
            </button>
            <button onClick={toggleLantern} style={{
              backgroundColor: lanternMode ? '#e17055' : '#fdcb6e',
              color: lanternMode ? 'white' : '#333',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              {lanternMode ? 'Exit Lantern' : 'Lantern Mode'}
            </button>
          </div>
        </div>

        {/* Writing Area */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Write your thoughts here... Let the words flow freely."
            style={{
              width: '100%',
              height: '300px',
              padding: '1.5rem',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              resize: 'vertical',
              fontFamily: 'Georgia, serif',
              backgroundColor: '#fefefe',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#6c5ce7'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              Words: {currentEntry.trim() ? currentEntry.trim().split(/\s+/).length : 0}
            </span>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => setCurrentEntry('')} style={{
                backgroundColor: '#ff7675',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Clear
              </button>
              <button onClick={copyEntry} style={{
                backgroundColor: '#74b9ff',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Copy
              </button>
              <button onClick={downloadEntry} style={{
                backgroundColor: '#a29bfe',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Download
              </button>
              <button onClick={saveEntry} style={{
                backgroundColor: '#00b894',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Save Entry
              </button>
            </div>
          </div>
        </div>

        {/* History Section */}
        {showHistory && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h2 style={{ margin: '0', color: '#333' }}>Journal History</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '0.9rem'
                  }}
                />
                <button onClick={downloadAllEntries} style={{
                  backgroundColor: '#e17055',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  Download All
                </button>
              </div>
            </div>

            {filteredEntries.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                {entries.length === 0 ? 'No entries yet. Start writing!' : 'No entries match your search.'}
              </p>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filteredEntries.map((entry) => (
                  <div key={entry.id} style={{
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    backgroundColor: '#fefefe'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                          {new Date(entry.date).toLocaleString()} • {entry.wordCount} words
                        </div>
                        {entry.prompt && (
                          <div style={{
                            fontSize: '0.85rem',
                            color: '#888',
                            fontStyle: 'italic',
                            marginBottom: '0.5rem'
                          }}>
                            Prompt: {entry.prompt.text}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        style={{
                          backgroundColor: '#ff7675',
                          color: 'white',
                          border: 'none',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      color: '#333',
                      maxHeight: '150px',
                      overflow: 'hidden'
                    }}>
                      {entry.content.substring(0, 300)}
                      {entry.content.length > 300 && '...'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: '3rem',
        padding: '2rem',
        fontSize: '0.9rem',
        color: lanternMode ? '#ffb84d' : '#f0f0f0',
        textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
      }}>
        Built by Veenkoti Studios — Inspired by Sisu, Lagom, and Hygge. Let silence be your sanctuary.
      </footer>
    </div>
  );
}

export default App;