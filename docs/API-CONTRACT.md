# API Contract: Next Store

Dokumen ini adalah kontrak REST API untuk Next Store berdasarkan `docs/schema.md` dan `docs/PRD.md`. Kontrak ditujukan untuk implementasi backend Go dan konsumsi oleh frontend Next.js.

Kontrak ini mengikuti prinsip OpenAPI 3.1 dan RFC 9457 Problem Details. File ini adalah spesifikasi manusia yang menjadi dasar pembuatan `openapi.yaml`; nama field, status HTTP, dan aturan keamanan di dalamnya harus dianggap sebagai public contract.

## 1. Konvensi Dasar

| Item | Kontrak |
|---|---|
| Base URL | `https://api.example.com/api/v1` |
| Format | `application/json; charset=utf-8` |
| Waktu | ISO 8601 UTC, contoh `2026-09-27T10:30:00Z` |
| ID | UUID v4 string |
| Uang | String decimal, contoh `"125000.00"`; jangan gunakan floating point |
| Berat | Integer gram |
| Bahasa error | Bahasa Indonesia yang aman untuk user |
| Request ID | Header `X-Request-Id` response; server membuatnya bila tidak dikirim |
| Auth | Session cookie `HttpOnly`; bearer token tidak digunakan oleh browser pada MVP |
| Versioning | URL major version: `/api/v1` |
| Soft delete | Resource yang dihapus tidak muncul pada endpoint normal |

### 1.1 Aturan Umum HTTP

- `GET` tidak boleh mengubah state dan dapat diulang.
- `POST` membuat resource atau menjalankan command.
- `PATCH` melakukan partial update dan tidak boleh menghapus field yang tidak dikirim.
- `DELETE` melakukan soft delete jika resource mendukung `deleted_at`.
- `204 No Content` tidak memiliki body.
- Response error tidak boleh mengembalikan stack trace, SQL, secret, token, `password_hash`, raw payment payload, atau data kartu.
- Semua endpoint harus memiliki timeout server dan request body limit.
- Nilai enum dikirim sebagai string lowercase sesuai enum pada schema.

### 1.2 Header Request Umum

```http
Accept: application/json
Content-Type: application/json
X-Request-Id: 1d8f2d2a-61b9-4a01-a5bc-1e39d16b9e01
```

`Content-Type` wajib untuk request yang memiliki body. `X-Request-Id` boleh dikirim client, tetapi server harus menolak format invalid atau menggantinya.

### 1.3 Header Mutasi Idempotent

Mutasi berikut wajib memakai `Idempotency-Key`:

- `POST /checkout/orders`;
- `POST /checkout/orders/{order_number}/retry-payment`;
- `POST /admin/payments/{payment_id}/refunds`;
- webhook gateway, dengan deduplication berdasarkan event gateway;
- operasi lain yang dinyatakan idempotent di endpoint.

```http
Idempotency-Key: checkout-20260927-01-unique-client-key
```

Ketentuan:

- panjang 16-255 karakter;
- hanya karakter ASCII yang aman: alphanumeric, `.`, `_`, `-`;
- key yang sama dengan body berbeda menghasilkan `409 IDEMPOTENCY_KEY_REUSED`;
- key yang sama dengan request sukses mengembalikan response sukses yang sama;
- key disimpan bersama `user_id` atau fingerprint guest, method, path, request hash, status, dan response aman;
- key memiliki retention minimum 24 jam atau mengikuti lifecycle order.

## 2. Format Success Response

### 2.1 Tanpa Pagination

Semua response sukses yang mengembalikan resource memakai envelope berikut:

```json
{
  "data": {
    "id": "b7f1c8e4-0f7b-4e0f-a2b8-b7af8b0c37b2",
    "name": "Kaos Basic"
  },
  "meta": {},
  "request_id": "1d8f2d2a-61b9-4a01-a5bc-1e39d16b9e01"
}
```

Kontrak field:

| Field | Tipe | Wajib | Keterangan |
|---|---|---:|---|
| `data` | object/array/null | Ya | Payload endpoint |
| `meta` | object | Ya | Metadata tambahan; `{}` bila tidak ada |
| `request_id` | string UUID | Ya | ID untuk tracing/support |

Untuk command yang tidak mengembalikan resource, `data` berisi hasil command, bukan string bebas.

Contoh response delete:

```json
{
  "data": {
    "id": "b7f1c8e4-0f7b-4e0f-a2b8-b7af8b0c37b2",
    "deleted": true
  },
  "meta": {},
  "request_id": "1d8f2d2a-61b9-4a01-a5bc-1e39d16b9e01"
}
```

### 2.2 List Tanpa Pagination

Endpoint yang secara bisnis memang mengembalikan daftar kecil, misalnya daftar permission atau pohon kategori, menggunakan:

```json
{
  "data": [
    {
      "id": "b7f1c8e4-0f7b-4e0f-a2b8-b7af8b0c37b2",
      "name": "Elektronik"
    }
  ],
  "meta": {
    "count": 1
  },
  "request_id": "1d8f2d2a-61b9-4a01-a5bc-1e39d16b9e01"
}
```

`count` adalah jumlah item pada response, bukan total semua item jika endpoint menerima filter tersembunyi atau pembatasan akses.

### 2.3 Cursor Pagination

Semua list yang dapat bertambah besar memakai cursor pagination.

Request:

```http
GET /api/v1/products?limit=20&after=eyJjcmVhdGVkX2F0Ijoi...&sort=-created_at
```

Response:

```json
{
  "data": [
    {
      "id": "b7f1c8e4-0f7b-4e0f-a2b8-b7af8b0c37b2",
      "name": "Kaos Basic"
    }
  ],
  "meta": {
    "pagination": {
      "type": "cursor",
      "limit": 20,
      "has_next": true,
      "has_previous": false,
      "next_cursor": "eyJjcmVhdGVkX2F0Ijoi...",
      "previous_cursor": null
    }
  },
  "request_id": "1d8f2d2a-61b9-4a01-a5bc-1e39d16b9e01"
}
```

Aturan:

- `limit` default `20`, minimum `1`, maksimum `100`;
- cursor opaque dan tidak boleh dibuat/diubah client;
- cursor terikat pada filter dan sort. Cursor yang dipakai dengan query berbeda menghasilkan `400 INVALID_CURSOR`;
- urutan harus deterministic, dengan `id` sebagai tie-breaker;
- `after` mengambil halaman berikutnya; `before` boleh dipakai bila endpoint mendukung navigasi mundur;
- endpoint tidak wajib mengembalikan `total` karena menghitung total besar mahal dan tidak diperlukan untuk infinite scroll.

### 2.4 Offset Pagination

Hanya laporan/admin yang memerlukan nomor halaman boleh memakai offset pagination:

```json
{
  "data": [
    {
      "id": "b7f1c8e4-0f7b-4e0f-a2b8-b7af8b0c37b2",
      "order_number": "NS-20260927-00001"
    }
  ],
  "meta": {
    "pagination": {
      "type": "offset",
      "page": 1,
      "per_page": 20,
      "total": 125,
      "total_pages": 7
    }
  },
  "request_id": "1d8f2d2a-61b9-4a01-a5bc-1e39d16b9e01"
}
```

`page` dimulai dari `1`, `per_page` default `20`, maksimum `100`.

## 3. Format Error Standard

Error memakai RFC 9457 Problem Details dengan content type `application/problem+json`.

```json
{
  "type": "https://api.example.com/problems/validation-error",
  "title": "Request tidak valid",
  "status": 422,
  "code": "VALIDATION_ERROR",
  "detail": "Satu atau lebih field tidak valid.",
  "instance": "/api/v1/checkout/quote",
  "request_id": "1d8f2d2a-61b9-4a01-a5bc-1e39d16b9e01",
  "errors": [
    {
      "field": "shipping_address.postal_code",
      "code": "INVALID_FORMAT",
      "message": "Kode pos harus terdiri dari 5 digit."
    }
  ]
}
```

### 3.1 Field Error

| Field | Tipe | Keterangan |
|---|---|---|
| `type` | string URI | Kategori masalah stabil |
| `title` | string | Judul singkat masalah |
| `status` | integer | HTTP status |
| `code` | string | Kode stabil untuk frontend |
| `detail` | string | Penjelasan aman untuk user/developer |
| `instance` | string | Path request |
| `request_id` | string | ID tracing |
| `errors` | array | Detail validasi; boleh tidak ada |
| `errors[].field` | string | JSON path field, boleh kosong untuk error umum |
| `errors[].code` | string | Kode validasi stabil |
| `errors[].message` | string | Pesan aman |

