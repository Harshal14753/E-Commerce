# E-commerce Website Requirements (MERN)

> Client-provided requirements — fill in client-specific values where indicated.

## 1. Project Overview
- **Project name:** [CLIENT_PROJECT_NAME]
- **Client:** [CLIENT_NAME]
- **Primary goal:** Build a responsive e-commerce web application using the MERN stack (MongoDB, Express, React, Node.js) to support catalog browsing, cart/checkout, payments, and admin management.

## 2. Stakeholders
- **Product owner / Client contact:** [NAME, EMAIL, PHONE]
- **Users:** Guests, Registered Customers, Admins
- **Launch date / Deadline:** [DATE]

## 3. Scope & Features
### 3.1 Public (Customer) Features
- Browse product categories and collections
- Product search, filtering, and sorting
- Product detail pages with images, variants, and reviews
- User registration, login, password reset
- Shopping cart (add/remove/update quantity)
- Guest checkout and registered-user checkout
- Payment gateway integration (e.g., Stripe / PayPal)
- Order confirmation emails and order history for logged-in users
- Responsive design for desktop, tablet, mobile

### 3.2 Admin / Management Features
- Admin authentication and RBAC (roles: admin, editor)
- Product CRUD (create, read, update, delete)
- Category and inventory management
- Order management and status updates
- Customer management
- View sales reports and basic analytics

### 3.3 Non-functional Requirements
- Performance: page load <= 2s for common pages under expected traffic
- Availability: deployable to cloud (e.g., Heroku, AWS, Vercel) with zero-downtime plan
- Scalability: decoupled backend and stateless API to allow horizontal scaling
- Security: HTTPS, input validation, secure password storage (bcrypt), protection against XSS/CSRF/SQLi
- Accessibility: WCAG AA baseline compliance

## 4. Technical Stack
- Frontend: React (preferably with create-react-app or Vite), React Router, Redux or Context API for state
- Backend: Node.js + Express
- Database: MongoDB (Atlas recommended)
- Authentication: JWT for API, cookies or localStorage for client sessions; OAuth optional (Google, Facebook)
- Payments: Stripe (preferred) or PayPal
- Image storage: Cloud storage (AWS S3) or CDN
- Email: transactional emails via SendGrid / Mailgun
- Dev tooling: ESLint, Prettier, Jest/RTL for tests

## 5. API & Data Models (detailed)
Below are recommended Mongoose-style model shapes and common validations. Adjust fields to match client needs.

### User
```js
{
	_id: ObjectId,
	name: { type: String, required: true, minlength: 2, maxlength: 100 },
	email: { type: String, required: true, unique: true, lowercase: true, match: /.+@.+\..+/ },
	passwordHash: { type: String, required: true },
	role: { type: String, enum: ['customer','admin','editor'], default: 'customer' },
	addresses: [{ label: String, line1: String, city: String, state: String, postalCode: String, country: String, isDefault: Boolean }],
	createdAt: { type: Date, default: Date.now }
}
```
- Notes: index `email` as unique; enforce secure password hashing (bcrypt) before saving.

### Product
```js
{
	_id: ObjectId,
	name: { type: String, required: true, minlength: 1 },
	slug: { type: String, required: true, unique: true },
	description: { type: String },
	price: { type: Number, required: true, min: 0 },
	currency: { type: String, default: 'USD' },
	images: [{ url: String, alt: String }],
	variants: [{ sku: String, price: Number, attributes: Object, stock: Number }],
	categories: [{ type: ObjectId, ref: 'Category' }],
	stock: { type: Number, default: 0, min: 0 },
	attributes: { type: Object },
	featured: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now }
}
```
- Notes: maintain `slug` uniqueness and add text indexes on `name` and `description` for search.

### Category
```js
{
	_id: ObjectId,
	name: { type: String, required: true },
	slug: { type: String, required: true, unique: true },
	parentId: { type: ObjectId, ref: 'Category', default: null }
}
```

