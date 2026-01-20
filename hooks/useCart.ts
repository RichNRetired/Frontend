import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useCart = () => {
    const cart = useSelector((state: RootState) => state.cart);
    return cart;
};