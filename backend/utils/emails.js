const resetPasswordEmailMessage = (resetUrl) => {
	return		`
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f9fafb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #111827; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">Streak Engine</h1>
          <p style="color: #0d9488; font-size: 14px; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Security Alert</p>
        </div>

        <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin-top: 0; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Hello from Streak Engine! We received a request to reset the password for the account associated with this email address. If you made this request, please click the button below to securely set a new password.
          </p>

          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${resetUrl}" clicktracking=off style="display: inline-block; background-color: #0d9488; color: #ffffff; padding: 14px 28px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(13, 148, 136, 0.25); text-align: center;">
              Reset My Password
            </a>
          </div>

          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
            <p style="color: #b91c1c; font-size: 14px; margin: 0; line-height: 1.5;">
              <strong>Didn't request this?</strong> If you didn't ask to reset your password, you can safely ignore this email. Your password won't change until you create a new one using the link above.
            </p>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">For security, this link will expire in 10 minutes.</p>
          <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
            If you're having trouble clicking the button, copy and paste the following URL into your web browser:<br>
            <a href="${resetUrl}" style="color: #0d9488; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">Stay Unbroken. &copy; ${new Date().getFullYear()} Streak Engine</p>
        </div>
      </div>
    `;

}

module.exports = { resetPasswordEmailMessage };