import logo from "./logo.svg";
import "./App.css";
// import products from "./products.json";
import Product from "./components/Product.jsx";
import Header from "./components/header";


function App() {

  return (
  <div>
    <div>
      <Header />
    </div>
    <div className="container">

        <Product />

      </div>
  
  </div>
  );
}

export default App;
