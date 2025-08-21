from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import stripe
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__, static_folder='.')
app.secret_key = os.getenv('SECRET_KEY', 'a_super_secret_key')
CORS(app, origins=['https://lelabubu.ca', 'http://localhost:5000'], supports_credentials=True)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Mail Configuration for Network Solutions
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.networksolutions.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 465))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'false').lower() in ['true', '1', 't']
app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'true').lower() in ['true', '1', 't']
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'contact@lelabubu.ca')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'contact@lelabubu.ca')

mail = Mail(app)

# Database Configuration
if os.getenv('DATABASE_URL'):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL').replace("://", "ql://", 1)
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lelabubu.db'

db = SQLAlchemy(app)

# Database Models
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(80), nullable=False)
    content = db.Column(db.Text, nullable=False)

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# Debug: Print Stripe key info (first few characters only for security)
stripe_key = os.getenv('STRIPE_SECRET_KEY', 'NOT_SET')
if stripe_key != 'NOT_SET':
    key_prefix = stripe_key[:7] if len(stripe_key) > 7 else stripe_key
    print(f"Stripe key configured: {key_prefix}...")
    if stripe_key.startswith('sk_test_'):
        print("WARNING: Using TEST Stripe key in production!")
    elif stripe_key.startswith('sk_live_'):
        print("Using LIVE Stripe key - correct for production")
    else:
        print("WARNING: Stripe key format not recognized!")
else:
    print("ERROR: STRIPE_SECRET_KEY environment variable not set!")

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

@app.route('/debug-stripe-config')
def debug_stripe_config():
    """Debug endpoint to check Stripe configuration"""
    stripe_key = os.getenv('STRIPE_SECRET_KEY', 'NOT_SET')
    
    if stripe_key == 'NOT_SET':
        return jsonify({
            'error': 'STRIPE_SECRET_KEY not set',
            'status': 'error'
        })
    
    # Only show first 7 characters for security
    key_preview = stripe_key[:7] if len(stripe_key) > 7 else stripe_key
    
    if stripe_key.startswith('sk_test_'):
        mode = 'TEST'
        status = 'error'
        message = 'Backend is using TEST key - this will cause session mismatch!'
    elif stripe_key.startswith('sk_live_'):
        mode = 'LIVE'
        status = 'success'
        message = 'Backend is correctly using LIVE key'
    else:
        mode = 'UNKNOWN'
        status = 'error'
        message = 'Unrecognized key format'
    
    return jsonify({
        'key_preview': key_preview,
        'mode': mode,
        'status': status,
        'message': message,
        'frontend_key': 'pk_live_51RerovGA2nd66MJc... (LIVE MODE)'
    })

