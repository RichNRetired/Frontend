import axios from './axios';

export const processPayment = async (paymentData: any) => {
    const response = await axios.post('/payment', paymentData);
    return response.data;
};

export const getPaymentMethods = async () => {
    const response = await axios.get('/payment/methods');
    return response.data;
};