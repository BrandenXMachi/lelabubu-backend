# LeLabubu.ca Stripe Payment Integration

This project implements a simple Stripe payment integration for the LeLabubu.ca e-commerce website using Python and Flask.

## File Structure

```
lelabubu/
├── app.py
├── .env
├── templates/
│   ├── index.html
│   ├── success.html
│   └── cancel.html
```

## Prerequisites

- Python 3.6+
- Flask
- Stripe account
- pip (Python package manager)

## Installation

1. Install the required dependencies:
   ```
   pip install flask stripe python-dotenv
   ```

2. Create a `.env` file in the root directory with your Stripe API keys:
   ```
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_51Rerp84RpqeAczydMUzeLHi8R8iK3K3ghT1OYPoEUoGCKoCaJ3nZAes4CgjpePcJKriFt317fjVxq7vdnosjBPEW00YaPDWkGK
   ```

   **Note:** These are test keys. Replace them with your own production keys for a live environment.

## Running the Application

1. Start the Flask server:
   ```
   python app.py
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

3. Click the "Buy Now" button to be redirected to Stripe Checkout.

## How It Works

### Backend (Flask)

- `app.py`: Main Flask application that handles routes and Stripe integration
- `/create-checkout-session`: Endpoint that creates a Stripe checkout session and redirects to Stripe
- `/success`: Route that handles successful payments
- `/cancel`: Route that handles cancelled payments

### Frontend (Templates)

- `templates/index.html`: Simple page with a "Buy Now" button
- `templates/success.html`: Page shown after successful payment
- `templates/cancel.html`: Page shown after cancelled payment

## Testing

Use the following test card numbers for testing:

- Successful payment: `4242 4242 4242 4242`
- Failed payment: `4000 0000 0000 0002`

For more test cards, see the [Stripe testing documentation](https://stripe.com/docs/testing).

## Production Deployment

For production deployment:

1. Replace the test API keys with production keys
2. Update the `YOUR_DOMAIN` variable in `app.py` to your actual domain
3. Set up proper error handling and logging
4. Set `debug=False` in the Flask application

## Security Considerations

- API keys are stored in environment variables, not in code
- HTTPS should be used in production
