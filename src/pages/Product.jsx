import products from '../data/products.json';

function Product() {
  return (
    <div>
      <h2>Produk Kami</h2>
      {products.map((product, index) => (
        <div key={index}>
          <h3>{product.name}</h3>
          <img src={product.image} alt={product.name} width="200" />
          <p>{product.description}</p>
          <a href={`https://wa.me/${product.wa_number}?text=${encodeURIComponent(product.wa_message)}`} target="_blank">
            Pesan via WhatsApp
          </a>
        </div>
      ))}
    </div>
  );
}

export default Product;