### 3.2 HTTP Status

| Status | Kapan digunakan | Contoh code |
|---:|---|---|
| `400` | JSON/query/path/header invalid | `INVALID_REQUEST`, `INVALID_CURSOR` |
| `401` | Tidak ada atau session invalid | `UNAUTHENTICATED` |
| `403` | Tidak memiliki permission | `FORBIDDEN` |
| `404` | Resource tidak ditemukan atau tidak boleh diketahui | `RESOURCE_NOT_FOUND` |
| `409` | Konflik state, duplicate, idempotency | `STATE_CONFLICT`, `SKU_ALREADY_EXISTS` |
| `422` | Payload benar secara syntax tetapi gagal validasi bisnis | `VALIDATION_ERROR`, `INSUFFICIENT_STOCK` |
| `429` | Rate limit | `RATE_LIMITED` |
| `500` | Kesalahan internal | `INTERNAL_ERROR` |
| `502` | Dependency eksternal gagal merespons valid | `PAYMENT_GATEWAY_ERROR` |
| `503` | Service/dependency tidak tersedia | `SERVICE_UNAVAILABLE` |
| `504` | Timeout dependency | `UPSTREAM_TIMEOUT` |

Header `Retry-After` wajib untuk `429`, dan digunakan untuk `503/504` bila retry aman.

### 3.3 Error Code Minimum

```text
VALIDATION_ERROR
INVALID_REQUEST
INVALID_CURSOR
UNAUTHENTICATED
FORBIDDEN
RESOURCE_NOT_FOUND
EMAIL_ALREADY_EXISTS
INVALID_CREDENTIALS
ACCOUNT_SUSPENDED
EMAIL_NOT_VERIFIED
TOKEN_INVALID
TOKEN_EXPIRED
IDEMPOTENCY_KEY_REQUIRED
IDEMPOTENCY_KEY_REUSED
STATE_CONFLICT
PRODUCT_UNAVAILABLE
VARIANT_UNAVAILABLE
INSUFFICIENT_STOCK
PRICE_CHANGED
CART_EXPIRED
CART_EMPTY
COUPON_INVALID
COUPON_EXPIRED
COUPON_USAGE_LIMIT_REACHED
ORDER_NOT_CANCELLABLE
PAYMENT_NOT_RETRYABLE
PAYMENT_SIGNATURE_INVALID
PAYMENT_AMOUNT_MISMATCH
PAYMENT_GATEWAY_ERROR
INVALID_STATUS_TRANSITION
SKU_ALREADY_EXISTS
SLUG_ALREADY_EXISTS
ATTRIBUTE_COMBINATION_EXISTS
UPLOAD_INVALID
RATE_LIMITED
INTERNAL_ERROR
```

## 4. Auth, Cookie, dan Security Contract

### 4.1 Session Cookie

Setelah login, server mengirim:

```http
Set-Cookie: ns_session=<opaque-token>; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000
```

Ketentuan:

- token mentah hanya berada pada cookie client; database hanya menyimpan hash token;
- frontend tidak boleh membaca token melalui JavaScript;
- logout mencabut session di server dan menghapus cookie;
- session expired/suspended user menghasilkan `401`;
- operasi mutasi dengan cookie membutuhkan CSRF protection: header `X-CSRF-Token` atau pola double-submit cookie;
- webhook gateway tidak memakai session cookie.

### 4.2 Permission

Permission diperiksa backend per aksi. Permission awal:

```text
catalog.read
catalog.write
catalog.publish
inventory.read
inventory.adjust
orders.read
orders.manage
orders.cancel
orders.ship
payments.read
payments.reconcile
payments.refund
coupons.read
coupons.write
customers.read
customers.manage
rbac.read
rbac.write
audit.read
reports.read
```

Role mapping mengikuti PRD: `customer`, `catalog_admin`, `order_admin`, `marketing_admin`, dan `super_admin`.

### 4.3 Ownership

- `/me/*` hanya mengakses resource milik session user;
- guest order memakai access token acak yang dikirim terpisah dari nomor order;
- server boleh mengembalikan `404` alih-alih `403` agar resource milik user lain tidak dapat dienumerasi;
- admin endpoint tetap menerapkan permission walaupun user telah login.

## 5. Tipe Resource Bersama

### 5.1 Money

```json
{
  "amount": "125000.00",
  "currency": "IDR"
}
```

Di resource transaksi, field schema tetap tersedia sebagai string decimal:

```json
{
  "subtotal": "100000.00",
  "discount_amount": "10000.00",
  "shipping_amount": "15000.00",
  "tax_amount": "0.00",
  "total_amount": "105000.00",
  "currency": "IDR"
}
```

### 5.2 Address Input dan Resource

```json
{
  "recipient_name": "Budi Santoso",
  "phone": "+628123456789",
  "address_line": "Jl. Merdeka No. 10",
  "province": "Jawa Barat",
  "city": "Bandung",
  "district": "Coblong",
  "postal_code": "40132",
  "country": "Indonesia",
  "notes": "Rumah pagar hitam",
  "is_default": true
}
```

`country` default `Indonesia`; `recipient_name`, `phone`, dan `address_line` wajib untuk address. `is_default` hanya berlaku pada address milik user login, bukan snapshot order.

### 5.3 Product Summary

```json
{
  "id": "b7f1c8e4-0f7b-4e0f-a2b8-b7af8b0c37b2",
  "name": "Kaos Basic",
  "slug": "kaos-basic",
  "sku": "KSB-BASE",
  "status": "active",
  "brand": {
    "id": "...",
    "name": "Acme",
    "slug": "acme"
  },
  "category": {
    "id": "...",
    "name": "Pakaian",
    "slug": "pakaian"
  },
  "primary_image": {
    "id": "...",
    "image_url": "https://cdn.example.com/products/kaos.webp",
    "alt_text": "Kaos Basic warna hitam"
  },
  "price_from": "99000.00",
  "compare_at_price_from": "129000.00",
  "currency": "IDR",
  "in_stock": true
}
```

### 5.4 Product Detail

Detail menambahkan `description`, `base_price`, `base_weight`, seluruh `images`, `attributes`, dan `variants`:

```json
{
  "id": "...",
  "name": "Kaos Basic",
  "slug": "kaos-basic",
  "description": "Kaos katun untuk penggunaan sehari-hari.",
  "status": "active",
  "base_price": "99000.00",
  "base_weight": 250,
  "sku": null,
  "currency": "IDR",
  "images": [
    {
      "id": "...",
      "image_url": "https://cdn.example.com/products/kaos-1.webp",
      "alt_text": "Kaos Basic tampak depan",
      "sort_order": 0,
      "is_primary": true
    }
  ],
  "attributes": [
    {
      "id": "...",
      "name": "Warna",
      "slug": "warna",
      "values": [
        { "id": "...", "value": "Hitam", "slug": "hitam" }
      ]
    }
  ],
  "variants": [
    {
      "id": "...",
      "sku": "KSB-BLK-M",
      "name": "Hitam / M",
      "price": "99000.00",
      "compare_at_price": "129000.00",
      "stock_quantity": 12,
      "available_quantity": 12,
      "weight": 250,
      "status": "active",
      "attribute_values": [
        { "id": "...", "attribute_id": "...", "value": "Hitam", "slug": "hitam" }
      ]
    }
  ]
}
```

`available_quantity` boleh disembunyikan atau dibulatkan sesuai kebijakan inventory. Jangan menganggap nilai tersebut sebagai reservation guarantee; stok dikunci ulang ketika cart/checkout diproses.

### 5.5 Cart

```json
{
  "id": "...",
  "status": "active",
  "expires_at": "2026-09-28T10:30:00Z",
  "items": [
    {
      "id": "...",
      "product_id": "...",
      "variant_id": "...",
      "product_name": "Kaos Basic",
      "variant_name": "Hitam / M",
      "sku": "KSB-BLK-M",
      "quantity": 2,
      "unit_price": "99000.00",
      "subtotal": "198000.00",
      "currency": "IDR",
      "available": true,
      "available_quantity": 12,
      "price_changed": false,
      "image_url": "https://cdn.example.com/products/kaos-1.webp"
    }
  ],
  "item_count": 2,
  "subtotal": "198000.00",
  "currency": "IDR"
}
```

