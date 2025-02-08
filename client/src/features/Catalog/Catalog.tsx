import ProductList from "./ProductList";
import { useFetchFiltersQuery, useFetchProductsQuery } from "./CatalogApi";
import { Grid2, Pagination, Typography } from "@mui/material";
import Filters from "./Filters";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber } from "./catalogSlice";

// interface Props{
//   products: Product[];
//   addProduct: () => void;
// }

export default function Catalog() {
const productParams = useAppSelector(state => state.catalog);
const {data, isLoading} = useFetchProductsQuery(productParams);
const {data: filtersData, isLoading: filtersLoading} = useFetchFiltersQuery();
const dispatch = useAppDispatch();

if(isLoading || !data || filtersLoading || !filtersData) return <div>Loading...</div>

return (
  //add filtered data to Filters to avoid second loading 
  <Grid2 container spacing={4}>
    <Grid2 size={3}>
      <Filters filtersData={filtersData}/>
    </Grid2>
    <Grid2 size={9}>
    {data.items && data.items.length > 0 ? (
        <>
        <AppPagination
          metadata={data.pagination}
          onPageChange={(page: number) => {
            dispatch(setPageNumber(page));
            window.scrollTo({top: 0, behavior:'smooth'})
          }}
        />
        </>
    ) : (
      <Typography variant="h5">No results found!</Typography>
    )
    }
    <ProductList products={data.items}/>
    </Grid2>
  </Grid2>
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
