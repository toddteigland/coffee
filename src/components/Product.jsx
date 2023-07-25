import '../styles/home.css';
import products from "../products.json";


export default function Product() {

  return (
    <div className="grid">
    {products.map((product) => {
      return (
        <div key={product.id} className="card">
          <img src={product.image} alt={`Preview of ${product.title}`} />
          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <p>${product.price}</p>
          <p>
            <button>Add to Cart</button>
          </p>
        </div>
      );
    })}
  </div>
  )

}