/**
 * Email Templates for E-commerce Notifications
 */

const orderConfirmationTemplate = (order, user) => {
    const productsList = order.products.map(p => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${p.product?.name || 'Product'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${p.count}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${p.price}</td>
    </tr>
  `).join('');

    const total = order.products.reduce((acc, p) => acc + (p.price * p.count), 0);

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Confirmed! 🎉</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
          <p style="color: #666;">Thank you for your order! We're excited to let you know that your order has been received and is being processed.</p>
          
          <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #666;"><strong>Order ID:</strong> ${order._id}</p>
            <p style="margin: 10px 0 0; color: #666;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          
          <h3 style="color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">Order Details</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${productsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; color: #6366f1; font-size: 18px;">$${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #6366f1;">
            <p style="margin: 0; color: #333;"><strong>What's Next?</strong></p>
            <p style="margin: 10px 0 0; color: #666;">We'll send you another email when your order ships. You can track your order status in your dashboard.</p>
          </div>
        </div>
        
        <div style="background: #1e293b; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; margin: 0; font-size: 14px;">Thank you for shopping with us!</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const orderStatusUpdateTemplate = (order, user, newStatus) => {
    const statusColors = {
        'Not Processed': '#6b7280',
        'Processing': '#f59e0b',
        'Shipped': '#3b82f6',
        'Delivered': '#10b981',
        'Cancelled': '#ef4444'
    };

    const statusEmojis = {
        'Not Processed': '📋',
        'Processing': '⚙️',
        'Shipped': '🚚',
        'Delivered': '✅',
        'Cancelled': '❌'
    };

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Status Update</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <div style="background: linear-gradient(135deg, ${statusColors[newStatus] || '#6366f1'} 0%, #334155 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">${statusEmojis[newStatus] || '📦'} Order Update</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
          <p style="color: #666;">Your order status has been updated.</p>
          
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 14px;">Order #${order._id}</p>
            <p style="margin: 15px 0 0; font-size: 24px; font-weight: bold; color: ${statusColors[newStatus] || '#333'};">
              ${newStatus}
            </p>
          </div>
          
          ${newStatus === 'Shipped' ? `
            <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border-radius: 8px;">
              <p style="margin: 0; color: #1e40af;"><strong>🚚 Your order is on its way!</strong></p>
              <p style="margin: 10px 0 0; color: #3b82f6;">You should receive it within 3-5 business days.</p>
            </div>
          ` : ''}
          
          ${newStatus === 'Delivered' ? `
            <div style="margin-top: 20px; padding: 15px; background: #ecfdf5; border-radius: 8px;">
              <p style="margin: 0; color: #065f46;"><strong>✅ Your order has been delivered!</strong></p>
              <p style="margin: 10px 0 0; color: #10b981;">We hope you enjoy your purchase. Please leave a review!</p>
            </div>
          ` : ''}
          
          <p style="margin-top: 30px; color: #666;">You can view your order details in your dashboard anytime.</p>
        </div>
        
        <div style="background: #1e293b; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; margin: 0; font-size: 14px;">Thank you for shopping with us!</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { orderConfirmationTemplate, orderStatusUpdateTemplate };
