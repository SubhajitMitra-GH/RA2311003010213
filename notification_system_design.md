# Notification System Design (Backend Track)

---

# 🔥 Stage 1 — API Design

## Core Features

* Send Notification
* Get Notifications
* Mark Notification as Read
* Delete Notification

---

## Authentication

All APIs are protected using:

```http
Authorization: Bearer <token>
```

---

## 1. Send Notification

POST /notifications

Request:

```json
{
  "userId": "string",
  "type": "Event | Result | Placement",
  "message": "string"
}
```

Response:

```json
{
  "id": "uuid",
  "status": "sent"
}
```

---

## 2. Get Notifications

GET /notifications?userId=123

Response:

```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "Event",
      "message": "string",
      "isRead": false,
      "createdAt": "timestamp"
    }
  ]
}
```

---

## 3. Mark as Read

PUT /notifications/:id/read

---

## 4. Delete Notification

DELETE /notifications/:id

---

## Real-time Notification Design

Two approaches:

### WebSockets (Preferred)

* Persistent connection
* Server pushes updates instantly
* Low latency

### Polling (Fallback)

* Client requests every few seconds
* Higher load
* Simpler implementation

---

# 🔥 Stage 2 — Database Design

## Database Choice

PostgreSQL

### Why?

* Structured schema
* ACID compliance
* Strong indexing

---

## Schema

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id INT,
  type VARCHAR(20),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);
```

---

## Indexing

```sql
CREATE INDEX idx_notifications_user
ON notifications(user_id, is_read, created_at DESC);
```

---

## Scaling Problems

* Large number of rows
* Slow filtering queries
* High read load

---

## Solutions

* Indexing
* Partitioning tables by time
* Archiving old records

---

# 🔥 Stage 3 — Query Optimization

## Given Query

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;
```

---

## Problems

* `SELECT *` → unnecessary data
* No index → full table scan
* Sorting → expensive on large data

---

## Optimized Query

```sql
SELECT id, message, createdAt
FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC
LIMIT 50;
```

---

## Index

```sql
CREATE INDEX idx_notifications
ON notifications(studentID, isRead, createdAt DESC);
```

---

## Why Not Index Every Column?

* Slows insert/update operations
* Increases storage usage
* Only frequently queried fields should be indexed

---

## Placement Query

```sql
SELECT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

---

# 🔥 Stage 4 — Performance Optimization

## Problem

Frequent reads overload database.

---

## Solutions

1. Caching (Redis)
2. Pagination
3. Lazy loading
4. WebSockets

---

## Trade-offs

* Cache → stale data
* Redis → extra infra
* WebSockets → complexity

---

# 🔥 Stage 5 — System Redesign

## Problems

* Sequential processing
* No retry
* Single failure breaks flow

---

## Solution: Queue-based Architecture

Use Kafka / RabbitMQ

---

## Flow

1. Push jobs into queue
2. Workers consume jobs
3. Retry failed jobs

---

## Pseudocode

```js
function notifyAll(users, message) {
  for (const user of users) {
    queue.push({ user, message });
  }
}
```

Worker:

```js
function process(job) {
  try {
    sendEmail(job.user);
    saveToDatabase(job);
    pushNotification(job.user);
  } catch (err) {
    retry(job);
  }
}
```

---

# 🔥 Stage 6 — Priority Notifications

## Logic

Priority order:

* Placement > Result > Event

Then:

* Sort by latest timestamp

---

## Code

```js
const getPriority = (type) => {
  if (type === "Placement") return 3;
  if (type === "Result") return 2;
  return 1;
};

const getTopNotifications = (notifications, n = 10) => {
  return notifications
    .sort((a, b) => {
      if (getPriority(b.Type) !== getPriority(a.Type)) {
        return getPriority(b.Type) - getPriority(a.Type);
      }
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, n);
};
```

---

## Explanation

* Higher priority notifications appear first
* Among same type, latest ones are prioritized
* Efficient sorting ensures scalability

---

# ✅ Conclusion

This system ensures:

* Efficient notification delivery
* Scalable architecture
* Optimized database queries
* Real-time communication support
* Proper prioritization

---
