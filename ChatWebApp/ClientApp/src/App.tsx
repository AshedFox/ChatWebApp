import React from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from './components/AppRouter';
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <AppRouter/>
        </BrowserRouter>
    </div>
  );
}

export default App;