`unit_price` pada cart adalah snapshot tampilan sementara. Harga final selalu dihitung ulang oleh quote/order.

### 5.6 Order

```json
{
  "id": "...",
  "order_number": "NS-20260927-00001",
  "status": "confirmed",
  "payment_status": "paid",
  "customer": {
    "user_id": "...",
    "email": "budi@example.com",
    "phone": "+628123456789"
  },
  "items": [
    {
      "id": "...",
      "product_id": "...",
      "variant_id": "...",
      "product_name": "Kaos Basic",
      "variant_name": "Hitam / M",
      "sku": "KSB-BLK-M",
      "quantity": 2,
      "unit_price": "99000.00",
      "subtotal": "198000.00",
      "currency": "IDR"
    }
  ],
  "addresses": {
    "shipping": {
      "type": "shipping",
      "recipient_name": "Budi Santoso",
      "phone": "+628123456789",
      "address_line": "Jl. Merdeka No. 10",
      "province": "Jawa Barat",
      "city": "Bandung",
      "district": "Coblong",
      "postal_code": "40132",
      "country": "Indonesia",
      "notes": null
    },
    "billing": null
  },
  "subtotal": "198000.00",
  "discount_amount": "10000.00",
  "shipping_amount": "15000.00",
  "tax_amount": "0.00",
  "total_amount": "203000.00",
  "currency": "IDR",
  "payment": {
    "id": "...",
    "gateway": "midtrans",
    "status": "paid",
    "amount": "203000.00",
    "currency": "IDR",
    "payment_method": "bank_transfer",
    "paid_at": "2026-09-27T10:35:00Z",
    "payment_url": null,
    "expired_at": null
  },
  "shipments": [],
  "status_history": [
    {
      "from_status": "pending",
      "to_status": "confirmed",
      "reason": "Payment settled",
      "created_at": "2026-09-27T10:35:00Z"
    }
  ],
  "created_at": "2026-09-27T10:30:00Z",
  "updated_at": "2026-09-27T10:35:00Z"
}
```

Guest response wajib menyamarkan data yang tidak diperlukan dan tidak pernah mengembalikan `raw_response` gateway.

## 6. Public Storefront API

Endpoint berikut tidak membutuhkan login. Hanya data aktif, tidak terhapus, dan aman untuk publik yang boleh dikembalikan.

### 6.1 Home

`GET /api/v1/home`

Response `200` tanpa pagination:

```json
{
  "data": {
    "featured_products": [],
    "latest_products": [],
    "categories": [],
    "promotions": []
  },
  "meta": {},
  "request_id": "..."
}
```

`promotions` hanya diisi bila model promosi sudah tersedia. Jangan membuat endpoint promosi yang bergantung pada tabel yang belum disepakati.

### 6.2 List Products

`GET /api/v1/products`

Query:

| Parameter | Tipe | Wajib | Keterangan |
|---|---|---:|---|
| `q` | string | Tidak | Pencarian nama, SKU, brand, kategori; maksimum 100 karakter |
| `category` | string | Tidak | Slug kategori |
| `brand` | string | Tidak | Slug brand |
| `min_price` | decimal | Tidak | Harga minimum |
| `max_price` | decimal | Tidak | Harga maksimum |
| `in_stock` | boolean | Tidak | Hanya item dengan stok tersedia |
| `sort` | enum | Tidak | `-created_at`, `created_at`, `price`, `-price`, `name` |
| `limit` | integer | Tidak | 1-100, default 20 |
| `after` | string | Tidak | Cursor berikutnya |
| `before` | string | Tidak | Cursor sebelumnya bila didukung |

Response `200`: cursor pagination berisi `ProductSummary[]`.

Aturan: `price` untuk filter adalah harga efektif minimum varian aktif. Produk `draft`, `inactive`, `archived`, dan soft-deleted tidak dikembalikan.

### 6.3 Product Detail

`GET /api/v1/products/{slug}`

- `{slug}` lowercase URL-safe, 1-280 karakter;
- response `200` berisi `ProductDetail`;
- response `404 RESOURCE_NOT_FOUND` bila tidak aktif/tidak ditemukan;
- variant status dan stok ditampilkan untuk memilih kombinasi.

### 6.4 Categories

`GET /api/v1/categories`

Response `200` tanpa pagination:

```json
{
  "data": [
    {
      "id": "...",
      "parent_id": null,
      "name": "Pakaian",
      "slug": "pakaian",
      "description": "...",
      "image_url": "https://cdn.example.com/categories/pakaian.webp",
      "children": []
    }
  ],
  "meta": { "count": 1 },
  "request_id": "..."
}
```

`GET /api/v1/categories/{slug}` mengembalikan detail kategori aktif dan product list cursor-paginated melalui field `products` atau endpoint list dengan query `category`. Implementasi disarankan memakai query terpisah `GET /products?category={slug}` agar pagination konsisten.

### 6.5 Brands

`GET /api/v1/brands` mengembalikan brand aktif tanpa pagination untuk jumlah kecil atau cursor pagination bila katalog besar.

`GET /api/v1/brands/{slug}` mengembalikan:

```json
{
  "data": {
    "id": "...",
    "name": "Acme",
    "slug": "acme",
    "description": "...",
    "logo_url": "https://cdn.example.com/brands/acme.webp",
    "is_active": true
  },
  "meta": {},
  "request_id": "..."
}
```

Produk brand diambil melalui `GET /products?brand=acme`.

## 7. Authentication API

### 7.1 Register

`POST /api/v1/auth/register`

Request:

```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "password": "StrongPassword123!",
  "phone": "+628123456789"
}
```

Validasi: `name` 1-150 karakter, email valid dan lowercase, password minimal 8 karakter, phone opsional maksimum 50 karakter.

Response `201`:

```json
{
  "data": {
    "user": {
      "id": "...",
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "phone": "+628123456789",
      "status": "active",
      "email_verified_at": null,
      "roles": ["customer"],
      "created_at": "2026-09-27T10:30:00Z"
    },
    "email_verification_required": true
  },
  "meta": {},
  "request_id": "..."
}
```

Password tidak pernah dikembalikan. Duplicate email menghasilkan `409 EMAIL_ALREADY_EXISTS`.

### 7.2 Login

`POST /api/v1/auth/login`

Request:

```json
{
  "email": "budi@example.com",
  "password": "StrongPassword123!"
}
```

Response `200` mengembalikan `User` dan mengatur session cookie. Email/password salah menghasilkan `401 INVALID_CREDENTIALS`; jangan membedakan email tidak ada dan password salah.

Account `suspended` menghasilkan `403 ACCOUNT_SUSPENDED`.

### 7.3 Logout

`POST /api/v1/auth/logout`

Response `200`:

```json
{
  "data": { "logged_out": true },
  "meta": {},
  "request_id": "..."
}
```

Logout harus idempotent untuk session yang sudah expired.

### 7.4 Verify Email

`POST /api/v1/auth/verify-email`

Request:

```json
{ "token": "one-time-token-from-email" }
```

Response `200` mengembalikan `email_verified: true`. Token invalid atau expired menghasilkan `400 TOKEN_INVALID` atau `400 TOKEN_EXPIRED`.

### 7.5 Forgot Password

`POST /api/v1/auth/forgot-password`

Request:

```json
{ "email": "budi@example.com" }
```

Response selalu `202` dengan:

```json
{
  "data": { "accepted": true },
  "meta": {},
  "request_id": "..."
}
```

Respons tidak mengungkap apakah email terdaftar.

### 7.6 Reset Password

`POST /api/v1/auth/reset-password`

Request:

```json
{
  "token": "one-time-reset-token",
  "password": "NewStrongPassword123!"
}
```

Response `200` mengembalikan `{ "password_reset": true }`. Token sekali pakai; session lama dicabut.

## 8. Customer Account API

Semua endpoint bagian ini membutuhkan login.

### 8.1 Current User

`GET /api/v1/me`

Response `200` mengembalikan user, roles, dan permission efektif. Password hash dan token tidak pernah dikembalikan.

`PATCH /api/v1/me`

Request field opsional:

```json
{
  "name": "Budi Santoso Updated",
  "phone": "+628123456789"
}
```

Email tidak diubah melalui endpoint ini. Perubahan email memerlukan endpoint dan verifikasi khusus yang belum termasuk MVP.

### 8.2 Addresses

`GET /api/v1/me/addresses` response `200` tanpa pagination berupa `Address[]`.

`POST /api/v1/me/addresses` request memakai `AddressInput`; response `201` mengembalikan `Address`.

