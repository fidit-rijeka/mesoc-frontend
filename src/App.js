import { Switch, Route } from 'react-router-dom';

import './assets/scss/theme.scss';
import './myScss/myMain.scss';

import Navbar from './components/navbar';
import Browse from './pages/Browse';
import MyDocuments from './pages/MyDocuments';
import SendFeedback from './pages/SendFeedback';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UploadDocument from './pages/UploadDocument';
import Analysis from './pages/Analysis';


function App() {
  return (
    <div className="App">
      <Route path='/' component={Navbar} />
      <Switch>
        <Route path='/browse' component={Browse} />
        <Route path='/my-documents' component={MyDocuments} />
        <Route path='/send-feedback' component={SendFeedback} />
        <Route path='/sign-in' component={SignIn} />
        <Route path='/create-account' component={SignUp} />
        <Route path='/upload-document' component={UploadDocument} />
        <Route path='/:analysisType/:analysisKey' component={Analysis} />
      </Switch>
    </div>
  );
}

export default App;