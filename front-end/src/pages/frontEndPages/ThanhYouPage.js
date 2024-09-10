import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Container } from '@mui/material';

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', paddingTop: '100px' }}>
      <Typography variant="h4" gutterBottom>
        Cảm ơn bạn đã đặt hàng!
      </Typography>
      <Typography variant="body1">
        Bạn sẽ nhận được e-mail xác nhận đơn hàng từ chúng tôi sau đây.
      </Typography>
      <Typography variant="body1">
        Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ liên hệ với bạn sớm nhất.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={() => navigate('/')}>
          Quay về trang chủ
        </Button>
      </Box>
    </Container>
  );
};

export default ThankYouPage;