`GET /api/v1/me/addresses/{address_id}` response `200` mengembalikan address milik user.

`PATCH /api/v1/me/addresses/{address_id}` menerima field `AddressInput` secara partial.

`DELETE /api/v1/me/addresses/{address_id}` response `200` `{ "deleted": true }`.

`POST /api/v1/me/addresses/{address_id}/set-default` response `200` mengembalikan address dengan `is_default: true`.

Jika address bukan milik user, server mengembalikan `404 RESOURCE_NOT_FOUND`. Satu user hanya boleh memiliki satu default address.

### 8.3 Active Sessions

`GET /api/v1/me/sessions` response `200` cursor pagination atau list kecil berisi:

```json
{
  "id": "...",
  "created_at": "2026-09-27T10:30:00Z",
  "last_used_at": "2026-09-27T11:00:00Z",
  "expires_at": "2026-10-27T10:30:00Z",
  "ip_address": "198.51.100.10",
  "user_agent": "redacted-browser-description",
  "current": true
}
```

`DELETE /api/v1/me/sessions/{session_id}` mencabut session tertentu. User tidak dapat mencabut session user lain.

### 8.4 Customer Orders

`GET /api/v1/me/orders`

Query: `status`, `payment_status`, `limit`, `after`, `before`, `sort` (`-created_at`, `created_at`). Response cursor pagination berisi order summary:

```json
{
  "id": "...",
  "order_number": "NS-20260927-00001",
  "status": "confirmed",
  "payment_status": "paid",
  "item_count": 2,
  "total_amount": "203000.00",
  "currency": "IDR",
  "created_at": "2026-09-27T10:30:00Z"
}
```

`GET /api/v1/me/orders/{order_number}` response `200` mengembalikan `OrderDetail`.

`POST /api/v1/me/orders/{order_number}/cancel`

Request:

```json
{ "reason": "Berubah pikiran" }
```

Response `200` mengembalikan order terbaru. Hanya order `pending` dengan payment belum `paid` yang dapat dibatalkan. Error `409 ORDER_NOT_CANCELLABLE` bila tidak memenuhi syarat.

## 9. Guest Cart dan Customer Cart API

Cart dapat dipanggil tanpa login. Guest diidentifikasi cookie `ns_guest_cart`; backend membuat token opaque dengan entropy tinggi.

### 9.1 Get Cart

`GET /api/v1/cart`

Response `200` mengembalikan `Cart`. Bila belum ada cart, backend boleh membuat cart kosong atau mengembalikan cart kosong dengan `status: active`.

### 9.2 Add Item

`POST /api/v1/cart/items`

Request:

```json
{
  "product_id": "b7f1c8e4-0f7b-4e0f-a2b8-b7af8b0c37b2",
  "variant_id": "4a2c2a8d-20dc-4c1e-bd0c-8d87c9bf3b1e",
  "quantity": 2
}
```

`variant_id` wajib untuk product yang memiliki varian. Untuk product tanpa opsi, variant default tetap direkomendasikan; bila backend mengizinkan `null`, hanya boleh satu item default.

Response `201` mengembalikan Cart lengkap. Harga request diabaikan; server membaca harga dari database.

Error: `422 VARIANT_UNAVAILABLE`, `422 INSUFFICIENT_STOCK`, `422 PRODUCT_UNAVAILABLE`.

### 9.3 Update Item

`PATCH /api/v1/cart/items/{cart_item_id}`

Request:

```json
{ "quantity": 3 }
```

Response `200` mengembalikan Cart lengkap. Quantity harus integer `>= 1` dan tidak boleh melebihi stok yang dapat dibeli.

### 9.4 Remove Item

`DELETE /api/v1/cart/items/{cart_item_id}`

Response `200` mengembalikan Cart terbaru. Item milik cart lain menghasilkan `404`.

### 9.5 Validate Cart

`POST /api/v1/cart/validate`

Request kosong. Response `200`:

```json
{
  "data": {
    "valid": false,
    "cart": {},
    "issues": [
      {
        "cart_item_id": "...",
        "code": "PRICE_CHANGED",
        "message": "Harga produk berubah.",
        "old_unit_price": "99000.00",
        "new_unit_price": "109000.00"
      }
    ]
  },
  "meta": {},
  "request_id": "..."
}
```

Endpoint ini tidak membuat reservation. Reservation hanya dibuat saat order checkout.

### 9.6 Merge Guest Cart

`POST /api/v1/cart/merge`

Membutuhkan login dan guest cart cookie. Request:

```json
{ "strategy": "merge_quantities" }
```

Strategy MVP hanya `merge_quantities`. Item dengan variant sama digabung, kemudian dibatasi stok. Response `200` mengembalikan Cart final dan optional `issues` bila item tidak dapat seluruhnya digabung.

## 10. Coupon dan Checkout API

### 10.1 Validate Coupon

`POST /api/v1/coupons/validate`

Request:

```json
{
  "code": "HEMAT10",
  "cart_id": "..."
}
```

Response `200`:

```json
{
  "data": {
    "valid": true,
    "coupon": {
      "code": "HEMAT10",
      "name": "Hemat 10 Persen",
      "discount_type": "percentage",
      "discount_value": "10.00",
      "maximum_discount_amount": "50000.00"
    },
    "discount_amount": "19800.00",
    "currency": "IDR"
  },
  "meta": {},
  "request_id": "..."
}
```

Kode invalid/expired/limit menghasilkan `422` dengan code spesifik, bukan response `valid: false`, karena request meminta validasi yang gagal secara bisnis.

### 10.2 Checkout Quote

`POST /api/v1/checkout/quote`

Request:

```json
{
  "shipping_address": {
    "recipient_name": "Budi Santoso",
    "phone": "+628123456789",
    "address_line": "Jl. Merdeka No. 10",
    "province": "Jawa Barat",
    "city": "Bandung",
    "district": "Coblong",
    "postal_code": "40132",
    "country": "Indonesia",
    "notes": null
  },
  "billing_address": null,
  "shipping_method": "standard",
  "coupon_code": "HEMAT10"
}
```

Untuk user login, request boleh memakai `shipping_address_id` sebagai pengganti object address. Untuk guest, address object wajib. Response `200`:

```json
{
  "data": {
    "quote_id": "opaque-quote-id",
    "expires_at": "2026-09-27T10:45:00Z",
    "items": [
      {
        "cart_item_id": "...",
        "product_id": "...",
        "variant_id": "...",
        "name": "Kaos Basic - Hitam / M",
        "quantity": 2,
        "unit_price": "99000.00",
        "subtotal": "198000.00"
      }
    ],
    "subtotal": "198000.00",
    "discount_amount": "19800.00",
    "shipping_amount": "15000.00",
    "tax_amount": "0.00",
    "total_amount": "193200.00",
    "currency": "IDR",
    "coupon": { "code": "HEMAT10", "discount_amount": "19800.00" },
    "shipping_method": {
      "code": "standard",
      "name": "Pengiriman standar",
      "amount": "15000.00",
      "estimated_days": "2-5"
    },
    "issues": []
  },
  "meta": {},
  "request_id": "..."
}
```

Quote bukan reservation dan tidak menjamin stok sampai order dibuat. `quote_id` boleh dipakai saat membuat order untuk mendeteksi perubahan, tetapi backend tetap menghitung ulang.

### 10.3 Create Order

`POST /api/v1/checkout/orders`

Header wajib: `Idempotency-Key`.

Request:

```json
{
  "quote_id": "opaque-quote-id",
  "guest_email": "budi@example.com",
  "guest_phone": "+628123456789",
  "shipping_address": {
    "recipient_name": "Budi Santoso",
    "phone": "+628123456789",
    "address_line": "Jl. Merdeka No. 10",
    "province": "Jawa Barat",
    "city": "Bandung",
    "district": "Coblong",
    "postal_code": "40132",
    "country": "Indonesia",
    "notes": null
  },
  "billing_address": null,
  "shipping_method": "standard",
  "coupon_code": "HEMAT10",
  "payment_gateway": "midtrans",
  "notes": "Tolong kirim sore hari"
}
```

Untuk user login, `guest_email` dan `guest_phone` tidak diperlukan; email/phone account menjadi fallback dan request address dapat memakai `shipping_address_id`. Backend wajib:

