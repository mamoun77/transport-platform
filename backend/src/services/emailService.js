const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function bookingEmailTemplate(booking) {
  const { bookingNumber, serviceName, pickup, destination, date, time, passengers, price, name, phone, email, flight_number, notes } = booking;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirmation de réservation</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a5f 0%,#0f172a 100%);padding:36px 40px;text-align:center;">
              <img src="https://trendytravel.ma/logo.png" alt="Trendy Travel" height="60" style="display:block;margin:0 auto 16px;" onerror="this.style.display='none'" />
              <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;letter-spacing:1px;">TRENDY TRAVEL</h1>
              <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Marrakech</p>
            </td>
          </tr>

          <!-- Success banner -->
          <tr>
            <td style="background:#10b981;padding:18px 40px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:16px;font-weight:600;">
                ✅ Réservation confirmée !
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#334155;font-size:16px;margin:0 0 8px;">Bonjour <strong>${name}</strong>,</p>
              <p style="color:#64748b;font-size:14px;margin:0 0 32px;line-height:1.6;">
                Votre réservation a bien été enregistrée. Voici le récapitulatif de votre commande.
              </p>

              <!-- Booking number -->
              <div style="background:#f8fafc;border:2px dashed #e2e8f0;border-radius:12px;padding:20px;text-align:center;margin-bottom:32px;">
                <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Numéro de réservation</p>
                <p style="margin:8px 0 0;color:#0f172a;font-size:24px;font-weight:800;letter-spacing:2px;">${bookingNumber}</p>
              </div>

              <!-- Details table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
                <tr style="background:#f8fafc;">
                  <td colspan="2" style="padding:14px 20px;font-size:13px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:1px;">Détails de la réservation</td>
                </tr>
                ${row('🚗 Service', serviceName)}
                ${row('📍 Départ', pickup)}
                ${row('🏁 Destination', destination)}
                ${row('📅 Date', date)}
                ${row('⏰ Heure', time)}
                ${row('👥 Passagers', passengers)}
                ${flight_number ? row('✈️ Vol', flight_number) : ''}
                ${notes ? row('📝 Remarques', notes) : ''}
                <tr style="background:#0f172a;">
                  <td style="padding:16px 20px;color:#94a3b8;font-size:13px;font-weight:600;">💰 Prix total</td>
                  <td style="padding:16px 20px;color:#10b981;font-size:20px;font-weight:800;text-align:right;">${price} MAD</td>
                </tr>
              </table>

              <!-- Info box -->
              <div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:8px;padding:16px 20px;margin-top:32px;">
                <p style="margin:0;color:#1e40af;font-size:13px;font-weight:600;">ℹ️ Prochaines étapes</p>
                <p style="margin:8px 0 0;color:#3b82f6;font-size:13px;line-height:1.6;">
                  Notre équipe vous contactera dans les plus brefs délais pour confirmer les détails et vous assigner un chauffeur.
                </p>
              </div>
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="background:#f8fafc;padding:32px 40px;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 16px;color:#0f172a;font-size:14px;font-weight:700;text-align:center;">Besoin d'aide ? Contactez-nous</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 8px;">
                    <a href="tel:+212662100714" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:13px;font-weight:600;">📞 +212 662 100 714</a>
                  </td>
                  <td align="center" style="padding:0 8px;">
                    <a href="https://wa.me/212662100714" style="display:inline-block;background:#25d366;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:13px;font-weight:600;">💬 WhatsApp</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#475569;font-size:12px;">© ${new Date().getFullYear()} Trendy Travel Marrakech — Tous droits réservés</p>
              <p style="margin:6px 0 0;color:#334155;font-size:12px;">contact@trendytravel.ma | +212 662 100 714</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function adminEmailTemplate(booking) {
  const { bookingNumber, serviceName, pickup, destination, date, time, passengers, price, name, phone, email, flight_number, notes } = booking;
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /><title>Nouvelle Réservation</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
        <tr>
          <td style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:24px 40px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;">🔔 Nouvelle Réservation!</h1>
            <p style="color:#fef3c7;margin:4px 0 0;font-size:13px;">${bookingNumber}</p>
          </td>
        </tr>
        <tr><td style="padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #334155;">
            ${adminRow('👤 Client', name)}
            ${adminRow('📞 Téléphone', phone)}
            ${email ? adminRow('📧 Email', email) : ''}
            ${adminRow('🚗 Service', serviceName)}
            ${adminRow('📍 Départ', pickup)}
            ${adminRow('🏁 Destination', destination)}
            ${adminRow('📅 Date', date)}
            ${adminRow('⏰ Heure', time)}
            ${adminRow('👥 Passagers', passengers)}
            ${flight_number ? adminRow('✈️ Vol', flight_number) : ''}
            ${notes ? adminRow('📝 Notes', notes) : ''}
            <tr style="background:#064e3b;">
              <td style="padding:14px 20px;color:#6ee7b7;font-size:13px;font-weight:600;">💰 Prix total</td>
              <td style="padding:14px 20px;color:#10b981;font-size:20px;font-weight:800;text-align:right;">$${price}</td>
            </tr>
          </table>
          <div style="background:#1e3a5f;border-radius:10px;padding:16px 20px;margin-top:24px;text-align:center;">
            <p style="margin:0;color:#93c5fd;font-size:13px;font-weight:600;">⚡ Action requise : Assigner un chauffeur</p>
          </div>
        </td></tr>
        <tr><td style="background:#0f172a;padding:20px 40px;text-align:center;">
          <p style="margin:0;color:#475569;font-size:12px;">© ${new Date().getFullYear()} Trendy Travel — Admin Panel</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function adminRow(label, value) {
  if (!value) return '';
  return `<tr style="border-top:1px solid #334155;">
    <td style="padding:11px 20px;color:#94a3b8;font-size:13px;width:40%;">${label}</td>
    <td style="padding:11px 20px;color:#e2e8f0;font-size:13px;font-weight:600;text-align:right;">${value}</td>
  </tr>`;
}

function row(label, value) {
  if (!value) return '';
  return `
    <tr style="border-top:1px solid #e2e8f0;">
      <td style="padding:12px 20px;color:#64748b;font-size:13px;width:40%;">${label}</td>
      <td style="padding:12px 20px;color:#0f172a;font-size:13px;font-weight:600;text-align:right;">${value}</td>
    </tr>`;
}

async function sendBookingConfirmation(booking) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('⚠️  Email non configuré — SMTP_USER/SMTP_PASS manquants dans .env');
    return;
  }

  try {
    // Email au client
    if (booking.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || `Trendy Travel <${process.env.SMTP_USER}>`,
        to: booking.email,
        subject: `✅ Confirmation réservation ${booking.bookingNumber} — Trendy Travel`,
        html: bookingEmailTemplate(booking),
      });
      console.log(`📧 Email client envoyé à ${booking.email}`);
    }

    // Email à l'admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `Trendy Travel <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `🔔 Nouvelle réservation ${booking.bookingNumber} — ${booking.name}`,
      html: adminEmailTemplate(booking),
    });
    console.log(`📧 Email admin envoyé à ${adminEmail}`);

  } catch (err) {
    console.error('❌ Erreur envoi email:', err.message);
  }
}

module.exports = { sendBookingConfirmation };
