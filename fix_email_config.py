#!/usr/bin/env python3
"""
Fix email configuration by testing different SMTP servers for Network Solutions
"""
import os
import socket
from flask import Flask
from flask_mail import Mail, Message
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

def test_smtp_server(server, port, use_ssl=True, use_tls=False):
    """Test if an SMTP server is reachable"""
    try:
        print(f"Testing {server}:{port} (SSL: {use_ssl}, TLS: {use_tls})")
        
        # Test basic connectivity first
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(10)
        result = sock.connect_ex((server, port))
        sock.close()
        
        if result == 0:
            print(f"✅ {server}:{port} is reachable")
            return True
        else:
            print(f"❌ {server}:{port} is not reachable (error: {result})")
            return False
            
    except Exception as e:
        print(f"❌ {server}:{port} failed: {str(e)}")
        return False

def test_email_with_server(server, port, use_ssl=True, use_tls=False):
    """Test sending email with specific server configuration"""
    app.config['MAIL_SERVER'] = server
    app.config['MAIL_PORT'] = port
    app.config['MAIL_USE_TLS'] = use_tls
    app.config['MAIL_USE_SSL'] = use_ssl
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'contact@lelabubu.ca')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'contact@lelabubu.ca')
    
    mail = Mail(app)
    
    try:
        with app.app_context():
            msg = Message(
                subject="🧪 Email Test - SMTP Configuration Fix",
                sender=app.config['MAIL_DEFAULT_SENDER'],
                recipients=['contact@lelabubu.ca']
            )
            
            msg.body = f"""This is a test email using the corrected SMTP configuration.

Server: {server}
Port: {port}
SSL: {use_ssl}
TLS: {use_tls}

If you receive this email, the SMTP settings are now working correctly!
"""
            
            mail.send(msg)
            print(f"✅ Email sent successfully using {server}:{port}")
            return True
            
    except Exception as e:
        print(f"❌ Failed to send email using {server}:{port}: {str(e)}")
        return False

def main():
    print("🔍 Diagnosing email configuration issues...")
    print("=" * 50)
    
    # Common Network Solutions SMTP servers to test
    smtp_servers = [
        ('mail.networksolutions.com', 465, True, False),  # SSL
        ('mail.networksolutions.com', 587, False, True),  # TLS
        ('mail.networksolutions.com', 25, False, False),  # Plain
        ('smtp.networksolutions.com', 465, True, False),  # SSL (original)
        ('smtp.networksolutions.com', 587, False, True),  # TLS
        ('outgoing.networksolutions.com', 465, True, False),  # SSL
        ('outgoing.networksolutions.com', 587, False, True),  # TLS
    ]
    
    working_configs = []
    
    print("Testing SMTP server connectivity...")
    for server, port, use_ssl, use_tls in smtp_servers:
        if test_smtp_server(server, port):
            working_configs.append((server, port, use_ssl, use_tls))
    
    print(f"\n📋 Found {len(working_configs)} reachable SMTP configurations")
    
    if not working_configs:
        print("❌ No SMTP servers are reachable. This might be a network/firewall issue.")
        print("\n🔧 Recommended fixes:")
        print("1. Check if your hosting provider blocks outgoing SMTP connections")
        print("2. Contact Network Solutions support for correct SMTP settings")
        print("3. Consider using a different email service (Gmail, SendGrid, etc.)")
        return
    
    print("\n📧 Testing email sending with working configurations...")
    for server, port, use_ssl, use_tls in working_configs:
        if test_email_with_server(server, port, use_ssl, use_tls):
            print(f"\n🎉 SUCCESS! Working configuration found:")
            print(f"MAIL_SERVER={server}")
            print(f"MAIL_PORT={port}")
            print(f"MAIL_USE_SSL={use_ssl}")
            print(f"MAIL_USE_TLS={use_tls}")
            print("\nUpdate your .env file with these settings!")
            return
    
    print("\n❌ None of the reachable SMTP servers accepted the email credentials.")
    print("This suggests an authentication issue. Please verify:")
    print("1. Email username and password are correct")
    print("2. The email account is properly configured with Network Solutions")
    print("3. Two-factor authentication is not blocking the connection")

if __name__ == '__main__':
    main()
