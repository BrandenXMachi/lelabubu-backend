#!/usr/bin/env python3
"""
Test script to verify email configuration works
"""
import os
from flask import Flask
from flask_mail import Mail, Message
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Mail Configuration for Network Solutions
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.networksolutions.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 465))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'false').lower() in ['true', '1', 't']
app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'true').lower() in ['true', '1', 't']
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'contact@lelabubu.ca')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'contact@lelabubu.ca')

mail = Mail(app)

def test_email():
    """Test sending an email"""
    print("Testing email configuration...")
    print(f"Mail Server: {app.config['MAIL_SERVER']}")
    print(f"Mail Port: {app.config['MAIL_PORT']}")
    print(f"Mail Username: {app.config['MAIL_USERNAME']}")
    print(f"Mail Password Set: {'Yes' if app.config['MAIL_PASSWORD'] else 'No'}")
    print(f"Use SSL: {app.config['MAIL_USE_SSL']}")
    print(f"Use TLS: {app.config['MAIL_USE_TLS']}")
    
    try:
        with app.app_context():
            msg = Message(
                subject="🧪 Email Test - LeLabubu.ca",
                sender=app.config['MAIL_DEFAULT_SENDER'],
                recipients=['contact@lelabubu.ca']
            )
            
            msg.body = """This is a test email to verify the email configuration is working.

If you receive this email, the SMTP settings are correct and emails should be sent for new orders.

Test Details:
- Server: smtp.networksolutions.com
- Port: 465
- SSL: Enabled
- Username: contact@lelabubu.ca

This test was run to troubleshoot the order notification system.
"""
            
            mail.send(msg)
            print("✅ Test email sent successfully!")
            print("Check your inbox at contact@lelabubu.ca")
            return True
            
    except Exception as e:
        print(f"❌ Failed to send test email: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        return False

if __name__ == '__main__':
    success = test_email()
    if success:
        print("\n✅ Email configuration is working correctly!")
        print("The issue might be with webhook delivery or webhook processing.")
    else:
        print("\n❌ Email configuration has issues that need to be fixed.")
