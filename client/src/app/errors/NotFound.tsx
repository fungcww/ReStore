import { SearchOff } from "@mui/icons-material";
import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound(){
    return (
        <Paper
            sx={{
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems:'center',
                p: 6
            }}
        >
            <SearchOff sx={{fontSize: 100}} color="primary"/>
            <Typography gutterBottom variant="h3">
                oh - we could not find what you were looking for
            </Typography>
            <Button fullWidth component={Link} to='/catalog'>
                Go Back
            </Button>
        </Paper>
        // <Container component={Paper}>
        //     <Typography gutterBottom variant="h3">
        //         Not found, sorry!
        //     </Typography>
        //     <Divider/>
        //     <Button fullWidth component={Link} to='/catalog'>Go back to shop</Button>
        // </Container>
    )
}