import { Button } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";

// interface Props{
//   products: Product[];
//   addProduct: () => void;
// }

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:5014/api/Products')
    .then(response => response.json())
    .then(data => setProducts(data))
  },[])

  // function addProduct() {
  //   //setProducts([...products, {name: 'product3', price: 300.0}])//spread operator ... can spread the current object into arrays for manipulation
  //   setProducts(preState => [...preState,
  //      {
  //       //id: preState.length + 101,
  //       id: preState.length +1,
  //       name: 'product' + (preState.length + 1), 
  //       price: (preState.length * 100) + 100,
  //       brand: 'good brand',
  //       description: 'description' + (preState.length + 1),
  //       pictureUrl : 'http://picsum.photos/200'
  //      }])
  // }
  return (
    <>
      <ProductList products={products}/>
      {/* <Button variant='contained' onClick={addProduct}>Add Product</Button> */}
    </>
  );
}