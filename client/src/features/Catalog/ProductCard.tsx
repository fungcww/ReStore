import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { useState } from "react";
import agent from "../../app/api/agent";
import {LoadingButton} from "@mui/lab"
import { useAddBasketItemMutation } from "../basket/basketApi";
import { currencyFormat } from "../../lib/util";
// const theme = createTheme({
//     palette: {
//       primary: {
//         main: purple[500],
//       },
//       secondary: {
//         main: green[500],
//       },
//     },
//   });

interface Props {
  product: Product;
}
export default function ProductCard({ product }: Props) {
  const [addbasketItem, {isLoading}] = useAddBasketItemMutation();
  const [loading, setLoading] = useState(false);

  function handleAddItem(productId: number){
    setLoading(true);
    agent.Basket.addItem(productId)
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
  }
  return (
    <Card sx={{ maxWidth: 340 }}>
      <CardHeader
        avatar = {<Avatar sx={{color:'secondary.main'}}>{product.name.charAt(0).toLocaleUpperCase()}</Avatar>}
        title = {product.name}
        titleTypographyProps={{
            sx:{fontWeight: 'bold', color:'primary.main'}
        }}
      />
      <CardMedia
        sx={{ height: 140, backgroundSize: "contain", bgcolor:'secondary.light' }}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom color="secondary" variant="h5">
          {currencyFormat(product.price)}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton 
            loading={loading} 
            onClick={() => handleAddItem(product.id)}
            size="small"></LoadingButton>
        <Button 
          disabled = {isLoading}
          onClick={() => addbasketItem({product, quantity: 1})}>Add to cart</Button>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
      </CardActions>
    </Card>
  );
}
