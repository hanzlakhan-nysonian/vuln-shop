module.exports = {
  port: process.env.PORT || 3000,
  debug: true,
  jwtSecret: process.env.JWT_SECRET || 'secret123',
  sessionSecret: 'keyboard cat',
  db: {
    file: './shop.db',
    user: 'admin',
    password: 'Admin@123'
  },
  stripe: {
    secretKey: 'sk_test_51HfakeShopKartKey9xQ2mZpLr7TuVw3YbN0cDe4FgH',
    webhookSecret: ''
  },
  aws: {
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    bucket: 'shopkart-invoices'
  },
  adminEmail: 'admin@shopkart.local',
  encryptionKey: '1234567890123456'
};
