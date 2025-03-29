import { Link, useParams } from "react-router-dom";
import { useFetchOrderDetailedQuery } from "./orderApi";
import {
  Box,
  Button,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { currencyFormat, formatAddressString, formatPaymentString } from "../../lib/util";

export default function OrderDetailedPage() {
  const { id } = useParams(); //taking id from the url /orders/:id -> retrieve order

  const { data: order, isLoading } = useFetchOrderDetailedQuery(+id!);

  if (isLoading) return <Typography>Loading order...</Typography>;

  if (!order) return <Typography>Order not found</Typography>;

  return (
    <Card sx={{ p: 2, maxWidth: "md", mx: "auto" }}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h5" fontWeight="bold">
          Order summary for #{order.id}
        </Typography>
        <Button component={Link} to="/orders" variant="outlined">
          Back to orders
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography component="dt" variant="subtitle1" fontWeight="500">
          Billing and delivery Info
        </Typography>
        <Box component="dl">
          <Typography component="dd" variant="body2" fontWeight="500">
            Shipping address
          </Typography>
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            {formatAddressString(order.shippingAddress)}
          </Typography>
        </Box>
        <Box component="dl">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Payment Info
          </Typography>
          <Typography component="dd" variant="body2" fontWeight="500">
            {formatPaymentString(order.paymentSummary)}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography component="dt" variant="subtitle1" fontWeight="500">
          Order Details
        </Typography>
        <Box component="dl">
          <Typography component="dd" variant="body2" fontWeight="500">
            Email address
          </Typography>
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            {order.buyerEmail}
          </Typography>
        </Box>
        <Box component="dl">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Order status
          </Typography>
          <Typography component="dd" variant="body2" fontWeight="500">
            {order.orderStatus}
          </Typography>
        </Box>
        <Box component="dl">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Order date
          </Typography>
          <Typography component="dd" variant="body2" fontWeight="500">
            {format(order.orderDate, "dd MMM yyyy")}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <TableContainer>
        <Table>
          <TableBody>
            {order?.orderItems.map((item) => (
              <TableRow
                key={item.id}
                sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
              >
                <TableCell>
                  <Box display={"flex"} gap={3} alignItems={"center"}>
                    <img
                      src={item.pictureUrl}
                      alt={item.name}
                      style={{ width: 50, height: 50 }}
                    />
                    <Typography>{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ p: 4 }}>
                  {item.quantity}
                </TableCell>
                <TableCell align="right" sx={{ p: 4 }}>
                  {item.price}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mx={3}>
        <Typography component="dt" variant="subtitle1" fontWeight="500">
          Order Charge
        </Typography>
        <Box component="dl" display={"flex"} justifyContent={"space-between"}>
          <Typography component="dd" variant="body2" fontWeight="500">
            Subtotal
          </Typography>
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            {currencyFormat(order.subtotal)}
          </Typography>
        </Box>
        <Box component="dl" display={"flex"} justifyContent={"space-between"}>
          <Typography component="dd" variant="body2" fontWeight="500">
            Discount
          </Typography>
          <Typography
            component="dt"
            variant="subtitle1"
            fontWeight="300"
            color="green"
          >
            {currencyFormat(order.discount)}
          </Typography>
        </Box>
        <Box component="dl" display={"flex"} justifyContent={"space-between"}>
          <Typography component="dd" variant="body2" fontWeight="500">
            Delivery Fee
          </Typography>
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            {currencyFormat(order.deliveryFee)}
          </Typography>
        </Box>
      </Box>
      <Box component="dl" display={"flex"} justifyContent={"space-between"} mx={3}>
          <Typography component="dd" variant="body2" fontWeight="500">
            Total
          </Typography>
          <Typography component="dt" variant="subtitle1" fontWeight="700">
            {currencyFormat(order.total)}
          </Typography>
        </Box>
    </Card>
  );
}
