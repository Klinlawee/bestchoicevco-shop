import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Helper function to get the correct API key based on environment
function getResendApiKey() {
  // In production
  if (process.env.VERCEL_ENV === 'production') {
    return process.env.RESEND_API_KEY_production
  }
  // In preview (deployment previews)
  else if (process.env.VERCEL_ENV === 'preview') {
    return process.env.RESEND_API_KEY_preview
  }
  // In development (local)
  else {
    return process.env.RESEND_API_KEY_development
  }
}

export async function POST(request: Request) {
  try {
    const { orderDetails, customerEmail, customerName, orderTotal, reference } = await request.json()
    
    const apiKey = getResendApiKey()
    if (!apiKey) {
      console.error('Resend API key not found')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const resend = new Resend(apiKey)

    // Send email to customer
    await resend.emails.send({
      from: 'BestChoiceVCO <onboarding@resend.dev>',
      to: customerEmail,
      subject: `Order Confirmation #${reference}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2c6e49; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">BestChoiceVCO</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #2c6e49;">Thank You for Your Order!</h2>
            <p>Hi ${customerName},</p>
            <p>We've received your order and will process it shortly.</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Summary</h3>
              <p><strong>Order Reference:</strong> ${reference}</p>
              <p><strong>Total Amount:</strong> GHS ${orderTotal}</p>
            </div>
            
            <h3>Order Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.map((item: any) => `
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px;">${item.name}</td>
                    <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: right;">GHS ${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; color: #2c6e49;">GHS ${orderTotal}</td>
                </tr>
              </tfoot>
            </table>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #e6f3ed; border-radius: 8px;">
              <h4 style="margin-top: 0;">Delivery Information</h4>
              <p><strong>Address:</strong> ${orderDetails[0]?.address || 'To be confirmed'}</p>
              <p><strong>Phone:</strong> ${orderDetails[0]?.phone || 'To be confirmed'}</p>
              <p style="font-size: 14px; color: #4b5563;">Our delivery team will contact you shortly with the exact delivery fee.</p>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280; text-align: center;">
              If you have any questions, please contact us at support@bestchoicevco.com
            </p>
          </div>
          
          <div style="background-color: #1f2937; padding: 15px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>© ${new Date().getFullYear()} BestChoice Virgin Coconut Oil. All rights reserved.</p>
          </div>
        </div>
      `
    })

    // Also send notification to store owner
    await resend.emails.send({
      from: 'BestChoiceVCO <onboarding@resend.dev>',
      to: 'godsonmorri@gmail.com',
      subject: `New Order Received: ${reference}`,
      html: `
        <h2>New Order Alert!</h2>
        <p>A new order has been placed:</p>
        <p><strong>Order Reference:</strong> ${reference}</p>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Total:</strong> GHS ${orderTotal}</p>
        <p><strong>Items:</strong> ${orderDetails.length} products</p>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
