import { Grid2, Typography } from "@mui/material";
import { useFetchBasketQuery } from "./basketApi"
import BasketItem from "./BasketItem";
import OrderSummary from "../../app/shared/components/OrderSummary";

export default function BasketPage() {
  const {data, isLoading} = useFetchBasketQuery();
  
  if(isLoading) return <Typography>Loading basket...</Typography>
  if(!data || data.items.length === 0) return <Typography variant='h3'>Your basket is now empty!</Typography>
  return (
    //<div>{data.buyerId}</div>
    <Grid2 container spacing={2}>
      <Grid2>
      {data.items.map(item => (
        <BasketItem item={item} key={item.productId}/>
      ))}
      {data.buyerId}
      </Grid2>
      <Grid2 size={4}>
        <OrderSummary/>
      </Grid2>
    </Grid2>
  )
    // const [loading, setLoading] = useState(true)
    // const [basket, setBasket] = useState<Basket | null>(null);

    // useEffect(() => {
    //     agent.Basket.get()
    //     .then(basket => setBasket(basket))
    //     .catch(error => console.log(error))
    //     .finally(() => setLoading(false))
    // }, [])

    // if(loading) return <LoadingComponent message='Loading basket...' />

    // if(!basket) return <Typography variant='h3'>Your basket is now empty!</Typography>

    // return (
    //     <TableContainer component={Paper}>
    //   <Table sx={{ minWidth: 650 }} aria-label="simple table">
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>Product</TableCell>
    //         <TableCell align="right">Price</TableCell>
    //         <TableCell align="right">Quantity</TableCell>
    //         <TableCell align="right">Subtotal</TableCell>
    //         <TableCell align="right"></TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {basket.items.map((item) => (
    //         <TableRow
    //           key={item.productId}
    //           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    //         >
    //           <TableCell component="th" scope="row">
    //             {item.name}
    //           </TableCell>
    //           <TableCell align="right">${(item.price/100).toFixed(2)}</TableCell>
    //           <TableCell align="right">{item.quantity}</TableCell>
    //           <TableCell align="right">{((item.price/100) * item.quantity).toFixed(2)}</TableCell>
    //           <TableCell align="right">
    //             <IconButton color = 'error'>
    //                 <Delete/>
    //             </IconButton>
    //           </TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </TableContainer>
    // )
}