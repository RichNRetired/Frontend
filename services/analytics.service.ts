import axios from './axios';

export const sendEvent = async (event: string, payload: any = {}) => {
    try {
        await axios.post('/analytics/event', { event, payload });
    } catch (err) {
        // non-blocking, just log
        console.error('Analytics send failed', err);
    }
};
