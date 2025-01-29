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
import { useAddBasketItemMutation, useFetchBasketQuery, useRemoveBasketItemMutation } from "../basket/basketApi";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { Iron } from "@mui/icons-material";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [removeBasketItem] = useRemoveBasketItemMutation();
  const [addBasketItem] = useAddBasketItemMutation(); //return as object array -> []
  const {data : basket} = useFetchBasketQuery(); //get basket item to check if item added or not before -> 
  // -> data : basket return as object -> need {} 
  const item = basket?.items.find(x => x.productId === +id!);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if(item) setQuantity(item.quantity);
  }, [item])

  const {data: product, isLoading} = useFetchProductDetailsQuery(id ? +id : 0) // +id = parseInt(id) ,const [product, setProducts] = useState<Product | null>(null);
  // const [loading, setLoading] = useState(true);

  if (!product || isLoading) return <div>Loading Product...</div>;

  const handleUpdateBasket = () => {
    const updatedQuantity = item ? Math.abs(quantity - item.quantity) : quantity;
    if(!item || quantity > item.quantity)
    {
      addBasketItem({product, quantity: updatedQuantity});
    } else {
      removeBasketItem({productId: product.id, quantity: updatedQuantity})
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = +event.currentTarget.value;

    if(value>=0) setQuantity(value)
  }

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
              //defaultValue={1} //when using defaultvalue in MUI -> uncontrolled component 
              // -> change it to controlled component by setting as Value and track it using react state
              value={quantity}
              onChange={handleInputChange}
            />{" "}
          </Grid2>
          <Grid2 size={6}>
            <Button
              onClick={handleUpdateBasket}
              disabled={quantity === item?.quantity || !item && quantity === 0} 
              // uantity === item?.quantity -> same qty -> false if item not exist in basket ,
              // !item make sure won't reduce a item not exist in basket
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              {item ? 'Update Quantity' : 'Add to basket'}
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
