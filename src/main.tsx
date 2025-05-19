
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ContractorProvider } from './context/ContractorContext.tsx'

createRoot(document.getElementById("root")!).render(
  <ContractorProvider>
    <App />
  </ContractorProvider>
);