1. mengunci/validasi cart dan varian;
2. menghitung ulang harga, diskon, ongkir, pajak, dan total;
3. membuat snapshot order item dan address;
4. melakukan reservation stok atomically;
5. mencatat coupon usage dengan aman;
6. membuat payment pending;
7. mengubah cart menjadi `converted`;
8. menginisiasi payment melalui adapter gateway;
9. mengembalikan response idempotent.

Response `201`:

```json
{
  "data": {
    "order": {},
    "payment": {
      "id": "...",
      "gateway": "midtrans",
      "status": "pending",
      "amount": "193200.00",
      "currency": "IDR",
      "payment_method": null,
      "payment_url": "https://app.sandbox.midtrans.com/snap/v4/redirection/...",
      "expired_at": "2026-09-27T11:00:00Z"
    }
  },
  "meta": {},
  "request_id": "..."
}
```

Kegagalan stok menghasilkan `422 INSUFFICIENT_STOCK`. Kegagalan gateway setelah order dibuat menghasilkan `502 PAYMENT_GATEWAY_ERROR`; order tetap harus memiliki state yang dapat direkonsiliasi dan reservation tidak boleh bocor.

### 10.4 Checkout Status

`GET /api/v1/checkout/orders/{order_number}/status`

Endpoint polling aman untuk halaman return payment. Response hanya berisi:

```json
{
  "data": {
    "order_number": "NS-20260927-00001",
    "order_status": "pending",
    "payment_status": "pending",
    "payment_action_required": true,
    "last_updated_at": "2026-09-27T10:30:00Z"
  },
  "meta": {},
  "request_id": "..."
}
```

### 10.5 Retry Payment

`POST /api/v1/checkout/orders/{order_number}/retry-payment`

Header `Idempotency-Key` wajib. Request:

```json
{ "payment_gateway": "midtrans" }
```

Hanya order `pending` dengan payment `failed`, `expired`, atau `cancelled` yang dapat retry, selama reservation/order masih valid atau dapat dibuat ulang secara aman. Response `201` mengembalikan payment instruction terbaru. Order `paid`, `processing`, `shipped`, `completed`, atau `refunded` menghasilkan `409 PAYMENT_NOT_RETRYABLE`.

## 11. Order dan Payment Customer API

### 11.1 Guest Order Detail

`GET /api/v1/guest/orders/{order_number}`

Header atau query token wajib, rekomendasi header:

```http
X-Guest-Order-Token: one-time-or-long-lived-random-access-token
```

Response `200` mengembalikan `OrderDetail` tanpa raw gateway data. Nomor order saja tidak cukup untuk akses.

### 11.2 Payment Detail

`GET /api/v1/orders/{order_number}/payment`

Membutuhkan session owner atau guest order token. Response:

```json
{
  "data": {
    "id": "...",
    "gateway": "midtrans",
    "status": "pending",
    "amount": "193200.00",
    "currency": "IDR",
    "payment_method": null,
    "payment_url": "https://app.sandbox.midtrans.com/snap/v4/redirection/...",
    "expired_at": "2026-09-27T11:00:00Z",
    "paid_at": null
  },
  "meta": {},
  "request_id": "..."
}
```

### 11.3 Payment Status

`GET /api/v1/orders/{order_number}/payment/status` mengembalikan status minimal yang sama dengan checkout status. Browser tidak boleh menentukan paid hanya berdasarkan URL redirect.

## 12. Webhook Payment API

Endpoint ini dipanggil gateway, bukan frontend.

### 12.1 Midtrans

`POST /api/v1/webhooks/midtrans`

Request mengikuti payload Midtrans yang dikonfigurasi, contoh field yang dibutuhkan:

```json
{
  "transaction_status": "settlement",
  "order_id": "NS-20260927-00001",
  "gross_amount": "193200.00",
  "payment_type": "bank_transfer",
  "transaction_id": "midtrans-transaction-id",
  "transaction_time": "2026-09-27 10:35:00",
  "fraud_status": "accept",
  "status_code": "200",
  "signature_key": "gateway-signature"
}
```

Implementasi wajib memvalidasi signature resmi, `order_id`, nominal, gateway, dan mapping status. Payload mentah disimpan pada webhook inbox dengan redaksi dan retention policy.

Response valid yang diterima:

```json
{
  "data": { "accepted": true },
  "meta": {},
  "request_id": "..."
}
```

Signature invalid: `401 PAYMENT_SIGNATURE_INVALID`. Event duplicate yang sudah diproses boleh menghasilkan `200` `{ "accepted": true, "duplicate": true }` agar gateway tidak retry tanpa akhir.

### 12.2 Xendit

`POST /api/v1/webhooks/xendit` disiapkan untuk ekspansi. Header/token verification mengikuti konfigurasi Xendit. Jangan menggabungkan format payload Midtrans dan Xendit pada satu schema internal; gunakan adapter per gateway.

## 13. Admin API: Dashboard dan Catalog

Semua endpoint `/admin/*` membutuhkan session, permission, audit log untuk mutation, dan response redaction. List besar memakai cursor, kecuali dinyatakan offset.

### 13.1 Dashboard

`GET /api/v1/admin/dashboard`

Query opsional: `from`, `to` dalam format ISO 8601. Response tanpa pagination:

```json
{
  "data": {
    "period": { "from": "2026-09-01T00:00:00Z", "to": "2026-09-27T23:59:59Z" },
    "orders": {
      "pending": 4,
      "processing": 8,
      "shipped": 12,
      "completed": 90,
      "cancelled": 3
    },
    "payments": { "paid": 90, "failed": 7, "needs_reconciliation": 1 },
    "low_stock_variants": 5,
    "sales": { "gross": "12500000.00", "refunds": "250000.00", "net": "12250000.00", "currency": "IDR" }
  },
  "meta": {},
  "request_id": "..."
}
```

Permission: `reports.read` atau `super_admin`.

### 13.2 Brands

| Method | Path | Permission | Response |
|---|---|---|---|
| `GET` | `/admin/brands` | `catalog.read` | Cursor list |
| `POST` | `/admin/brands` | `catalog.write` | `201 Brand` |
| `GET` | `/admin/brands/{id}` | `catalog.read` | `200 Brand` |
| `PATCH` | `/admin/brands/{id}` | `catalog.write` | `200 Brand` |
| `DELETE` | `/admin/brands/{id}` | `catalog.write` | `200 deleted result` |

Create request:

```json
{
  "name": "Acme",
  "slug": "acme",
  "description": "Brand pakaian lokal.",
  "logo_url": "https://cdn.example.com/brands/acme.webp",
  "is_active": true
}
```

Patch menerima field yang sama secara optional. `slug` duplicate menghasilkan `409 SLUG_ALREADY_EXISTS`. Delete adalah soft delete dan dapat ditolak bila masih digunakan sesuai policy katalog.

### 13.3 Categories

| Method | Path | Permission | Response |
|---|---|---|---|
| `GET` | `/admin/categories` | `catalog.read` | Tree/list |
| `POST` | `/admin/categories` | `catalog.write` | `201 Category` |
| `GET` | `/admin/categories/{id}` | `catalog.read` | `200 Category` |
| `PATCH` | `/admin/categories/{id}` | `catalog.write` | `200 Category` |
| `DELETE` | `/admin/categories/{id}` | `catalog.write` | `200 deleted result` |

Create request:

```json
{
  "parent_id": null,
  "name": "Pakaian",
  "slug": "pakaian",
  "description": "Semua produk pakaian.",
  "image_url": "https://cdn.example.com/categories/pakaian.webp",
  "is_active": true
}
```

Backend menolak parent dirinya sendiri dan cycle kategori dengan `409 CATEGORY_CYCLE`. Produk pada kategori nonaktif tidak tampil di storefront.

### 13.4 Attributes

| Method | Path | Permission | Response |
|---|---|---|---|
| `GET` | `/admin/attributes` | `catalog.read` | Cursor/list |
| `POST` | `/admin/attributes` | `catalog.write` | `201 Attribute` |
| `GET` | `/admin/attributes/{id}` | `catalog.read` | `200 Attribute` |
| `PATCH` | `/admin/attributes/{id}` | `catalog.write` | `200 Attribute` |
| `DELETE` | `/admin/attributes/{id}` | `catalog.write` | `200 deleted result` |
| `GET` | `/admin/attributes/{id}/values` | `catalog.read` | List `AttributeValue[]` |
| `POST` | `/admin/attributes/{id}/values` | `catalog.write` | `201 AttributeValue` |
| `PATCH` | `/admin/attribute-values/{value_id}` | `catalog.write` | `200 AttributeValue` |
| `DELETE` | `/admin/attribute-values/{value_id}` | `catalog.write` | `200 deleted result` |

