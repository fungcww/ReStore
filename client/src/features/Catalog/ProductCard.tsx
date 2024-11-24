import {
  Avatar,
  Button,
  createTheme,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { Product } from "../../app/models/product";
import { green, purple } from "@mui/material/colors";

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
        <Button size="small">Add to cart</Button>
        <Button size="small">View</Button>
      </CardActions>
    </Card>
  );
}
