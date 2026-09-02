import os
import smtplib
import socket

from dotenv import load_dotenv
from pathlib import Path
from email.message import EmailMessage


BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)


EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_reset_email(receiver_email: str, reset_link: str):

    if not EMAIL_ADDRESS:
        raise Exception("EMAIL_ADDRESS is missing from environment variables")

    if not EMAIL_PASSWORD:
        raise Exception("EMAIL_PASSWORD is missing from environment variables")

    msg = EmailMessage()

    msg["Subject"] = "CareerPilot AI - Reset Your Password"
    msg["From"] = f"CareerPilot AI <{EMAIL_ADDRESS}>"
    msg["To"] = receiver_email

    msg.set_content(
        f"""
Hello,

We received a request to reset your CareerPilot AI password.

Open the link below to reset your password:

{reset_link}

This link is valid for 15 minutes.

If you did not request a password reset, please ignore this email.

Regards,
CareerPilot AI Team
"""
    )

    msg.add_alternative(
        f"""
        <html>
            <body>
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                ">

                    <h1 style="color: #6C63FF;">
                        CareerPilot AI
                    </h1>

                    <h2>Reset Your Password</h2>

                    <p>Hello,</p>

                    <p>
                        We received a request to reset your CareerPilot AI password.
                    </p>

                    <p>
                        Click the button below to reset your password:
                    </p>

                    <p style="margin: 30px 0;">
                        <a href="{reset_link}"
                           style="
                                display: inline-block;
                                padding: 14px 24px;
                                background-color: #6C63FF;
                                color: white;
                                text-decoration: none;
                                border-radius: 8px;
                                font-weight: bold;
                           ">
                            Reset Password
                        </a>
                    </p>

                    <p>
                        This link is valid for <b>15 minutes</b>.
                    </p>

                    <p>
                        If you did not request this password reset,
                        please ignore this email.
                    </p>

                    <br>

                    <p>
                        Regards,<br>
                        <b>CareerPilot AI Team</b>
                    </p>

                </div>
            </body>
        </html>
        """,
        subtype="html"
    )

    try:

        # Get Gmail IPv4 address
        gmail_info = socket.getaddrinfo(
            "smtp.gmail.com",
            587,
            socket.AF_INET,
            socket.SOCK_STREAM
        )

        gmail_ip = gmail_info[0][4][0]


        with smtplib.SMTP(timeout=30) as server:

            server.connect(gmail_ip, 587)

            server.ehlo()

            server.starttls()

            server.ehlo()

            server.login(
                EMAIL_ADDRESS,
                EMAIL_PASSWORD
            )

            server.send_message(msg)

        print(
            "PASSWORD RESET EMAIL SENT SUCCESSFULLY TO:",
            receiver_email
        )

        return True

    except Exception as e:

        print(
            "GMAIL EMAIL ERROR:",
            str(e)
        )

        raise