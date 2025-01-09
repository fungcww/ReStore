import {
  Button,
  Divider,
  Grid,
  Grid2,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import { useFetchProductDetailsQuery } from "./CatalogApi";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()

  const {data: product, isLoading} = useFetchProductDetailsQuery(id ? +id : 0) // +id = parseInt(id) ,const [product, setProducts] = useState<Product | null>(null);
  // const [loading, setLoading] = useState(true);

  if (!product || isLoading) return <div>Loading Product...</div>;

  if (!product) return <NotFound />;

  const productDetails = [
    { label: "Name", value: product.name },
    { label: "Description", value: product.description },
    { label: "Type", value: product.type },
    { label: "Brand", value: product.brand },
    { label: "Quantity In Stock", value: product.quantityInStock },
  ];
  return (
    <Grid2 container spacing={6} maxWidth="lg" sx={{ mx: "auto" }}>
      <Grid2 size={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid2>
      <Grid2 size={6}>
        <Typography variant="h4">{product.name}</Typography>{" "}
        <Divider sx={{ mb: 2 }} />{" "}
        <Typography variant="h4" color="secondary">
          ${((product.price || 0) / 100).toFixed(2)}{" "}
        </Typography>{" "}
        <TableContainer>
          <Table sx={{ "& td": { fontSize: "1rem" } }}>
            <TableBody>
              {productDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {detail.label}
                  </TableCell>
                  <TableCell>{detail.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid2 container spacing={2} margin={3}>
          <Grid2 size={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in basket"
              fullWidth
              defaultValue={1}
            />{" "}
          </Grid2>
          <Grid2 size={6}>
            <Button
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              Add to Basket
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
