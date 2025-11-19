# Utility Bill Management System

## Overview
**Utility Bill Management System** is a full-stack application built with Node.js and Express.js that allows users to securely manage and pay monthly utility bills such as **Electricity, Gas, Water, and Internet**. The system supports authentication, PDF invoice generation, and real-time bill tracking.  

## Key Features
- User authentication with JWT  
- Manage and track multiple utility bills  
- Secure and scalable backend using Express.js and MongoDB  
- Generate PDF invoices for bills using PDFKit  
- Handle cross-origin requests with CORS  
- Cookie management for session handling  

## Tech Stack & Dependencies

**Backend & Server:**  
- Node.js  
- Express.js (`^5.1.0`)  
- MongoDB with Mongoose (`^8.19.3`)  

**Authentication & Security:**  
- JSON Web Token (`^9.0.2`)  
- Cookie-parser (`^1.4.7`)  

**Utilities:**  
- Dotenv (`^17.2.3`) for environment variables  
- PDFKit (`^0.17.2`) for invoice generation  
- CORS (`^2.8.5`)  

**Other:**  
- `cros` (`^1.1.0`)  

## Getting Started

1. Clone the repository:  
```bash
git clone https://github.com/tamim127/bill-management-system-server/

2. npm install
3. nodemon index.js
