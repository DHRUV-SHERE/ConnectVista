import API from './api';

export const subscribe = (data) => API.post('/subscriptions/subscribe', data);
export const getMySubscription = () => API.get('/subscriptions/my-subscription');
export const cancelSubscription = () => API.post('/subscriptions/cancel');
