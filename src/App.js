import logo from "./logo.svg";
import "./App.css";
// import products from "./products.json";
import Product from "./components/Product.jsx";

function App() {
  return (
    <div>
      {/* <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div> */}
      {/* <div className="grid">
        {products.map((product) => {
          return (
            <div key={product.id} className="card">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <p>
                <button>Add to Cart</button>
              </p>
            </div>
          );
        })}
      </div> */}

      <Product />

    </div>
  );
}

export default App;
