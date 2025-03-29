import { Box, Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Order } from "../../app/models/order";
import { currencyFormat, formatAddressString, formatPaymentString } from "../../lib/util";

export default function CheckoutSuccess() {
    const {state} = useLocation();
    const order = state.data as Order;

    if(!order) return <Typography>Order not found</Typography>

    // const addressString = () => {
    //     const address = order.shippingAddress;

    //     return `${address?.name}, ${address?.line1}, ${address?.city}, ${address?.state},
    //         ${address?.postal_code}, ${address?.country} `
    // }

    // const paymentString = () => {
    //     const card = order.paymentSummary;

    //     return `${card?.brand.toUpperCase()}, **** **** **** ${card?.last4}, 
    //     Exp: ${card?.exp_month}/${card?.exp_year}`
    // }

    return (
        <Container maxWidth="md">
            <>
                <Typography variant="h4" gutterBottom fontWeight='bold'>
                    Thanks for test order~ {order.orderStatus}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Your order number is <strong>{order.id}</strong>
                </Typography>
                <Paper elevation={3} sx={{p: 2, mt: 2}}>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Typography>
                        {order.orderDate}
                        </Typography>
                    </Box>
                    <Divider/>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Typography>
                        Payment method
                        </Typography>
                        <Typography fontWeight='bold'>
                        {formatPaymentString(order.paymentSummary)}
                        </Typography>
                    </Box>
                    <Divider/>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Typography>
                         Shipping address
                        </Typography>
                        <Typography fontWeight='bold'>
                        {formatAddressString(order.shippingAddress)}
                        </Typography>
                    </Box>
                    <Divider/>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Typography>
                         Amount
                        </Typography>
                        <Typography fontWeight='bold'>
                        {currencyFormat(order.total)}
                        </Typography>
                    </Box>
                </Paper>

                <Box mt={6} mx='auto'>
                    <Button variant="contained" color="primary" component={Link} to={`/orders/${order.id}`}>
                        View your order            
                    </Button>
                    <Button component={Link} to='/catalog' variant="contained" color="primary">
                        Continue shopping         
                    </Button>
                </Box>
            </>
        </Container>
    )
}