@app.route('/calculate-shipping', methods=['POST'])
def calculate_shipping():
    """Calculate shipping cost based on address"""
    try:
        data = request.json
        address = data.get('address', {})
        
        city = address.get('city', '').lower()
        state = address.get('state', '').lower()
        country = address.get('country', '').lower()
        
        # Calculate shipping cost
        shipping_cost = 0
        delivery_days = "2-3 weeks"
        
        # Check if it's Montreal (free shipping)
        if city in ['montreal', 'montréal'] and country in ['canada', 'ca']:
            shipping_cost = 0
            delivery_days = "1-2 weeks"
        # Check if it's elsewhere in Canada ($25 shipping)
        elif country in ['canada', 'ca']:
            shipping_cost = 2500  # $25.00 in cents
            delivery_days = "1-2 weeks"
        # International shipping ($40)
        else:
            shipping_cost = 4000  # $40.00 in cents
            delivery_days = "2-3 weeks"
        
        return jsonify({
            'shipping_cost': shipping_cost,
            'shipping_cost_display': f"${shipping_cost / 100:.2f}",
            'delivery_estimate': delivery_days,
            'free_shipping': shipping_cost == 0
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        # Check if the request is a form submission or JSON
        if request.is_json:
            # Handle JSON request from new modern checkout system
            data = request.json
            cart_items = data.get('items', [])
            customer_info = data.get('customer', {})
            delivery_fee = data.get('deliveryFee', 0)
            
            if not cart_items:
                return jsonify({'error': 'No items in cart'}), 400
            
            # Create metadata with order details
            user_id = session.get('user_id')
            customer_address = customer_info.get('address', {})
            
            metadata = {
                'user_id': user_id,
                'items': ', '.join([f"{item['name']} x {item['quantity']}" for item in cart_items]),
                'customer_name': f"{customer_info.get('firstName', '')} {customer_info.get('lastName', '')}".strip(),
                'customer_email': customer_info.get('email', ''),
                'delivery_fee': str(delivery_fee),
                'shipping_city': customer_address.get('city', ''),
                'shipping_country': customer_address.get('country', '')
            }
            
            # Create line items for Stripe Checkout
            line_items = []
            for item in cart_items:
                line_items.append({
                    'price_data': {
                        'currency': 'cad',
                        'product_data': {
                            'name': item['name'],
                            'images': [item['image']] if item.get('image') else [],
                        },
                        'unit_amount': int(float(item['price']) * 100),  # Convert to cents
                    },
                    'quantity': item['quantity'],
                })
            
            # Add delivery fee as a separate line item if applicable
            if delivery_fee > 0:
                # Determine delivery type based on fee
                if delivery_fee == 25:
                    delivery_name = "Canada Delivery (1-2 weeks)"
                elif delivery_fee == 40:
                    delivery_name = "International Delivery (2-3 weeks)"
                else:
                    delivery_name = f"Delivery Fee"
                
                line_items.append({
                    'price_data': {
                        'currency': 'cad',
                        'product_data': {
                            'name': delivery_name,
                        },
                        'unit_amount': int(delivery_fee * 100),  # Convert to cents
                    },
                    'quantity': 1,
                })
            
            # Pre-fill customer information if provided
            customer_data = {}
            if customer_info.get('email'):
                customer_data['customer_email'] = customer_info['email']
            
            # Pre-fill shipping address if provided
            shipping_address_collection = {
                'allowed_countries': ['CA', 'US', 'GB', 'FR', 'DE', 'AU', 'JP', 'CN']
            }
            
            # Create Stripe checkout session
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url=YOUR_DOMAIN + '/success.html?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=YOUR_DOMAIN + '/cart.html',
                metadata=metadata,
                client_reference_id=user_id,
                shipping_address_collection=shipping_address_collection,
                automatic_tax={'enabled': False},
                **customer_data
            )
            
            # Return the session ID to the client
            return jsonify({'id': checkout_session.id})
        else:
            # Only accept JSON requests for the modern checkout system
            return jsonify({'error': 'This endpoint only accepts JSON requests from the modern checkout system'}), 400
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

@app.route('/stripe-webhook', methods=['POST'])
def stripe_webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = os.getenv('STRIPE_ENDPOINT_SECRET')
    
    print(f"Webhook received - Signature: {sig_header[:20] if sig_header else 'None'}...")
    print(f"Endpoint secret configured: {'Yes' if endpoint_secret else 'No'}")

    # If no endpoint secret is configured, log the webhook but don't verify signature
    if not endpoint_secret:
        print("WARNING: STRIPE_ENDPOINT_SECRET not configured - webhook signature verification disabled")
        try:
            event = stripe.Event.construct_from(request.json, stripe.api_key)
        except Exception as e:
            print(f"Failed to parse webhook payload: {str(e)}")
            return 'Invalid payload', 400
    else:
        # Verify webhook signature
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            print(f"Invalid payload: {str(e)}")
            return 'Invalid payload', 400
        except stripe.error.SignatureVerificationError as e:
            print(f"Invalid signature: {str(e)}")
            return 'Invalid signature', 400

    print(f"Processing webhook event: {event['type']}")

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session_data = event['data']['object']
        session_id = session_data['id']
        
        print(f"Processing completed checkout session: {session_id}")
        
        # Send order notification email to store owner
        try:
            # Get detailed session information
            customer_email = session_data.get('customer_details', {}).get('email', 'Not provided')
            customer_name = session_data.get('customer_details', {}).get('name', 'Not provided')
            amount_total = session_data.get('amount_total', 0) / 100  # Convert from cents
            currency = session_data.get('currency', 'CAD').upper()
            
            # Get shipping information
            shipping = session_data.get('shipping', {})
            shipping_name = shipping.get('name', 'Not provided') if shipping else 'Not provided'
            shipping_address = shipping.get('address', {}) if shipping else {}
            
            # Format shipping address
            address_lines = []
            if shipping_address.get('line1'):
                address_lines.append(shipping_address['line1'])
            if shipping_address.get('line2'):
                address_lines.append(shipping_address['line2'])
            if shipping_address.get('city'):
                address_lines.append(shipping_address['city'])
            if shipping_address.get('state'):
                address_lines.append(shipping_address['state'])
            if shipping_address.get('postal_code'):
                address_lines.append(shipping_address['postal_code'])
            if shipping_address.get('country'):
                address_lines.append(shipping_address['country'])
            
            formatted_address = '\n'.join(address_lines) if address_lines else 'Not provided'
            
            # Get line items (products purchased)
            line_items = stripe.checkout.Session.list_line_items(session_id, limit=100)
            items_list = []
            for item in line_items.data:
                item_name = item.get('description', 'Unknown Item')
                quantity = item.get('quantity', 1)
                price = item.get('amount_total', 0) / 100
                items_list.append(f"• {item_name} x {quantity} - ${price:.2f} {currency}")
            
            items_text = '\n'.join(items_list) if items_list else 'No items found'
            
            # Format creation date
            import datetime
            created_timestamp = session_data.get('created', 0)
            created_date = datetime.datetime.fromtimestamp(created_timestamp).strftime('%Y-%m-%d %H:%M:%S') if created_timestamp else 'Unknown'
            
            # Check if email is configured
            mail_password = os.getenv('MAIL_PASSWORD')
            if not mail_password:
                print("WARNING: MAIL_PASSWORD not configured - cannot send order notification email")
                print(f"Order details would have been emailed: {session_id} - ${amount_total:.2f} {currency}")
                return 'Success (email not configured)', 200
            
            # Create order notification email
            msg = Message(
                subject=f"🎉 New Order #{session_id[:8]} - ${amount_total:.2f} {currency}",
                sender=app.config['MAIL_DEFAULT_SENDER'],
                recipients=['contact@lelabubu.ca']
            )
            
            msg.body = f"""🎉 NEW ORDER RECEIVED - LeLabubu.ca

ORDER DETAILS:
Order ID: {session_id}
Amount: ${amount_total:.2f} {currency}
Date: {created_date}

CUSTOMER INFORMATION:
Name: {customer_name}
Email: {customer_email}

SHIPPING INFORMATION:
Ship to: {shipping_name}
Address:
{formatted_address}

ITEMS ORDERED:
{items_text}

PAYMENT STATUS: ✅ PAID

---
Login to your Stripe dashboard for full order details:
https://dashboard.stripe.com/payments/{session_id}

This notification was sent automatically from LeLabubu.ca
"""
            
            mail.send(msg)
            print(f"✅ Order notification email sent successfully for order {session_id}")
            
        except Exception as e:
            print(f"❌ Failed to send order notification email: {str(e)}")
            print(f"Email config - Server: {app.config.get('MAIL_SERVER')}, Port: {app.config.get('MAIL_PORT')}")
            print(f"Email config - Username: {app.config.get('MAIL_USERNAME')}, SSL: {app.config.get('MAIL_USE_SSL')}")
            # Don't fail the webhook if email fails - Stripe needs a 200 response
        
        # Log order completion
        print(f"✅ Order {session_id} processed successfully - ${amount_total:.2f} {currency}")

    else:
        print(f"Unhandled webhook event type: {event['type']}")

    return 'Success', 200

# API Routes

@app.route('/api/comments', methods=['GET'])
def get_comments():
    comments = Comment.query.order_by(Comment.id.desc()).all()
    return jsonify([{'id': c.id, 'author': c.author, 'content': c.content} for c in comments])

@app.route('/api/comments', methods=['POST'])
def post_comment():
    data = request.get_json()
    author = data.get('author')
    content = data.get('content')

    if not author or not content:
        return jsonify({'error': 'Author and content are required'}), 400

    new_comment = Comment(author=author, content=content)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({'message': 'Comment posted successfully', 'comment': {'id': new_comment.id, 'author': new_comment.author, 'content': new_comment.content}}), 201

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    if not name or not email or not subject or not message:
        return jsonify({'error': 'All fields are required'}), 400

    # Create and send email
    try:
        msg = Message(
            subject=f"Contact Form: {subject}",
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=['contact@lelabubu.ca']
        )
        msg.body = f"""
New contact form submission from LeLabubu.ca:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}

---
This message was sent from the contact form on LeLabubu.ca
        """
        
        mail.send(msg)
        print(f"Contact form email sent successfully from {name} ({email})")
        return jsonify({'message': 'Thank you for your message! We will get back to you soon.'}), 200
        
    except Exception as e:
        error_msg = str(e)
        print(f"Failed to send contact form email: {error_msg}")
        # Return the actual error so we can debug
        return jsonify({'error': f'Email sending failed: {error_msg}'}), 500

# Serve static HTML files
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.cli.command("init-db")
def init_db():
    """Initialize the database."""
    db.create_all()
    print("Initialized the database.")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

# Updated: 2025-01-08 - Enhanced checkout system deployed
