import React, {useEffect, useState} from 'react';
import './App.css';
import MessageForm from "./Components/Message/MessageForm";

function App() {
    const[messageFormNeedUpdate, setMessageFormNeedUpdate] = useState(true);

  return (
    <div className="App">
        <header>
            Messagerie
        </header>
        <MessageForm messageFormNeedUpdate={() => setMessageFormNeedUpdate(true)}/>
    </div>
  );
}

export default App;
