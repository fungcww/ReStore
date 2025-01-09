import ProductList from "./ProductList";
import { useFetchProductsQuery } from "./CatalogApi";

// interface Props{
//   products: Product[];
//   addProduct: () => void;
// }

export default function Catalog() {
const {data, isLoading} = useFetchProductsQuery();

if(isLoading || !data) return <div>Loading...</div>

return (
  <>
    <ProductList products={data}/>
  </>
);
}





  /////// obselete after using RTK query
  // const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   agent.Catalog.list()
  //   .then(products => setProducts(products))
  //   .catch(error => console.log(error))
  //   .finally(() => setLoading(false))
  // },[])

  // if(loading) return <LoadingComponent message="Loading products..."/>

//   return (
//     <>
//       <ProductList products={products}/>
//       {/* <Button variant='contained' onClick={addProduct}>Add Product</Button> */}
//     </>
//   );
// }
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
