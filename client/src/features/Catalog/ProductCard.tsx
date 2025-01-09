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
          ${(product.price/100).toFixed(2)}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton 
            loading={loading} 
            onClick={() => handleAddItem(product.id)}
            size="small">Add to cart</LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
      </CardActions>
    </Card>
  );
}
