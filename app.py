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
            
            # Add shipping cost based on location
            shipping_cost = 0
            if customer_info and customer_info.get('address', {}):
                city = customer_info.get('address', {}).get('city', '').lower()
                country = customer_info.get('address', {}).get('country', '').lower()
                
                # Free shipping in Montreal
                if city in ['montreal', 'montréal']:
                    shipping_cost = 0
                # $25 shipping elsewhere in Canada
                elif country in ['canada', 'ca']:
                    shipping_cost = 2500  # $25.00 in cents
                # $40 shipping outside Canada
                else:
                    shipping_cost = 4000  # $40.00 in cents
            
            amount += shipping_cost
            
            # Create a description of the purchase
            description = f"Purchase from LeLabubu.ca - {len(cart_items)} item(s)"
            
            # Create metadata with order details
            user_id = session.get('user_id')
            metadata = {
                'user_id': user_id,
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
                    success_url=YOUR_DOMAIN + '/success.html?session_id={CHECKOUT_SESSION_ID}',
                    cancel_url=YOUR_DOMAIN + '/cart.html',
                    metadata=metadata,
                    client_reference_id=user_id
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

@app.route('/stripe-webhook', methods=['POST'])
def stripe_webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = os.getenv('STRIPE_ENDPOINT_SECRET')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return 'Invalid signature', 400

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session_data = event['data']['object']
        
        # Send order notification email to store owner
        try:
            # Get detailed session information
            session_id = session_data['id']
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
            
            # Create order notification email
            msg = Message(
                subject=f"New Order #{session_id[:8]} - ${amount_total:.2f} {currency}",
                sender=app.config['MAIL_DEFAULT_SENDER'],
                recipients=['contact@lelabubu.ca']
            )
            
            msg.body = f"""
🎉 NEW ORDER RECEIVED - LeLabubu.ca

ORDER DETAILS:
Order ID: {session_id}
Amount: ${amount_total:.2f} {currency}
Date: {session_data.get('created', 'Unknown')}

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
            print(f"Order notification email sent for order {session_id}")
            
        except Exception as e:
            print(f"Failed to send order notification email: {str(e)}")
            # Don't fail the webhook if email fails
        
        # Original database logging code
        user_id = session_data.get('client_reference_id')
        if user_id:
            line_items = stripe.checkout.Session.list_line_items(session_id, limit=100)
            for item in line_items.data:
                product_name = item.description
                # Note: Product and Purchase models don't exist in current code
                # This section would need proper model definitions to work
                print(f"Order logged: {product_name} for user {user_id}")

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
