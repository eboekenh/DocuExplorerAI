# DocuWeb App - API Documentation

**Product**: DocuWeb - Interactive Document Platform  
**Version**: 1.0.0  
**Date**: April 13, 2026  
**Document Type**: API Reference & Integration Guide  
**Audience**: Developers, Integrators, Technical Partners  

## API Overview

DocuWeb utilizes Supabase as its Backend-as-a-Service (BaaS) platform, providing RESTful APIs for all data operations. This document covers the database schema, API endpoints, authentication methods, and integration guidelines.

## Base URL and Authentication

### API Base URL
```
Production: https://your-project-id.supabase.co/rest/v1/
Staging: https://staging-project-id.supabase.co/rest/v1/
```

### Authentication

All API requests require authentication via JWT tokens provided by Supabase Auth.

#### Authentication Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
apikey: <supabase_anon_key>
```

## API Endpoints

### Session Management

#### GET /sessions - List User Sessions
Retrieves all sessions for the authenticated user.

**Request:**
```http
GET /sessions?select=id,document_title,updated_at,lang&order=updated_at.desc
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "document_title": "Research Paper Analysis",
    "updated_at": "2026-04-13T10:30:00.000Z",
    "lang": "en"
  }
]
```

---

**Document Owner**: API Team Lead  
**Last Updated**: April 13, 2026  
**Next Review**: May 13, 2026