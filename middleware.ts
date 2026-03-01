import { createSecureMiddleware } from 'websecure-ez';

// E-commerce Platform Security Configuration
// Secure configuration for online stores with payment processing
const secureMiddleware = createSecureMiddleware({
  "contentSecurityPolicy": {
    "enabled": true,
    "directives": {
      "defaultSrc": [
        "'self'"
      ],
      "scriptSrc": [
        "'self'",
        "https://js.stripe.com",
        "https://checkout.paypal.com"
      ],
      "styleSrc": [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      "imgSrc": [
        "'self'",
        "data:",
        "https:",
        "https://cdn.stripe.com"
      ],
      "connectSrc": [
        "'self'",
        "https://api.stripe.com",
        "https://api.paypal.com"
      ],
      "fontSrc": [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      "objectSrc": [
        "'none'"
      ],
      "mediaSrc": [
        "'self'"
      ],
      "frameSrc": [
        "https://js.stripe.com",
        "https://checkout.paypal.com"
      ],
      "upgradeInsecureRequests": true,
      "blockAllMixedContent": true
    },
    "reportOnly": false
  },
  "hsts": {
    "enabled": true,
    "maxAge": 63072000,
    "includeSubDomains": false,
    "preload": true
  },
  "xFrameOptions": {
    "enabled": true,
    "option": "DENY"
  },
  "secureCookies": {
    "enabled": true,
    "httpOnly": true,
    "secure": true,
    "sameSite": "Strict"
  },
  "referrerPolicy": {
    "enabled": true,
    "policy": "strict-origin-when-cross-origin"
  },
  "permissionsPolicy": {
    "enabled": true,
    "features": {
      "camera": "'none'",
      "microphone": "'none'",
      "geolocation": "'self'",
      "payment": "'self'",
      "usb": "'none'",
      "vr": "'none'"
    }
  },
  "xContentTypeOptions": {
    "enabled": true
  },
  "xssProtection": {
    "enabled": true,
    "mode": "block"
  }
});

export default secureMiddleware;

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};