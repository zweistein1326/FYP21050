import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { RestLink } from 'apollo-link-rest';
// import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import CredentialPage from './pages/CredentialPage';
import { useEffect } from 'react';
import AddCredential from './pages/AddCredential';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import RequestCredential from './pages/RequestCredential';


declare var window: any;

const restLink = new RestLink({ uri: '/api' });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: restLink,
});

const {ethereum} = window;

const connectWalletHandler = async () => {
  try{
    const accounts = await ethereum.request({method: 'eth_requestAccounts'});
    console.log('account', accounts[0]);
    console.log("Wallet exists! We're ready to go!");
  } catch(err){
    console.log(err);
  }
}

export const store = configureStore();
const auth = store.getState().auth


function App() {

  useEffect(()=>{
    connectWalletHandler();
  },[])

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/user/:id" element={<Home />} />
          <Route path="/user/:id/:credentialId" element={<CredentialPage />} />
          <Route path="/addCredential" element={<AddCredential />} />
          <Route path="/requestCredential" element={<RequestCredential />} />
        </Routes>
      </Router>
      </Provider>
    </ApolloProvider>
  );
}

export default App;