Create attribute:

```json
{ "name": "Warna", "slug": "warna" }
```

Create value:

```json
{ "value": "Hitam", "slug": "hitam" }
```

`slug` unique sesuai schema; value unique per attribute. Value yang masih dipakai variant tidak boleh dihapus tanpa policy migrasi.

### 13.5 Products

| Method | Path | Permission | Response |
|---|---|---|---|
| `GET` | `/admin/products` | `catalog.read` | Cursor list |
| `POST` | `/admin/products` | `catalog.write` | `201 ProductDetail` |
| `GET` | `/admin/products/{id}` | `catalog.read` | `200 ProductDetail` |
| `PATCH` | `/admin/products/{id}` | `catalog.write` | `200 ProductDetail` |
| `DELETE` | `/admin/products/{id}` | `catalog.write` | `200 deleted result` |
| `POST` | `/admin/products/{id}/publish` | `catalog.publish` | `200 Product` |
| `POST` | `/admin/products/{id}/unpublish` | `catalog.publish` | `200 Product` |

Create request:

```json
{
  "brand_id": "...",
  "category_id": "...",
  "name": "Kaos Basic",
  "slug": "kaos-basic",
  "description": "Kaos katun.",
  "base_price": "99000.00",
  "base_weight": 250,
  "sku": null,
  "status": "draft"
}
```

Patch boleh mengubah `brand_id`, `category_id`, `name`, `slug`, `description`, base price/weight, dan status sesuai permission. Publikasi harus memvalidasi minimal satu image primary, data harga, dan variant yang valid.

### 13.6 Product Images

Upload langsung ke API:

`POST /api/v1/admin/products/{product_id}/images`

Request `multipart/form-data`:

```text
file: binary image
alt_text: Kaos Basic tampak depan
sort_order: 0
is_primary: true
```

Response `201` mengembalikan `ProductImage` dengan `image_url`. Ukuran, MIME, dan dimensi dibatasi server.

Alternatif yang direkomendasikan:

`POST /api/v1/admin/uploads/presign`

Request:

```json
{ "purpose": "product_image", "content_type": "image/webp", "size_bytes": 240000 }
```

Response:

```json
{
  "data": {
    "upload_id": "...",
    "upload_url": "https://storage.example.com/presigned-url",
    "method": "PUT",
    "headers": { "Content-Type": "image/webp" },
    "expires_at": "2026-09-27T10:40:00Z"
  },
  "meta": {},
  "request_id": "..."
}
```

Setelah upload, image diregistrasikan melalui `POST /admin/products/{id}/images` dengan `upload_id`.

`PATCH /admin/product-images/{id}` menerima `alt_text`, `sort_order`, `is_primary`. `DELETE` melakukan soft delete.

### 13.7 Product Variants

| Method | Path | Permission | Response |
|---|---|---|---|
| `GET` | `/admin/products/{product_id}/variants` | `catalog.read` | List/cursor |
| `POST` | `/admin/products/{product_id}/variants` | `catalog.write` | `201 Variant` |
| `GET` | `/admin/variants/{id}` | `catalog.read` | `200 Variant` |
| `PATCH` | `/admin/variants/{id}` | `catalog.write` | `200 Variant` |
| `DELETE` | `/admin/variants/{id}` | `catalog.write` | `200 deleted result` |

Create request:

```json
{
  "sku": "KSB-BLK-M",
  "name": "Hitam / M",
  "price": "99000.00",
  "compare_at_price": "129000.00",
  "stock_quantity": 12,
  "weight": 250,
  "status": "active",
  "attribute_value_ids": ["...", "..."]
}
```

`sku` global unique. `compare_at_price` harus lebih besar dari price. Kombinasi attribute value pada product tidak boleh duplicate; pelanggaran menghasilkan `409 ATTRIBUTE_COMBINATION_EXISTS`.

Harga dan status variant yang berubah harus diaudit.

### 13.8 Stock Adjustment

`POST /api/v1/admin/variants/{variant_id}/stock-adjustments`

Header `Idempotency-Key` wajib. Request:

```json
{
  "quantity_delta": 10,
  "reason": "Restock supplier",
  "reference": "PO-2026-001"
}
```

Response `200`:

```json
{
  "data": {
    "variant_id": "...",
    "previous_stock_quantity": 12,
    "quantity_delta": 10,
    "stock_quantity": 22,
    "movement_type": "restock",
    "reason": "Restock supplier",
    "created_at": "2026-09-27T10:30:00Z"
  },
  "meta": {},
  "request_id": "..."
}
```

Negative delta tidak boleh membuat stok negatif. Semua movement dibuat otomatis; client tidak boleh menulis `stock_quantity` langsung melalui PATCH variant.

`GET /api/v1/admin/variants/{variant_id}/stock-movements` memakai cursor pagination, query `movement_type`, `from`, `to`.

## 14. Admin Order, Shipment, dan Inventory API

### 14.1 Order List

`GET /api/v1/admin/orders`

Query:

```text
status=pending,confirmed
payment_status=paid
q=NS-20260927-00001
email=budi@example.com
from=2026-09-01T00:00:00Z
to=2026-09-27T23:59:59Z
limit=20&after=...
```

Response cursor pagination berisi OrderSummary. Permission `orders.read`.

### 14.2 Order Detail

`GET /api/v1/admin/orders/{order_id}`

Response `200` berisi `OrderDetail` lengkap, payment redacted, shipments, reservations summary, dan status history. Raw request/response gateway hanya dapat diakses permission khusus dan tidak menjadi response default.

### 14.3 Order Status

`PATCH /api/v1/admin/orders/{order_id}/status`

Request:

```json
{
  "status": "processing",
  "reason": "Pesanan mulai diproses"
}
```

Response `200` order terbaru. State machine:

```text
pending -> confirmed | cancelled
confirmed -> processing
processing -> shipped
shipped -> delivered
delivered -> completed
paid state -> refunded, hanya melalui refund command
```

Status tidak boleh diubah langsung menjadi `shipped` tanpa shipment valid. Invalid transition menghasilkan `409 INVALID_STATUS_TRANSITION`.

### 14.4 Admin Cancel

`POST /api/v1/admin/orders/{order_id}/cancel`

Request:

```json
{ "reason": "Stok rusak saat fulfillment" }
```

Response `200` order terbaru. Backend melepaskan reservation/coupon usage secara idempotent. Order paid membutuhkan refund, bukan endpoint ini, kecuali policy eksplisit mengizinkan.

### 14.5 Shipment

`POST /api/v1/admin/orders/{order_id}/shipments`

Request:

```json
{
  "courier": "JNE",
  "service": "REG",
  "tracking_number": "JNE123456789",
  "shipped_at": "2026-09-27T12:00:00Z",
  "notes": null
}
```

Response `201`:

```json
{
  "data": {
    "id": "...",
    "order_id": "...",
    "courier": "JNE",
    "service": "REG",
    "tracking_number": "JNE123456789",
    "status": "shipped",
    "shipped_at": "2026-09-27T12:00:00Z",
    "delivered_at": null,
    "created_at": "2026-09-27T12:00:00Z",
    "updated_at": "2026-09-27T12:00:00Z"
  },
  "meta": {},
  "request_id": "..."
}
```

Pembuatan shipment memvalidasi order `processing` dan dapat memicu transisi `shipped`. `GET /admin/orders/{order_id}/shipments` mengembalikan list tanpa pagination untuk jumlah shipment kecil. `PATCH /admin/shipments/{shipment_id}` menerima `status`, `tracking_number`, `delivered_at`, `notes`.

### 14.6 Status History

`GET /api/v1/admin/orders/{order_id}/status-history` response list tanpa pagination:

```json
{
  "data": [
    {
      "id": "...",
      "from_status": "confirmed",
      "to_status": "processing",
      "reason": "Mulai diproses",
      "actor_type": "user",
      "actor_id": "...",
      "created_at": "2026-09-27T11:00:00Z"
    }
  ],
  "meta": { "count": 1 },
  "request_id": "..."
}
```

History dibuat server dan tidak dapat diedit/delete melalui API.

## 15. Admin Payment dan Refund API

### 15.1 Payment List

`GET /api/v1/admin/payments`

Query: `gateway`, `status`, `payment_method`, `order_number`, `from`, `to`, `limit`, `after`.

Response cursor pagination berisi:

