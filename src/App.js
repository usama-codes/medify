import './App.css';
import SideBar from './components/SideBar';
import SearchBar from './components/SearchBar';

function App() {
  return (
    <div className="App">
      <SideBar />
      <div className='content'>
        <SearchBar />
      </div>
    </div>
  );
}

export default App;
