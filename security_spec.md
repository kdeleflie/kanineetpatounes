# Security Specification - Ka'nine et Patounes

## 1. Data Invariants
- Public users can read all configuration, services, features, and links.
- Only the administrator (`fdeleflie@gmail.com`) can create, update, or delete any document.
- All writes must come from a verified email account.
- String fields must stay within reasonable size limits (e.g., 500 characters for names, 5000 for descriptions).
- Timestamps like `updatedAt` (if used) must be server-validated.

## 2. The "Dirty Dozen" Payloads (Deny Test Cases)

1. **Unauthenticated Write**: Attempt to update `settings/site_config` without being signed in.
2. **Non-Admin Write**: Signed in as `user@gmail.com`, attempt to update `services/some-id`.
3. **Unverified Email Write**: Signed in as `fdeleflie@gmail.com` but `email_verified` is false.
4. **Identity Spoofing**: Signed in as `attacker@gmail.com`, attempt to write with a payload claiming `fdeleflie@gmail.com` in a field.
5. **Oversized String (Settings)**: Admin attempts to set `name` to a 2MB string.
6. **Oversized String (Services)**: Admin attempts to set `description` to a 2MB string.
7. **Invalid Type (Price)**: Admin attempts to set `price` to a number instead of a string.
8. **Invalid Enum (Category)**: Admin attempts to set `category` to "invalid_cat" in a service.
9. **Shadow Field**: Admin attempts to add an undocumented field `isVerified: true` to a service document.
10. **ID Poisoning**: Admin attempts to create a document with a 2KB junk string as the ID.
11. **Malicious Path**: Admin attempts to write to a path outside the defined collections (e.g., `/secrets/admin`).
12. **Status Shortcutting**: (Not heavily applicable here as there are no status workflows, but let's say deleting the entire `settings` collection should be protected/denied if not carefully handled).

## 3. Test Runner Concept
The tests will ensure that any write operation not performed by the verified admin with valid data is rejected.
