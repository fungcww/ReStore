import { useForm } from 'react-hook-form';
import { useRegisterMutation } from './accountApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockOutlined } from '@mui/icons-material';
import { Container, Paper, Box, Typography, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { RegisterSchema, registerSchema } from '../../lib/schemas/RegisterSchema';

export default function RegisterForm() {
    const [registerUser] = useRegisterMutation();
    const {register, handleSubmit, setError, formState: {errors, isValid, isLoading}} = useForm<RegisterSchema>({
        mode: 'onTouched',
        resolver: zodResolver(registerSchema)
    })
    const onSubmit = async (data: RegisterSchema) => {
        try {
            await registerUser(data).unwrap();
        } catch (error) 
        {
            console.log(error);
            const apiError = error as {message: string};
            if(apiError.message && typeof apiError.message === 'string'){
                const errorArray = apiError.message.split(',');

                errorArray.forEach(e => {
                    if(e.includes('Password')){
                        setError('password', {message: e});
                    } else if(e.includes('Email')){
                        setError('email', {message: e});
                    }
                })
            }
        }
    }
    return (
        <Container component={Paper} maxWidth="sm" sx={{borderRadius: 2, padding: 2}}>
        <Box display='flex' flexDirection='column' alignItems='center' marginTop='8'>
            <LockOutlined sx={{mt: 3, color: 'secondary.main', fontSize: 40}} />
            <Typography variant='h5' sx={{mt: 2}}>
                Register
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                width='100%'
                display={'flex'}
                flexDirection={'column'}
                gap={3}
                marginY={3}
            >
                <TextField
                fullWidth
                label="Email"
                autoFocus
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <Button disabled={isLoading || !isValid} type="submit" variant="contained" color="primary" sx={{height: 50}}>
                    Register    
                </Button>
                <Typography sx={{textAlign: 'center'}}>
                    Already have an account?
                    <Typography sx={{ml:1}} component={Link} to='/login' color="primary">
                    Sign in here
                    </Typography>
                </Typography>
            </Box>
        </Box>
    </Container>
    )
}