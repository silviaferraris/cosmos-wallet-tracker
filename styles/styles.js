import { styled } from '@mui/material/styles';
import { Box, Card as MuiCard, TextField as MuiTextField } from '@mui/material';

export const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
}));

export const Card = styled(MuiCard)(({ theme }) => ({
  width: 800,
  padding: theme.spacing(3),
  textAlign: 'center',
}));

export const ProgressBarContainer = styled('div')({
  width: '100%',
  backgroundColor: '#e0e0e0',
  borderRadius: 5,
  overflow: 'hidden',
  margin: '20px 0',
});

export const ProgressBar = styled('div')({
  height: 20,
  backgroundColor: '#3f51b5',
  transition: 'width 0.3s ease-in-out',
});

export const TextField = styled(MuiTextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));
