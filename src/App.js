import 'react-phone-number-input/style.css';
import './App.css';
import PhoneInput from './PhoneInput';

function App() {
  return (
    <div className='container'>
      <form>
        <PhoneInput onBlur={(e) => console.log(e)} />
      </form>
    </div>
  );
}

export default App;

