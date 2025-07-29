import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StrictMode } from "react";
import "./index.css";
import "./App.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';     
// import 'primeflex/primeflex.css'; // (اختياري لكن مهم)
import { PrimeReactProvider } from "primereact/api";
import { Provider } from 'react-redux';
import { store } from './redux/store';



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider>
      <Provider store={store}>
          <App />
      </Provider>
    </PrimeReactProvider>
  </StrictMode>
);