```json
{
  "id": "...",
  "order_id": "...",
  "order_number": "NS-20260927-00001",
  "gateway": "midtrans",
  "status": "paid",
  "amount": "193200.00",
  "currency": "IDR",
  "payment_method": "bank_transfer",
  "external_payment_id": "redacted-or-support-safe-id",
  "paid_at": "2026-09-27T10:35:00Z",
  "created_at": "2026-09-27T10:30:00Z"
}
```

Permission `payments.read`.

### 15.2 Payment Detail and Transactions

`GET /api/v1/admin/payments/{payment_id}` mengembalikan payment detail, order reference, dan transaction summary.

`GET /api/v1/admin/payments/{payment_id}/transactions` memakai cursor pagination dan mengembalikan:

```json
{
  "id": "...",
  "transaction_id": "gateway-transaction-id",
  "reference_id": "gateway-reference-id",
  "status": "success",
  "amount": "193200.00",
  "payment_method": "bank_transfer",
  "response_code": "200",
  "response_message": "Success",
  "processed_at": "2026-09-27T10:35:00Z",
  "created_at": "2026-09-27T10:35:00Z"
}
```

Raw request/response tidak dikembalikan default. Endpoint raw internal terpisah harus dilindungi permission dan redaction.

### 15.3 Reconcile

`POST /api/v1/admin/payments/{payment_id}/reconcile`

Header `Idempotency-Key` disarankan. Request kosong atau:

```json
{ "reason": "Payment status mismatch" }
```

Response `200` mengembalikan payment terbaru, `reconciled: true`, dan `checked_at`. Jika gateway timeout, response `504 UPSTREAM_TIMEOUT`; jangan mengubah status payment menjadi failed hanya karena timeout.

Permission `payments.reconcile`.

### 15.4 Refund

`POST /api/v1/admin/payments/{payment_id}/refunds`

Header `Idempotency-Key` wajib. Request MVP full refund:

```json
{
  "amount": "193200.00",
  "reason": "Pesanan dibatalkan oleh toko",
  "external_refund_id": "manual-refund-20260927-01"
}
```

Response `201`:

```json
{
  "data": {
    "id": "...",
    "payment_id": "...",
    "amount": "193200.00",
    "currency": "IDR",
    "status": "pending",
    "reason": "Pesanan dibatalkan oleh toko",
    "external_refund_id": "manual-refund-20260927-01",
    "created_at": "2026-09-27T12:00:00Z",
    "processed_at": null
  },
  "meta": {},
  "request_id": "..."
}
```

Jika refund sukses, payment menjadi `refunded` untuk full amount atau `partially_refunded` untuk partial amount. Amount kumulatif tidak boleh melebihi paid amount. Pada MVP operasi gateway dapat manual, tetapi status hasilnya wajib dicatat dan diaudit.

`GET /api/v1/admin/payments/{payment_id}/refunds` list tanpa pagination untuk refund kecil.

## 16. Admin Coupon API

### 16.1 List dan Detail

`GET /api/v1/admin/coupons` cursor pagination. Query: `q`, `is_active`, `discount_type`, `starts_before`, `expires_after`.

`GET /api/v1/admin/coupons/{id}` mengembalikan coupon detail dan usage summary.

### 16.2 Create

`POST /api/v1/admin/coupons`

Request:

```json
{
  "code": "HEMAT10",
  "name": "Hemat 10 Persen",
  "description": "Diskon pelanggan baru.",
  "discount_type": "percentage",
  "discount_value": "10.00",
  "minimum_order_amount": "100000.00",
  "maximum_discount_amount": "50000.00",
  "usage_limit": 100,
  "starts_at": "2026-09-27T00:00:00Z",
  "expires_at": "2026-10-27T23:59:59Z",
  "is_active": true
}
```

`code` dinormalisasi uppercase untuk display dan unique case-insensitive. Percentage `0 < value <= 100`; fixed `value > 0`. `usage_count` tidak boleh dikirim.

Response `201` mengembalikan Coupon.

### 16.3 Update/Delete

`PATCH /api/v1/admin/coupons/{id}` menerima semua field create kecuali `usage_count` dan code yang sudah dipakai, sesuai policy.

`DELETE /api/v1/admin/coupons/{id}` soft delete/nonaktifkan coupon. Order lama tetap menyimpan snapshot `discount_amount`.

`GET /api/v1/admin/coupons/{id}/usage` cursor pagination mengembalikan order number, discount amount, dan created time. Jangan expose email lengkap bila tidak dibutuhkan.

## 17. Admin Customer, User, Role, Permission API

### 17.1 Customers

`GET /api/v1/admin/customers` cursor pagination. Query `q`, `status`, `created_from`, `created_to`.

`GET /api/v1/admin/customers/{user_id}` mengembalikan profil customer, roles, order summary, dan address yang telah disamarkan sesuai permission.

`PATCH /api/v1/admin/customers/{user_id}/status`

Request:

```json
{ "status": "suspended", "reason": "Aktivitas mencurigakan" }
```

Status valid `active`, `inactive`, `suspended`. Suspend mencabut session aktif dan mencatat audit.

### 17.2 Admin Users

`GET /api/v1/admin/users` cursor pagination untuk user yang memiliki role admin.

`POST /api/v1/admin/users`

Request:

```json
{
  "name": "Operator Toko",
  "email": "operator@example.com",
  "phone": "+628123456789",
  "role_ids": ["..."],
  "send_invitation": true
}
```

Password awal tidak dikirim melalui API; invitation/reset flow menetapkan password. Response `201` mengembalikan user tanpa secret.

`GET /api/v1/admin/users/{id}` mengembalikan user dan roles.

`PATCH /api/v1/admin/users/{id}` dapat mengubah name, phone, dan roles melalui endpoint khusus; email change memerlukan verification flow.

`PATCH /api/v1/admin/users/{id}/status` mengubah active/inactive/suspended.

### 17.3 Roles

`GET /api/v1/admin/roles` cursor/list.

`POST /api/v1/admin/roles`

```json
{
  "name": "Catalog Admin",
  "slug": "catalog_admin",
  "description": "Mengelola katalog"
}
```

`GET/PATCH/DELETE /api/v1/admin/roles/{id}` memakai resource role. Role system seperti `super_admin` tidak dapat dihapus tanpa prosedur khusus.

`POST /api/v1/admin/users/{user_id}/roles`

```json
{ "role_id": "..." }
```

`DELETE /api/v1/admin/users/{user_id}/roles/{role_id}` menghapus assignment secara soft delete.

### 17.4 Permissions

`GET /api/v1/admin/permissions` response tanpa pagination atau cursor bila jumlah besar.

`POST /api/v1/admin/roles/{role_id}/permissions`

```json
{ "permission_id": "..." }
```

`DELETE /api/v1/admin/roles/{role_id}/permissions/{permission_id}` menghapus assignment. Semua operasi RBAC membutuhkan `rbac.write` dan mencegah super admin terakhir kehilangan akses.

## 18. Audit Log dan Reports API

### 18.1 Audit Logs

`GET /api/v1/admin/audit-logs`

Permission `audit.read`. Query: `actor_id`, `action`, `entity_type`, `entity_id`, `from`, `to`, `limit`, `after`.

Response cursor pagination:

```json
{
  "id": "...",
  "actor": { "id": "...", "name": "Operator Toko" },
  "action": "inventory.adjusted",
  "entity_type": "product_variant",
  "entity_id": "...",
  "summary": "Stok bertambah 10",
  "before": { "stock_quantity": 12 },
  "after": { "stock_quantity": 22 },
  "ip_address": "198.51.100.10",
  "created_at": "2026-09-27T10:30:00Z"
}
```

Secret, password, token, raw payment payload, dan PII yang tidak perlu harus direda

### 18.2 Sales Report

`GET /api/v1/admin/reports/sales`

Query wajib `from`, `to`; opsional `group_by=day|week|month`, `status=paid|completed`.

Response tanpa pagination:

```json
{
  "data": {
    "period": { "from": "2026-09-01T00:00:00Z", "to": "2026-09-27T23:59:59Z" },
    "currency": "IDR",
    "summary": {
      "orders": 93,
      "paid_orders": 90,
      "gross_sales": "12500000.00",
      "discounts": "500000.00",
      "shipping": "750000.00",
      "refunds": "250000.00",
      "net_sales": "12250000.00"
    },
    "series": [
      {
        "period": "2026-09-27",
        "orders": 8,
        "net_sales": "1100000.00"
      }
    ]
  },
  "meta": {},
  "request_id": "..."
}
```

