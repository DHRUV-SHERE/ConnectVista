# 📧 ConnectVista EmailJS Templates

When creating these templates in EmailJS, follow the **"Choose Type"** recommendation for each.

---

## 1. New Booking Notification (To Provider)
**Recommended EmailJS Type:** `Order Confirmation`  
**Template ID:** `template_u6u3u3g`  
**Subject:** 🆕 New Booking Request: {{service_type}}

```html
<div style="font-family: system-ui, sans-serif; font-size: 14px; color: #333; padding: 20px 14px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <div style="text-align: center; background-color: #0EA5E9; padding: 20px">
      <h2 style="color: #ffffff; margin: 0; font-size: 24px;">ConnectVista</h2>
    </div>
    <div style="padding: 30px">
      <h1 style="font-size: 22px; margin-bottom: 20px; color: #111;">Hello {{provider_name}},</h1>
      <p style="line-height: 1.6;">
        Great news! You have received a new booking request from <strong>{{seeker_name}}</strong>.
      </p>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
        <p style="margin: 5px 0;"><strong>Service:</strong> {{service_type}}</p>
        <p style="margin: 5px 0;"><strong>Date:</strong> {{booking_date}}</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> {{booking_time}}</p>
      </div>
      <p style="line-height: 1.6;">
        Please log in to your dashboard to accept or manage this booking.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{view_booking_link}}" 
           style="background-color: #0EA5E9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
           View Booking Request
        </a>
      </div>
      <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        Best regards,<br /><strong>ConnectVista Team</strong>
      </p>
    </div>
  </div>
</div>
```

---

## 2. Booking Status Update (To Seeker)
**Recommended EmailJS Type:** `Order Confirmation` OR `Feedback Request`  
**Template ID:** `template_status_update` (Update this ID in emailService.js)  
**Subject:** Update on your booking: {{status}}

```html
<div style="font-family: system-ui, sans-serif; font-size: 14px; color: #333; padding: 20px 14px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <div style="text-align: center; background-color: #0EA5E9; padding: 20px">
      <h2 style="color: #ffffff; margin: 0; font-size: 24px;">ConnectVista</h2>
    </div>
    <div style="padding: 30px">
      <h1 style="font-size: 22px; margin-bottom: 20px; color: #111;">Hello {{seeker_name}},</h1>
      <p style="line-height: 1.6;">
        The status of your booking with <strong>{{provider_name}}</strong> has been updated to:
      </p>
      <div style="text-align: center; margin: 25px 0;">
        <span style="font-size: 20px; font-weight: bold; color: #0EA5E9; text-transform: uppercase; letter-spacing: 1px;">
          {{status}}
        </span>
      </div>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
        <p style="margin: 5px 0;"><strong>Booking Date:</strong> {{booking_date}}</p>
        <p style="margin: 5px 0;"><strong>Booking Time:</strong> {{booking_time}}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{view_booking_link}}" 
           style="background-color: #0EA5E9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
           View Booking Details
        </a>
      </div>
      <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        If you have any questions, you can chat with the provider directly through our app.
      </p>
      <p style="margin-top: 10px;">Best regards,<br /><strong>ConnectVista Team</strong></p>
    </div>
  </div>
</div>
```

---

## 3. Welcome Email (To New Users)
**Recommended EmailJS Type:** `Welcome`  
**Template ID:** `template_welcome`  
**Subject:** Welcome to ConnectVista! 🚀

```html
<div style="font-family: system-ui, sans-serif; font-size: 14px; color: #333; padding: 20px 14px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <div style="text-align: center; background-color: #0EA5E9; padding: 20px">
      <h2 style="color: #ffffff; margin: 0; font-size: 24px;">ConnectVista</h2>
    </div>
    <div style="padding: 30px">
      <h1 style="font-size: 22px; margin-bottom: 20px; color: #111;">Welcome to the family, {{user_name}}!</h1>
      <p style="line-height: 1.6;">
        We're thrilled to have you join <strong>ConnectVista</strong>. Our mission is to connect you with the best service professionals in your area seamlessly.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{login_link}}" 
           style="background-color: #0EA5E9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
           Explore Services Now
        </a>
      </div>
      <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        Happy connecting!<br /><strong>The ConnectVista Team</strong>
      </p>
    </div>
  </div>
</div>
```

---

## 💡 How to set up in EmailJS:
1.  Go to **Email Templates** -> **Create New Template**.
2.  Choose the **Recommended Type** from the list above.
3.  Click the **"Edit Content"** button (usually looks like code `< >` or a pencil).
4.  Delete all existing text and **Paste the HTML code** provided above.
5.  Save and make sure the **Template ID** matches what is in `emailService.js`.
