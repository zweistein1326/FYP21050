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
import Account from './pages/Account'
import DashboardPage from './pages/Sidebar/Home'
import UploadPage from './pages/Sidebar/upload'
import RevokePage from './pages/Sidebar/Revoke'
import { CookiesProvider } from 'react-cookie';
import { useCookies } from 'react-cookie';
// import {use}


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

// const GetCookies =()=>{
//   const [cookies, setCookie] = useCookies(['user']);
//   // setCookie('user', , {path: '/'})

// }

export const store = configureStore();
const auth = store.getState().auth


function App() {

  useEffect(()=>{
    connectWalletHandler();
    // GetCookies();
  },[])

  return (
    // <div style={{background: 'blue', height:'100%', width:'100%'}}>
    <CookiesProvider>
    <ApolloProvider client={client}>
      <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
<<<<<<< .merge_file_bgHTbf
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />}/>
          <Route path="/home" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/revoke" element={<RevokePage />} />
=======
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/user/:id" element={<Home />} />
          <Route path="/user/:id/:credentialId" element={<CredentialPage />} />
          <Route path="/addCredential" element={<AddCredential />} />
          <Route path="/requestCredential" element={<RequestCredential />} />
>>>>>>> .merge_file_ABBnT8
        </Routes>
      </Router>
      </Provider>
    </ApolloProvider>
    </CookiesProvider>
  );
}

export default App;
