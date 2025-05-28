DROP database indiglobal;
CREATE DATABASE indiglobal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE indiglobal;

-- USERS
CREATE TABLE Users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  country VARCHAR(50),
  state VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ADDRESSES
CREATE TABLE Addresses (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36),
  label VARCHAR(50),
  line1 VARCHAR(255),
  line2 VARCHAR(255),
  city VARCHAR(50),
  state VARCHAR(50),
  postalCode VARCHAR(20),
  country VARCHAR(50),
  FOREIGN KEY (userId) REFERENCES Users(id)
);

-- PRODUCTS
CREATE TABLE Products (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(150),
  description TEXT,
  sku VARCHAR(50) UNIQUE,
  category VARCHAR(50),
  subcategory VARCHAR(50),
  priceINR DECIMAL(10,2),
  weight DECIMAL(10,2),
  dimensions VARCHAR(100),
  stockQty INT,
  originRegion VARCHAR(100),
  isGITagged BOOLEAN,
  imageUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PRODUCT PRICES (per country)
CREATE TABLE ProductPrices (
  id CHAR(36) PRIMARY KEY,
  productId CHAR(36),
  countryCode VARCHAR(10),
  currencyCode VARCHAR(10),
  price DECIMAL(10,2),
  lastUpdated TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES Products(id)
);

-- CART
CREATE TABLE Carts (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id)
);

-- CART ITEMS
CREATE TABLE CartItems (
  id CHAR(36) PRIMARY KEY,
  cartId CHAR(36),
  productId CHAR(36),
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (cartId) REFERENCES Carts(id),
  FOREIGN KEY (productId) REFERENCES Products(id)
);

-- ORDERS
CREATE TABLE Orders (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36),
  totalPrice DECIMAL(10,2),
  currency VARCHAR(10),
  shippingCost DECIMAL(10,2),
  tax DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending',
  paymentMethod VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id)
);

-- ORDER ITEMS
CREATE TABLE OrderItems (
  id CHAR(36) PRIMARY KEY,
  orderId CHAR(36),
  productId CHAR(36),
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (orderId) REFERENCES Orders(id),
  FOREIGN KEY (productId) REFERENCES Products(id)
);

-- COUNTRY SETTINGS
CREATE TABLE CountrySettings (
  id CHAR(36) PRIMARY KEY,
  countryCode VARCHAR(10) UNIQUE,
  currencySymbol VARCHAR(5),
  currencyRate DECIMAL(10,4),
  taxRate DECIMAL(5,2),
  shippingRatePerKg DECIMAL(10,2),
  estimatedShippingDays INT
);

-- USERS
INSERT INTO Users (id, name, email, phone, password, country, state)
VALUES
  ('11111111-aaaa-bbbb-cccc-000000000001', 'Aryaman Mehra', 'arya.nri@gmail.com', '+14155551234', 'hashed_password_1', 'USA', 'California'),
  ('11111111-aaaa-bbbb-cccc-000000000002', 'Riya Sen', 'riya.uk@indiglobal.com', '+447700900123', 'hashed_password_2', 'UK', 'London');

-- ADDRESSES
INSERT INTO Addresses (id, userId, label, line1, city, state, postalCode, country)
VALUES
  (UUID(), '11111111-aaaa-bbbb-cccc-000000000001', 'Home', '123 NRI Street', 'San Jose', 'California', '95131', 'USA'),
  (UUID(), '11111111-aaaa-bbbb-cccc-000000000002', 'Primary', '42 Oxford Lane', 'London', 'Greater London', 'WC2N', 'UK');

-- PRODUCTS
INSERT INTO Products (id, name, description, sku, category, subcategory, priceINR, weight, dimensions, stockQty, originRegion, isGITagged, imageUrl)
VALUES
  ('22222222-aaaa-bbbb-cccc-000000000001', 'Premium Basmati Rice (5kg)', 'Aromatic long-grain rice.', 'BAS5000', 'food', 'staples', 899.00, 5.0, '30x20x15', 100, 'Punjab', FALSE, 'https://example.com/rice.jpg'),
  ('22222222-aaaa-bbbb-cccc-000000000002', 'Jaipur Blue Pottery Vase', 'GI-tagged handcrafted pottery.', 'BLU4567', 'gi-tagged', 'handicrafts', 2499.00, 1.2, '25x15x15', 30, 'Rajasthan', TRUE, 'https://example.com/bluepottery.jpg'),
  ('22222222-aaaa-bbbb-cccc-000000000003', 'Oxidized Silver Bridal Set', 'Ethnic bridal set.', 'OXD999', 'jewelry', 'bridal', 7299.00, 0.5, '10x10x5', 20, 'Delhi', FALSE, 'https://example.com/jewelry.jpg');

-- PRODUCT PRICES
INSERT INTO ProductPrices (id, productId, countryCode, currencyCode, price, lastUpdated)
VALUES
  (UUID(), '22222222-aaaa-bbbb-cccc-000000000001', 'US', 'USD', 10.99, NOW()),
  (UUID(), '22222222-aaaa-bbbb-cccc-000000000001', 'UK', 'GBP', 8.99, NOW()),
  (UUID(), '22222222-aaaa-bbbb-cccc-000000000002', 'US', 'USD', 35.50, NOW()),
  (UUID(), '22222222-aaaa-bbbb-cccc-000000000002', 'UK', 'GBP', 29.99, NOW()),
  (UUID(), '22222222-aaaa-bbbb-cccc-000000000003', 'US', 'USD', 89.99, NOW());

-- COUNTRY SETTINGS
INSERT INTO CountrySettings (id, countryCode, currencySymbol, currencyRate, taxRate, shippingRatePerKg, estimatedShippingDays)
VALUES
  (UUID(), 'US', '$', 0.012, 7.5, 8.0, 5),
  (UUID(), 'UK', '£', 0.010, 5.0, 7.5, 6),
  (UUID(), 'AE', 'AED', 0.045, 0.0, 6.0, 4);

-- CARTS
INSERT INTO Carts (id, userId)
VALUES
  ('33333333-aaaa-bbbb-cccc-000000000001', '11111111-aaaa-bbbb-cccc-000000000001');

-- CART ITEMS
INSERT INTO CartItems (id, cartId, productId, quantity, price)
VALUES
  (UUID(), '33333333-aaaa-bbbb-cccc-000000000001', '22222222-aaaa-bbbb-cccc-000000000001', 2, 10.99),
  (UUID(), '33333333-aaaa-bbbb-cccc-000000000001', '22222222-aaaa-bbbb-cccc-000000000003', 1, 89.99);

-- ORDERS
INSERT INTO Orders (id, userId, totalPrice, currency, shippingCost, tax, status, paymentMethod)
VALUES
  ('44444444-aaaa-bbbb-cccc-000000000001', '11111111-aaaa-bbbb-cccc-000000000001', 120.97, 'USD', 12.00, 7.98, 'shipped', 'stripe');

-- ORDER ITEMS
INSERT INTO OrderItems (id, orderId, productId, quantity, price)
VALUES
  (UUID(), '44444444-aaaa-bbbb-cccc-000000000001', '22222222-aaaa-bbbb-cccc-000000000001', 2, 10.99),
  (UUID(), '44444444-aaaa-bbbb-cccc-000000000001', '22222222-aaaa-bbbb-cccc-000000000003', 1, 89.99);