Revenue server-side berdasarkan payment/order rules; browser analytics bukan sumber laporan finansial.

## 19. Health API

Endpoint health berada di luar `/api/v1` agar orchestration mudah:

`GET /health/live` response `200`:

```json
{ "data": { "status": "ok" }, "meta": {}, "request_id": "..." }
```

`GET /health/ready` memeriksa dependency wajib seperti PostgreSQL. Jika tidak ready response `503 SERVICE_UNAVAILABLE`. Jangan mengembalikan connection string atau detail dependency.

## 20. Internal Worker API

Endpoint internal tidak boleh diakses browser/public internet. Gunakan private network, mTLS atau service credential, dan audit.

Endpoint yang boleh dibuat bila worker memakai HTTP:

| Method | Path | Fungsi |
|---|---|---|
| `POST` | `/internal/jobs/carts/expire` | Tandai cart expired/abandoned |
| `POST` | `/internal/jobs/orders/expire` | Cancel order payment expired |
| `POST` | `/internal/jobs/reservations/release` | Release reservation expired |
| `POST` | `/internal/jobs/payments/reconcile` | Rekonsiliasi payment pending |
| `POST` | `/internal/jobs/emails/retry` | Retry email gagal |
| `POST` | `/internal/webhooks/{gateway}/replay/{event_id}` | Replay event yang aman |

Lebih disarankan worker memakai queue/job scheduler langsung daripada endpoint HTTP publik. Operasi internal harus idempotent dan mengembalikan jumlah record diproses:

```json
{
  "data": {
    "job": "reservations.release",
    "processed": 12,
    "succeeded": 12,
    "failed": 0
  },
  "meta": {},
  "request_id": "..."
}
```

## 21. Matrix Endpoint Ringkas

| Domain | Endpoint utama | Auth |
|---|---|---|
| Storefront | `/home`, `/products`, `/categories`, `/brands` | Public |
| Auth | `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/verify-email`, `/auth/forgot-password`, `/auth/reset-password` | Public/session |
| Account | `/me`, `/me/addresses`, `/me/sessions`, `/me/orders` | Customer |
| Cart | `/cart`, `/cart/items`, `/cart/merge`, `/cart/validate` | Guest/customer |
| Checkout | `/checkout/quote`, `/checkout/orders`, `/checkout/orders/{number}/retry-payment` | Guest/customer |
| Customer order | `/guest/orders/{number}`, `/orders/{number}/payment` | Owner/guest token |
| Webhook | `/webhooks/midtrans`, `/webhooks/xendit` | Gateway signature |
| Admin catalog | `/admin/brands`, `/admin/categories`, `/admin/attributes`, `/admin/products`, `/admin/variants` | RBAC |
| Admin order | `/admin/orders`, `/admin/shipments`, status history | RBAC |
| Admin payment | `/admin/payments`, reconcile, refunds | RBAC |
| Admin marketing | `/admin/coupons` | RBAC |
| Admin access | `/admin/customers`, `/admin/users`, `/admin/roles`, `/admin/permissions` | RBAC |
| Admin insight | `/admin/dashboard`, `/admin/reports`, `/admin/audit-logs` | RBAC |
| Internal | `/internal/jobs/*`, webhook replay | Private service auth |

## 22. Aturan State dan Konsistensi

### 22.1 Order Status

| Current | Allowed next state | Actor |
|---|---|---|
| `pending` | `confirmed` | Payment handler/admin policy |
| `pending` | `cancelled` | Customer/admin/expiry job |
| `confirmed` | `processing` | Order admin |
| `processing` | `shipped` | Shipment command |
| `shipped` | `delivered` | Admin/courier integration |
| `delivered` | `completed` | Customer/admin/job |
| Paid order | `refunded` | Refund handler/admin |

Semua transisi menyimpan status history. Transition command harus atomic bersama side effect yang relevan.

### 22.2 Payment Status

| Gateway event | Payment status | Order effect |
|---|---|---|
| Created | `pending` | Order tetap `pending` |
| Settlement/capture sukses | `paid` | Order `confirmed`, reservation commit |
| Denied/failure | `failed` | Order tetap pending atau dapat retry |
| Expired | `expired` | Cancel order, release reservation |
| Cancelled | `cancelled` | Cancel order sesuai policy |
| Full refund | `refunded` | Order `refunded` |
| Partial refund | `partially_refunded` | Order tetap fulfillment state atau policy refund |

Webhook lama tidak boleh menurunkan payment yang sudah `paid`, `refunded`, atau terminal tanpa reconciliation override yang diaudit.

### 22.3 Inventory

API tidak memberi client kemampuan reserve/commit/release manual. Semua dilakukan service:

```text
available stock -> reserved -> committed
available stock <- released
```

Reservation expiry, payment expiry, cancellation, dan webhook duplicate harus aman bila diproses lebih dari sekali.

## 23. Validasi Payload Umum

- unknown JSON field ditolak atau diabaikan secara konsisten; rekomendasi: tolak pada admin/mutasi agar typo tidak diam-diam diterima;
- string whitespace di-trim sebelum validasi;
- email lowercase dan Unicode normalization sesuai kebutuhan;
- slug lowercase, URL-safe, dan unik;
- integer quantity tidak boleh decimal;
- amount harus string decimal dengan maksimum 2 digit pecahan untuk IDR;
- `created_at`, `updated_at`, dan status history server-generated dan read-only;
- `id`, `deleted_at`, `usage_count`, payment status, order status, dan stock movement tidak boleh diubah dari field generic PATCH;
- pagination parameter invalid menghasilkan `400`, bukan fallback diam-diam;
- request body terlalu besar menghasilkan `413 PAYLOAD_TOO_LARGE`.

## 24. Mapping Schema ke API

| Tabel schema | Representasi API |
|---|---|
| `users` | `User`, `/me`, admin customer/user |
| `roles` | `Role`, admin RBAC |
| `permissions` | `Permission`, admin RBAC |
| `user_roles` | Nested roles atau role assignment commands |
| `role_permissions` | Nested permissions atau permission commands |
| `brands` | Brand public/admin |
| `categories` | Category tree/public/admin |
| `products` | Product summary/detail/admin |
| `product_images` | Nested images dan upload commands |
| `attributes` | Attribute admin dan product detail |
| `attribute_values` | Nested values/variant attributes |
| `product_variants` | Nested/detail variant dan stock commands |
| `variant_attribute_values` | Nested `attribute_values` pada variant |
| `carts` | Cart resource |
| `cart_items` | Nested cart items |
| `addresses` | Customer address book |
| `orders` | Order summary/detail |
| `order_items` | Nested order items |
| `order_addresses` | Nested immutable snapshots |
| `payments` | Customer-safe payment/admin payment |
| `payment_transactions` | Admin transaction list |
| `coupons` | Coupon validation/admin coupon |
| `order_coupons` | Nested coupon allocation/order discount |

Tabel tambahan yang direkomendasikan PRD (`sessions`, `inventory_reservations`, `shipments`, `order_status_histories`, `payment_webhook_events`, `idempotency_keys`, `audit_logs`, `refunds`, `inventory_movements`) sebagian besar internal state. Hanya shipment, refund result, status history read, stock movement read, dan audit read yang diekspos kepada role sesuai permission.

## 25. OpenAPI dan Implementasi

Backend wajib menghasilkan OpenAPI 3.1 dari kontrak ini atau memelihara file `openapi.yaml` yang ekuivalen. Setiap perubahan endpoint harus:

1. mengubah OpenAPI dan dokumen ini dalam pull request yang sama;
2. mempertahankan backward compatibility dalam major version;
3. menambahkan contract test untuk request/response/error;
4. menguji permission dan ownership;
5. menguji retry/idempotency untuk mutasi transaksi;
6. menguji webhook duplicate dan out-of-order;
7. mengenerate TypeScript client/type untuk Next.js setelah kontrak disetujui.

Minimal contract test mencakup:

- semua response sukses memiliki `data`, `meta`, `request_id`;
- semua error memiliki Problem Details fields dan `request_id`;
- list public/admin memiliki pagination sesuai kontrak;
- money selalu string decimal;
- secret/raw gateway data tidak muncul pada response customer;
- guest tidak dapat membaca order tanpa guest token;
- admin tanpa permission menerima `403`;
- checkout retry dengan key sama tidak membuat order kedua.
