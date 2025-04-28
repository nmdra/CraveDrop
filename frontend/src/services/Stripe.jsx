import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import React from 'react';

const PUBLISH_KEY = 'pk_test_51RErI8RaMVEyYN7k9JSNZHcktzyVq8fybSIc3KZshl2I2Iy5Q8VJcGgp716TC4MzTKySp7xsy5lrbVMh9gb0s0wb00dvEjXEc2';
const stripePromise = loadStripe(PUBLISH_KEY);

<Elements stripe={stripePromise}>
  <CheckoutForm clientSecret={sk_test_51RErI8RaMVEyYN7k65aS1QDKF6B3Dj1ATmNTdokL2ZLYQjjHvxJ51o78yIKZy16MNkFBtHOoJlT1mrg9G3rH6qym00czWLrwZ9} />
</Elements>
