import "./App.css";
import Product from "./components/Product.jsx";
import Header from "./components/header";
import Map from "./components/Map";



export default function App() {

  return (
  <div>
    <div>
      <Header />
    </div>
        <Product />  
        <Map />
  </div>
  );
}

