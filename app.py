from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import stripe
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__, static_folder='.')
app.secret_key = os.getenv('SECRET_KEY', 'a_super_secret_key')
CORS(app, origins=['https://lelabubu.ca', 'http://localhost:5000'], supports_credentials=True)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Database Configuration
if os.getenv('DATABASE_URL'):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL').replace("://", "ql://", 1)
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lelabubu.db'

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    purchases = db.relationship('Purchase', backref='user', lazy=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    purchases = db.relationship('Purchase', backref='product', lazy=True)
    comments = db.relationship('Comment', backref='product', lazy=True)

class Purchase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    stripe_session_id = db.Column(db.String(255), nullable=False)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    user = db.relationship('User')

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
        session = event['data']['object']
        user_id = session.get('client_reference_id')
        if user_id:
            line_items = stripe.checkout.Session.list_line_items(session.id, limit=100)
            for item in line_items.data:
                product_name = item.description
                product = Product.query.filter_by(name=product_name).first()
                if not product:
                    product = Product(name=product_name)
                    db.session.add(product)
                    db.session.commit()
                
                purchase = Purchase(
                    user_id=user_id,
                    product_id=product.id,
                    stripe_session_id=session.id
                )
                db.session.add(purchase)
            db.session.commit()

    return 'Success', 200

# API Routes

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'error': 'User already exists'}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        session['user_id'] = user.id
        return jsonify({'message': 'Logged in successfully', 'user': {'id': user.id, 'username': user.username}})
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'})

@app.route('/api/session')
def get_session():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify({'user': {'id': user.id, 'username': user.username}})
    return jsonify({'user': None})

@app.route('/api/products/<int:product_id>/comments', methods=['GET'])
def get_comments(product_id):
    comments = Comment.query.filter_by(product_id=product_id).all()
    return jsonify([{'id': c.id, 'content': c.content, 'user': c.user.username} for c in comments])

@app.route('/api/products/<int:product_id>/comments', methods=['POST'])
def post_comment(product_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    user_id = session['user_id']
    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({'error': 'Comment content is required'}), 400

    # Verify purchase
    purchase = Purchase.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not purchase:
        return jsonify({'error': 'You must purchase this product to leave a comment'}), 403

    new_comment = Comment(content=content, user_id=user_id, product_id=product_id)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({'message': 'Comment posted successfully', 'comment': {'id': new_comment.id, 'content': new_comment.content, 'user': new_comment.user.username}}), 201

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
