/**
 * One-shot API endpoint to initialize the production PostgreSQL database.
 * Call: GET /api/setup-db?token=xxx
 *
 * Creates all tables in PostgreSQL using raw SQL.
 * Each statement is executed separately (Prisma doesn't allow multi-statement prepared queries).
 */
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min

// All CREATE TYPE / CREATE TABLE / CREATE INDEX / INSERT statements as separate strings.
// Order matters: enums first, then tables with FKs after their parents.
const STATEMENTS: string[] = [
  // ── Enums (PostgreSQL types) ───────────────────
  `DO $$ BEGIN CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'PRO', 'ADMIN', 'STAFF'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "PricingMode" AS ENUM ('PRICE', 'ON_REQUEST'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "OrderStatus" AS ENUM ('QUOTE_REQUESTED', 'PROFORMA_ISSUED', 'ORDERED', 'AWAITING_PAYMENT', 'PAID', 'PREPARING', 'AWAITING_DELIVERY', 'DELIVERING', 'DELIVERED', 'CANCELLED', 'RETURNED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "DeliveryMode" AS ENUM ('PICKUP_STORE', 'LOME_DELIVERY', 'OTHER_REGIONS'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'ISSUED', 'APPROVED', 'REFUSED', 'EXPIRED', 'CONVERTED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE "DocumentType" AS ENUM ('ACKNOWLEDGE', 'PROFORMA', 'PURCHASE_ORDER', 'PAYMENT_REMINDER', 'RECEIPT', 'DELIVERY_NOTE', 'CREDIT_NOTE'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,

  // ── Auth ─────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CLIENT',
    "companyName" TEXT,
    rccm TEXT,
    nif TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "OtpCode" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    code TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'WHATSAPP',
    consumed BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "OtpCode_userId_idx" ON "OtpCode"("userId")`,
  `CREATE INDEX IF NOT EXISTS "OtpCode_code_idx" ON "OtpCode"("code")`,
  `ALTER TABLE "OtpCode" ADD CONSTRAINT "OtpCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE NOT VALID`,

  // ── Catalog ──────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS "Category" (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,
  `ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"(id) NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "Brand" (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    logo TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "Product" (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    barcode TEXT,
    "shortDesc" TEXT NOT NULL,
    description TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "brandId" TEXT,
    "regularPrice" DOUBLE PRECISION NOT NULL,
    "promoPrice" DOUBLE PRECISION,
    stock INTEGER NOT NULL DEFAULT 0,
    "stockThreshold" INTEGER NOT NULL DEFAULT 3,
    weight DOUBLE PRECISION,
    dimensions TEXT,
    warranty TEXT,
    images TEXT NOT NULL DEFAULT '[]',
    "pdfSpec" TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    attributes TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    "pricingMode" TEXT NOT NULL DEFAULT 'PRICE',
    featured BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId")`,
  `CREATE INDEX IF NOT EXISTS "Product_brandId_idx" ON "Product"("brandId")`,
  `CREATE INDEX IF NOT EXISTS "Product_status_idx" ON "Product"("status")`,
  `CREATE INDEX IF NOT EXISTS "Product_featured_idx" ON "Product"("featured")`,
  `ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"(id) NOT VALID`,
  `ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"(id) NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "ProductReview" (
    id TEXT PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "userId" TEXT,
    "authorName" TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    published BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS "ProductReview_productId_idx" ON "ProductReview"("productId")`,
  `CREATE INDEX IF NOT EXISTS "ProductReview_published_idx" ON "ProductReview"("published")`,
  `ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE NOT VALID`,
  `ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) NOT VALID`,

  // Quote comes before Order because Order has FK to Quote (proformaId)
  `CREATE TABLE IF NOT EXISTS "Quote" (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL UNIQUE,
    "userId" TEXT,
    "guestName" TEXT,
    "guestPhone" TEXT,
    "guestEmail" TEXT,
    "companyName" TEXT,
    rccm TEXT,
    nif TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    "validUntil" TIMESTAMP(3) NOT NULL,
    subtotal DOUBLE PRECISION NOT NULL,
    discount DOUBLE PRECISION NOT NULL DEFAULT 0,
    vat DOUBLE PRECISION NOT NULL DEFAULT 0,
    total DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS "Quote_userId_idx" ON "Quote"("userId")`,
  `CREATE INDEX IF NOT EXISTS "Quote_status_idx" ON "Quote"("status")`,
  `ALTER TABLE "Quote" ADD CONSTRAINT "Quote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "Order" (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL UNIQUE,
    "userId" TEXT,
    "guestName" TEXT,
    "guestPhone" TEXT,
    "guestEmail" TEXT,
    status TEXT NOT NULL DEFAULT 'QUOTE_REQUESTED',
    "companyName" TEXT,
    rccm TEXT,
    nif TEXT,
    "billingAddress" TEXT,
    "deliveryMode" TEXT NOT NULL,
    "shippingAddress" TEXT,
    "shippingFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shippingZone" TEXT,
    subtotal DOUBLE PRECISION NOT NULL,
    discount DOUBLE PRECISION NOT NULL DEFAULT 0,
    vat DOUBLE PRECISION NOT NULL DEFAULT 0,
    total DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT,
    "paymentRef" TEXT,
    "paidAt" TIMESTAMP(3),
    "proformaId" TEXT UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId")`,
  `CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"("status")`,
  `CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt")`,
  `ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) NOT VALID`,
  `ALTER TABLE "Order" ADD CONSTRAINT "Order_proformaId_fkey" FOREIGN KEY ("proformaId") REFERENCES "Quote"(id) NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "OrderItem" (
    id TEXT PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    name TEXT NOT NULL,
    sku TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    quantity INTEGER NOT NULL,
    total DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId")`,
  `CREATE INDEX IF NOT EXISTS "OrderItem_productId_idx" ON "OrderItem"("productId")`,
  `ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE NOT VALID`,
  `ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id) NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "QuoteItem" (
    id TEXT PRIMARY KEY,
    "quoteId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    name TEXT NOT NULL,
    sku TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    quantity INTEGER NOT NULL,
    total DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "QuoteItem_quoteId_idx" ON "QuoteItem"("quoteId")`,
  `CREATE INDEX IF NOT EXISTS "QuoteItem_productId_idx" ON "QuoteItem"("productId")`,
  `ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"(id) ON DELETE CASCADE NOT VALID`,
  `ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id) NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "Document" (
    id TEXT PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    number TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    "filePath" TEXT,
    "dataJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "Document_orderId_idx" ON "Document"("orderId")`,
  `ALTER TABLE "Document" ADD CONSTRAINT "Document_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "OrderMessage" (
    id TEXT PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "fromAdmin" BOOLEAN NOT NULL DEFAULT false,
    body TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "OrderMessage_orderId_idx" ON "OrderMessage"("orderId")`,
  `ALTER TABLE "OrderMessage" ADD CONSTRAINT "OrderMessage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "OrderTimeline" (
    id TEXT PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    status TEXT NOT NULL,
    note TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "OrderTimeline_orderId_idx" ON "OrderTimeline"("orderId")`,
  `ALTER TABLE "OrderTimeline" ADD CONSTRAINT "OrderTimeline_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "PaymentTransaction" (
    id TEXT PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    reference TEXT NOT NULL UNIQUE,
    provider TEXT NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    currency TEXT NOT NULL DEFAULT 'XOF',
    status TEXT NOT NULL DEFAULT 'PENDING',
    "rawPayload" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS "PaymentTransaction_orderId_idx" ON "PaymentTransaction"("orderId")`,
  `CREATE INDEX IF NOT EXISTS "PaymentTransaction_status_idx" ON "PaymentTransaction"("status")`,
  `CREATE INDEX IF NOT EXISTS "PaymentTransaction_reference_idx" ON "PaymentTransaction"("reference")`,
  `ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE NOT VALID`,

  // ── Vitrine ──────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS "Service" (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    image TEXT,
    benefits TEXT NOT NULL DEFAULT '[]',
    interventions TEXT NOT NULL DEFAULT '[]',
    faqs TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "ServiceRequest" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service TEXT NOT NULL,
    location TEXT,
    description TEXT NOT NULL,
    delay TEXT,
    attachments TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'NEW',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS "ServiceRequest_userId_idx" ON "ServiceRequest"("userId")`,
  `CREATE INDEX IF NOT EXISTS "ServiceRequest_status_idx" ON "ServiceRequest"("status")`,
  `ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "Realization" (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    client TEXT,
    location TEXT,
    description TEXT NOT NULL,
    images TEXT NOT NULL DEFAULT '[]',
    date TIMESTAMP(3),
    featured BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "Testimonial" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    rating INTEGER NOT NULL DEFAULT 5,
    content TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "BlogPost" (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    published BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,

  // ── Misc ─────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS "Address" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    label TEXT NOT NULL,
    line1 TEXT NOT NULL,
    line2 TEXT,
    city TEXT NOT NULL,
    region TEXT,
    phone TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS "Address_userId_idx" ON "Address"("userId")`,
  `ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "Settings" (
    id TEXT PRIMARY KEY DEFAULT 'singleton',
    "companyName" TEXT NOT NULL DEFAULT 'AGBE-TECH',
    "legalName" TEXT NOT NULL DEFAULT 'AGBE-TECH',
    address TEXT NOT NULL DEFAULT 'Kégué, Rue Kpacha – Lomé, Togo',
    phone1 TEXT NOT NULL DEFAULT '+228 98 89 79 14',
    phone2 TEXT NOT NULL DEFAULT '+228 93 90 77 06',
    email TEXT NOT NULL DEFAULT 'contact@agbe-tech.com',
    rccm TEXT NOT NULL DEFAULT '',
    nif TEXT NOT NULL DEFAULT '',
    "vatRate" DOUBLE PRECISION NOT NULL DEFAULT 0.18,
    "proformaValidity" INTEGER NOT NULL DEFAULT 15,
    "lomeDeliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 2000,
    "otherRegionsFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    whatsapp TEXT NOT NULL DEFAULT '22898897914',
    instagram TEXT,
    facebook TEXT,
    "kkiapayKey" TEXT,
    "cinetpayKey" TEXT,
    "paydunaKey" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,

  // ── Phase 4 models ──────────────────────────────
  `CREATE TABLE IF NOT EXISTS "WishlistItem" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "WishlistItem_userId_productId_key" ON "WishlistItem"("userId", "productId")`,
  `CREATE INDEX IF NOT EXISTS "WishlistItem_userId_idx" ON "WishlistItem"("userId")`,
  `ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE NOT VALID`,
  `ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "Coupon" (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'PERCENT',
    value DOUBLE PRECISION NOT NULL,
    "minOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxUses" INTEGER NOT NULL DEFAULT 0,
    "usesCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    active BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS "Coupon_code_idx" ON "Coupon"("code")`,

  `CREATE TABLE IF NOT EXISTS "Notification" (
    id TEXT PRIMARY KEY,
    "userId" TEXT,
    channel TEXT NOT NULL DEFAULT 'IN_APP',
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId")`,
  `CREATE INDEX IF NOT EXISTS "Notification_status_idx" ON "Notification"("status")`,
  `ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    "confirmToken" TEXT,
    confirmed BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
  )`,
  `ALTER TABLE "NewsletterSubscriber" ADD CONSTRAINT "NewsletterSubscriber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "Referral" (
    id TEXT PRIMARY KEY,
    "referrerId" TEXT NOT NULL,
    "referredId" TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    "rewardType" TEXT NOT NULL DEFAULT 'CREDIT',
    "rewardValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "Referral_referrerId_idx" ON "Referral"("referrerId")`,
  `ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"(id) NOT VALID`,
  `ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "User"(id) NOT VALID`,

  `CREATE TABLE IF NOT EXISTS "AuditLog" (
    id TEXT PRIMARY KEY,
    "actorId" TEXT,
    action TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    metadata TEXT NOT NULL DEFAULT '{}',
    ip TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "AuditLog_actorId_idx" ON "AuditLog"("actorId")`,
  `CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action")`,
  `CREATE INDEX IF NOT EXISTS "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId")`,

  `CREATE TABLE IF NOT EXISTS "StockMovement" (
    id TEXT PRIMARY KEY,
    "productId" TEXT NOT NULL,
    delta INTEGER NOT NULL,
    reason TEXT NOT NULL,
    "refId" TEXT,
    note TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "StockMovement_productId_idx" ON "StockMovement"("productId")`,
  `CREATE INDEX IF NOT EXISTS "StockMovement_reason_idx" ON "StockMovement"("reason")`,
  `ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE NOT VALID`,

  // ── Default data ───────────────────────────────
  `INSERT INTO "Settings" (id, "updatedAt")
   SELECT 'singleton', CURRENT_TIMESTAMP
   WHERE NOT EXISTS (SELECT 1 FROM "Settings" WHERE id = 'singleton')`,

  // Admin user (password: agbe-admin-2026, bcrypt hashed)
  `INSERT INTO "User" (id, phone, email, name, role, "passwordHash", "createdAt", "updatedAt")
   SELECT 'admin-bootstrap', '22800000000', 'admin@agbe-tech.com', 'Administrateur AGBE-TECH', 'ADMIN',
          '$2b$10$jqMzpwVr7IcwzS9VzS4iV.ZONXlSoPaNCECOJz6zuDYwRCwa/khfW',
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
   WHERE NOT EXISTS (SELECT 1 FROM "User" WHERE email = 'admin@agbe-tech.com')`,

  // ── Convert TEXT columns to enum types ─────────
  // Required because Prisma's schema uses enums (UserRole, OrderStatus, etc.)
  // and tries to cast text values to the enum type.
  `ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole" USING "role"::"UserRole"`,
  `ALTER TABLE "Product" ALTER COLUMN "status" TYPE "ProductStatus" USING "status"::"ProductStatus"`,
  `ALTER TABLE "Product" ALTER COLUMN "pricingMode" TYPE "PricingMode" USING "pricingMode"::"PricingMode"`,
  `ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus" USING "status"::"OrderStatus"`,
  `ALTER TABLE "Order" ALTER COLUMN "deliveryMode" TYPE "DeliveryMode" USING "deliveryMode"::"DeliveryMode"`,
  `ALTER TABLE "Quote" ALTER COLUMN "status" TYPE "QuoteStatus" USING "status"::"QuoteStatus"`,
  `ALTER TABLE "Document" ALTER COLUMN "type" TYPE "DocumentType" USING "type"::"DocumentType"`,
];

export async function GET(req: NextRequest) {
  const setupToken = process.env.SETUP_DB_TOKEN;
  if (!setupToken) {
    return NextResponse.json(
      { error: "Setup endpoint disabled. Set SETUP_DB_TOKEN env var to use this." },
      { status: 403 }
    );
  }
  const token = req.nextUrl.searchParams.get("token");
  if (token !== setupToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const results: Array<{ statement: string; ok: boolean; error?: string }> = [];
  let success = 0;
  let failed = 0;

  for (const sql of STATEMENTS) {
    const label = sql.slice(0, 80).replace(/\s+/g, " ");
    try {
      await db.$executeRawUnsafe(sql);
      results.push({ statement: label, ok: true });
      success++;
    } catch (e: any) {
      // Ignore errors like "already exists" or "constraint already exists"
      const msg = e.message || "";
      if (
        msg.includes("already exists") ||
        msg.includes("already associated") ||
        msg.includes("duplicate key")
      ) {
        results.push({ statement: label, ok: true });
        success++;
      } else {
        results.push({ statement: label, ok: false, error: msg.split("\n").pop()?.trim() || msg });
        failed++;
      }
    }
  }

  return NextResponse.json({
    ok: failed === 0,
    success,
    failed,
    results: results.slice(-30), // last 30 to keep response small
  });
}