### Order
```js
{
	_id: ObjectId,
	userId: { type: ObjectId, ref: 'User', required: true },
	items: [{ productId: ObjectId, name: String, sku: String, price: Number, quantity: { type: Number, min: 1 } }],
	subtotal: { type: Number, min: 0 },
	tax: { type: Number, min: 0, default: 0 },
	shipping: { type: Number, min: 0, default: 0 },
	total: { type: Number, min: 0 },
	shippingAddress: { line1: String, city: String, state: String, postalCode: String, country: String },
	payment: { provider: String, transactionId: String, status: { type: String, enum: ['pending','paid','failed','refunded'] } },
	status: { type: String, enum: ['pending','paid','processing','shipped','delivered','cancelled','refunded'], default: 'pending' },
	createdAt: { type: Date, default: Date.now }
}
```

### Payment (minimal)
```js
{
	transactionId: String,
	provider: { type: String },
	amount: Number,
	currency: String,
	status: { type: String, enum: ['pending','succeeded','failed','refunded'] },
	rawResponse: Object
}
```

### Review (optional)
```js
{
	userId: { type: ObjectId, ref: 'User' },
	productId: { type: ObjectId, ref: 'Product' },
	rating: { type: Number, min: 1, max: 5 },
	title: String,
	body: String,
	createdAt: { type: Date, default: Date.now }
}
```

Validation summary:
- Use required/unique constraints for keys that must be present (email, product slug).
- Use numeric min values for prices, stock and quantity.
- Use enums for roles, order and payment statuses.
- Add indexes for search (`name`, `slug`, `categories`) and unique constraints where appropriate.


## 6. Authentication & Authorization
- Customer flows: register, login, logout, forgot/reset password (email token)
- Admin flows: admin login with role-based access control
- Protect API routes requiring authentication and admin-only routes

## 7. Integrations
- Payment gateway: Stripe (API keys stored in env)
- Email service: SendGrid
- Analytics: Google Analytics / GA4
- Optional: Social login providers, third-party search (Algolia)

## 8. Deployment & Environment
- Env vars: NODE_ENV, MONGODB_URI, JWT_SECRET, STRIPE_SECRET_KEY, SENDGRID_API_KEY
- Dockerfile and docker-compose (optional) for local dev and production parity
- CI/CD: GitHub Actions pipeline for tests and deploy
- Hosting: Backend on Heroku / AWS Elastic Beanstalk / Render; Frontend on Vercel / Netlify

## 9. Testing & QA
- Unit tests for backend services and frontend components
- Integration tests for API endpoints
- End-to-end tests for checkout flows (Cypress / Playwright)
- Manual QA checklist: cross-browser, mobile responsiveness, payment test cards

## 10. Security & Compliance
- Use HTTPS in production
- Secure JWT with proper expiry and rotation policy
- PCI compliance for payment flows (use Stripe hosted checkout to simplify)
- Sanitize and validate all user inputs

## 11. Deliverables
- Source code (frontend + backend) in repository
- README with setup and run instructions
- Deployed staging and production URLs
- Basic documentation: API spec, data model diagrams, environment variable list

## 12. Acceptance Criteria
- Users can register, browse catalog, add to cart, and complete checkout with payment
- Admin can manage products and view orders
- App passes a basic performance and security checklist
- CI runs tests and deploys to staging on push to `develop` branch

## 13. Timeline & Milestones (suggested)
- Week 1: Project setup, basic frontend routing, backend skeleton, DB schema
- Week 2: Product listing, product pages, search/filter
- Week 3: Cart, checkout, payment integration
- Week 4: Admin panel, orders, testing, deployment

## 14. Open Questions (fill with client answers)
- Preferred payment provider?
- Any specific 3rd-party integrations required?
- Branding assets and design system available?
- Expected monthly traffic and scale targets?

---

Please replace bracketed placeholders with the client's exact details and attach any client-provided requirement documents under `docs/` if available.
