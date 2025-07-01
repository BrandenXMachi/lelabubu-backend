from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
import stripe
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__, static_folder='.')

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
# Determine domain based on environment
import os
if os.getenv('FLASK_ENV') == 'production':
    YOUR_DOMAIN = 'https://lelabubu.ca'
else:
    YOUR_DOMAIN = 'http://localhost:5000'  # For local testing

@app.route('/')
def index():
    # Serve the static index.html file from the root directory
    return send_from_directory('.', 'index.html')

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        # Check if the request is a form submission or JSON
        if request.is_json:
            # Handle JSON request (from cart.html or custom checkout)
            data = request.json
            cart_items = data.get('items', [])
            customer_info = data.get('customer', {})
            payment_method_id = data.get('payment_method_id', None)
            
            if not cart_items:
                return jsonify({'error': 'No items in cart'}), 400
            
            # Calculate amount
            amount = sum(int(float(item['price']) * 100) * item['quantity'] for item in cart_items)
            
            # Add shipping cost if not in Montreal
            shipping_cost = 0
            if customer_info and customer_info.get('address', {}).get('city', '').lower() not in ['montreal', 'montréal']:
                shipping_cost = 2500  # $25.00 in cents
            
            amount += shipping_cost
            
            # Create a description of the purchase
            description = f"Purchase from LeLabubu.ca - {len(cart_items)} item(s)"
            
            # Create metadata with order details
            metadata = {
                'customer_email': customer_info.get('email', '') if customer_info else '',
                'customer_name': f"{customer_info.get('firstName', '')} {customer_info.get('lastName', '')}" if customer_info else '',
                'items': ', '.join([f"{item['name']} x {item['quantity']}" for item in cart_items])
            }
            
            if payment_method_id:
                # Create a PaymentIntent for custom checkout
                payment_intent = stripe.PaymentIntent.create(
                    amount=amount,
                    currency='cad',
                    payment_method=payment_method_id,
                    description=description,
                    metadata=metadata,
                    receipt_email=customer_info.get('email') if customer_info else None,
                    shipping={
                        'name': f"{customer_info.get('firstName', '')} {customer_info.get('lastName', '')}" if customer_info else '',
                        'address': {
                            'line1': customer_info.get('address', {}).get('line1', ''),
                            'line2': customer_info.get('address', {}).get('line2', ''),
                            'city': customer_info.get('address', {}).get('city', ''),
                            'state': customer_info.get('address', {}).get('state', ''),
                            'postal_code': customer_info.get('address', {}).get('postal_code', ''),
                            'country': customer_info.get('address', {}).get('country', 'CA')
                        }
                    } if customer_info and customer_info.get('address') else None,
                    confirm=True
                )
                
                # Return the client secret to the client
                return jsonify({
                    'id': payment_intent.client_secret,
                    'success': payment_intent.status == 'succeeded'
                })
            else:
                # Create line items for Stripe Checkout
                line_items = []
                for item in cart_items:
                    line_items.append({
                        'price_data': {
                            'currency': 'cad',
                            'product_data': {
                                'name': item['name'],
                                'images': [item['image']] if 'image' in item else [],
                            },
                            'unit_amount': int(float(item['price']) * 100),  # Convert to cents
                        },
                        'quantity': item['quantity'],
                    })
                
                # Add shipping as a line item if applicable
                if shipping_cost > 0:
                    line_items.append({
                        'price_data': {
                            'currency': 'cad',
                            'product_data': {
                                'name': 'Shipping',
                            },
                            'unit_amount': shipping_cost,
                        },
                        'quantity': 1,
                    })
                
                # Create Stripe checkout session
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=line_items,
                    mode='payment',
                    success_url=YOUR_DOMAIN + '/success.html',
                    cancel_url=YOUR_DOMAIN + '/cart.html',
                    metadata=metadata
                )
                
                # Return the session ID to the client
                return jsonify({'id': checkout_session.id})
        else:
            # Handle form submission (from index.html)
            line_items = [{
                'price_data': {
                    'currency': 'cad',
                    'unit_amount': 2000,  # $20.00
                    'product_data': {
                        'name': 'Lelabubu Item',
                    },
                },
                'quantity': 1,
            }]
            
            # Create Stripe checkout session
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url=YOUR_DOMAIN + '/success.html',
                cancel_url=YOUR_DOMAIN + '/cart.html',
            )
            
            # Redirect to Stripe Checkout
            return redirect(checkout_session.url, code=303)
    except Exception as e:
        if request.is_json:
            return jsonify({'error': str(e)}), 500
        else:
            return str(e), 500

@app.route('/success')
def success():
    return render_template('success.html')

@app.route('/cancel')
def cancel():
    return render_template('cancel.html')

# Serve static HTML files
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(debug=True)
