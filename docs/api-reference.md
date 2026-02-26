# API Documentation - Rengy

Generated from Postman collection: `Rengy.postman_collection 10.json`

## Overview

- Collection name: **Rengy**
- Endpoints documented: **194**
- Source schema: https://schema.getpostman.com/json/collection/v2.1.0/collection.json
- Production API base URL: `https://api.rengy.in/api/v1`

### Methods

- DELETE: 20
- GET: 79
- POST: 65
- PUT: 30

## Collection Variables

| Variable | Value |
|---|---|
| id | 1 |
| base_url | https://template.postman-echo.com |

## Table of Contents

- [Alerts](#alerts)
- [Chat](#chat)
- [Common](#common)
- [Content](#content)
- [Dashboard](#dashboard)
- [Design flow](#design-flow)
- [Dispatch Management](#dispatch-management)
- [Faqs](#faqs)
- [Inventory](#inventory)
- [Large Image Upload](#large-image-upload)
- [Leads](#leads)
- [Loan](#loan)
- [Loan Providers](#loan-providers)
- [Login](#login)
- [Menu](#menu)
- [Notifications](#notifications)
- [Payment](#payment)
- [Permissions](#permissions)
- [Projects](#projects)
- [Push Notification](#push-notification)
- [Raise Request](#raise-request)
- [Rating & Review](#rating-review)
- [Request Installation](#request-installation)
- [Roles](#roles)
- [Service Requests](#service-requests)
- [Site Survey](#site-survey)
- [Solarman](#solarman)
- [Subscription](#subscription)
- [Technicians](#technicians)
- [Tickets](#tickets)
- [User](#user)
- [User Subscription](#user-subscription)
- [Vehicles](#vehicles)
- [Vendors](#vendors)

## Alerts

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/alerts | None |
| Delete | DELETE | {{local}}/api/v1/alerts/1 | None |
| List | GET | {{local}}/api/v1/alerts?search= | None |
| Show | GET | {{local}}/api/v1/alerts/3 | Bearer token |
| update | PUT | {{local}}/api/v1/alerts/2 | None |
| Update read/unread | PUT | {{local}}/api/v1/alerts | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/alerts
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| title | text | Pending Vendor Confirmation |
| description | text | 12 hrs after loan pre-approval if vendor not acknowledged |
| priorityId | text | 7 |
| createdBy | text | 70 |
| isRead | text | false |

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/alerts/1
- Auth: **None**

**Description**

This is a DELETE request, and it is used to delete data that was previously created via a POST request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful DELETE request typically returns a `200 OK`, `202 Accepted`, or `204 No Content` response code.

**Request Body**

Mode: raw

### List

- Method: **GET**
- URL: {{local}}/api/v1/alerts?search=
- Auth: **None**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Query Parameters**

| Param | Value |
|---|---|
| search |  |

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/alerts/3
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### update

- Method: **PUT**
- URL: {{local}}/api/v1/alerts/2
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| title | text | Payment failed |
| description | text | Your recent payment attempt has failed. |

### Update read/unread

- Method: **PUT**
- URL: {{local}}/api/v1/alerts
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| action | text | unread |
| userId | text | 70 |
| ids | text | 2 |
| ids | text | 3 |

## Chat

| Name | Method | URL | Auth |
|---|---|---|---|
| Create Channel | POST | {{local}}/api/v1/chats/create-channel | None |
| Create Chat | POST | {{local}}/api/v1/chats/create-lead-message | None |
| Cron Job check | POST | {{local}}/api/v1/chats/create-lead-message | None |
| New Request | GET |  | None |
| User based Channels | POST | {{local}}/api/v1/chats/user-channel-list | None |
| User chat messages | POST | {{local}}/api/v1/chats/user-chat-messages | None |

### Create Channel

- Method: **POST**
- URL: {{local}}/api/v1/chats/create-channel
- Auth: **None**

**Request Body**

Mode: raw
```json
{
  "collectionName":"leadChats",
  "leadId":253,
  "participants":[
    { "userId": 172, "userName":"Vendor"},
    { "userId": 173, "userName":"Naveen"}
  ]
}
```

### Create Chat

- Method: **POST**
- URL: {{local}}/api/v1/chats/create-lead-message
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| leadId | text | 154 |
| senderId | text | 3 |
| receiverIds | text | [123] |
| userType | text | 2 |
| message | text | Hello |
| channelId | text | FrcAy2ecPe5sCX8b4PlR |
| collectionName | text | leadChats |

### Cron Job check

- Method: **POST**
- URL: {{local}}/api/v1/chats/create-lead-message
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| email | text | karthik@coderzvisiontech.com |
| type | text | newsletter |

### New Request

- Method: **GET**
- URL: 
- Auth: **None**

**Request Body**

None

### User based Channels

- Method: **POST**
- URL: {{local}}/api/v1/chats/user-channel-list
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "userId": 81,
    "limit": 1,
    "page": 2,
    "collectionName": "leadChats"
}
```

### User chat messages

- Method: **POST**
- URL: {{local}}/api/v1/chats/user-chat-messages
- Auth: **None**

**Request Body**

Mode: raw
```json
{
  "channelId": "mkYC4LcgAiPbUM3UJ1VD",
  "userId": 249,
  "limit": 10,
  "page": 1
}
```

## Common

| Name | Method | URL | Auth |
|---|---|---|---|
| Account Settings | POST | {{local}}/api/v1/common/account-settings | None |
| Admin Approval List | GET | {{local}}/api/v1/common/admin/approval? | None |
| All cities | GET | {{local}}/api/v1/common/cities | None |
| Already Using Solar | PUT | {{local}}/api/v1/common/already-using-solar | None |
| AR VR Assets | POST | {{local}}/api/v1/common/arvr-assets | None |
| Contact List | GET | {{local}}/api/v1/common/contact/list?search=&export= | None |
| Contact Us | POST | {{local}}/api/v1/common/contact-us | None |
| Distance Calculation | POST | {{local}}/api/v1/common/distance | None |
| File or Zip Download | GET | {{local}}/api/v1/common/files/download?module=loans&ids=22&fields=documents | None |
| Get Acc Settings | GET | {{local}}/api/v1/common/account-settings/11 | None |
| Search City | GET | {{local}}/api/v1/common/city?countryId=101&search=tho&per_page=10 | None |
| Search Data | GET | {{local}}/api/v1/common/search?search=pravi&userId= | None |
| Search module | GET | {{local}}/api/v1/common/search?search=guru&userId= | None |
| Search State | GET | {{local}}/api/v1/common/states?id=101&search= | None |
| Update Stage | POST | {{local}}/api/v1/common/stage/update | None |

### Account Settings

- Method: **POST**
- URL: {{local}}/api/v1/common/account-settings
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "userId":11,
    "settings": {
        "notificationTone": true,
        "enableNotifications": true,
        "vibration": false,
        "popUpNotification": false,
        "enableGPS": true
    }
}
```

### Admin Approval List

- Method: **GET**
- URL: {{local}}/api/v1/common/admin/approval?
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
|  |  |

**Request Body**

None

### All cities

- Method: **GET**
- URL: {{local}}/api/v1/common/cities
- Auth: **None**

**Request Body**

None

### Already Using Solar

- Method: **PUT**
- URL: {{local}}/api/v1/common/already-using-solar
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "id":66,
    // "netmeterNumber": ["45","54","56"]
    "moduleId":38,
    "inverterId":45
}
```

### AR VR Assets

- Method: **POST**
- URL: {{local}}/api/v1/common/arvr-assets
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "structure": 32,
    "orientation": 80,
    // "capacity": "6",
    "roof": 27
}
```

### Contact List

- Method: **GET**
- URL: {{local}}/api/v1/common/contact/list?search=&export=
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| search |  |
| export |  |

**Request Body**

None

### Contact Us

- Method: **POST**
- URL: {{local}}/api/v1/common/contact-us
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "name":"Guru Arjun",
    "email":"ajju@gmail.com",
    "mobileNumber":"2222299933",
    "countryId":101,
    "requestCategory":"General",
    "message":"This is something big to enquire."
}
```

### Distance Calculation

- Method: **POST**
- URL: {{local}}/api/v1/common/distance
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "requestId": 11,
    
    //vendor's current location 
    "latitude": 13.7642,
    "longitude": 80.1348
}
```

### File or Zip Download

- Method: **GET**
- URL: {{local}}/api/v1/common/files/download?module=loans&ids=22&fields=documents
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| module | loans |
| ids | 22 |
| fields | documents |

**Request Body**

None

### Get Acc Settings

- Method: **GET**
- URL: {{local}}/api/v1/common/account-settings/11
- Auth: **None**

**Request Body**

None

### Search City

- Method: **GET**
- URL: {{local}}/api/v1/common/city?countryId=101&search=tho&per_page=10
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| countryId | 101 |
| search | tho |
| per_page | 10 |

**Request Body**

None

### Search Data

- Method: **GET**
- URL: {{local}}/api/v1/common/search?search=pravi&userId=
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| search | pravi |
| userId |  |

**Request Body**

None

### Search module

- Method: **GET**
- URL: {{local}}/api/v1/common/search?search=guru&userId=
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| search | guru |
| userId |  |

**Request Body**

None

### Search State

- Method: **GET**
- URL: {{local}}/api/v1/common/states?id=101&search=
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| id | 101 |
| search |  |

**Request Body**

None

### Update Stage

- Method: **POST**
- URL: {{local}}/api/v1/common/stage/update
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "leadId":9,
    "stageId": 8,
    "subStageId": 4,
    "status": "File Created"
}
```

## Content

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/content | None |
| Delete | DELETE | {{local}}/api/v1/content/2 | None |
| List | GET | {{local}}/api/v1/content | None |
| Update | PUT | {{local}}/api/v1/content/1 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/content
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| title | text | Get a solar loan for Installation |
| description | text | Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries. |
| images[] | file | [file] |
| pageType | text | intro_screens |

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/content/2
- Auth: **None**

**Request Body**

None

### List

- Method: **GET**
- URL: {{local}}/api/v1/content
- Auth: **None**

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/content/1
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| images[] | file | [file] |

## Dashboard

| Name | Method | URL | Auth |
|---|---|---|---|
| Dashboard | GET | {{local}}/api/v1/dashboard/32 | None |

### Dashboard

- Method: **GET**
- URL: {{local}}/api/v1/dashboard/32
- Auth: **None**

**Request Body**

None

## Design flow

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/design | None |
| Delete | DELETE | {{local}}/api/v1/design/1 | None |
| List | GET | {{local}}/api/v1/design?search= | None |
| Show | GET | {{local}}/api/v1/design/3 | Bearer token |
| update | PUT | {{local}}/api/v1/design/1 | None |
| Upload | PUT | {{local}}/api/v1/design/initial/upload?projectId=1 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/design
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| leadId | text | 1 |
| vendorId | text | 93 |
| createdBy | text | 1 |

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/design/1
- Auth: **None**

**Description**

This is a DELETE request, and it is used to delete data that was previously created via a POST request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful DELETE request typically returns a `200 OK`, `202 Accepted`, or `204 No Content` response code.

**Request Body**

Mode: raw

### List

- Method: **GET**
- URL: {{local}}/api/v1/design?search=
- Auth: **None**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Query Parameters**

| Param | Value |
|---|---|
| search |  |

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/design/3
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### update

- Method: **PUT**
- URL: {{local}}/api/v1/design/1
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| initialDesignStatus | text | 90 |

### Upload

- Method: **PUT**
- URL: {{local}}/api/v1/design/initial/upload?projectId=1
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| projectId | 1 |

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| bomDocuments[] | file | [file] |
| updatedBy | text | 26 |

## Dispatch Management

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/dispatch | None |
| Delete | DELETE | {{local}}/api/v1/dispatch/7 | None |
| Dispatch Project List | GET | {{local}}/api/v1/dispatch/projects/list?status=5 | None |
| List | GET | {{local}}/api/v1/dispatch | None |
| Procurement list | GET | {{local}}/api/v1/dispatch/procurement/list | None |
| Show | GET | {{local}}/api/v1/dispatch/2 | Bearer token |
| Update | PUT | {{local}}/api/v1/dispatch/2 | None |
| Update Vehicle | POST | {{local}}/api/v1/dispatch/vehicle | None |
| Upload Files | POST | {{local}}/api/v1/dispatch/1/upload | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/dispatch
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: raw
```json
{
    "leadId": 9,
    "vendorId": 11,
    "stateId": 4035,
    "trackingId": "DISPATCH001",
    "procurementStartedOn": "2025-12-13",
    "procurementCompletedOn": "2025-12-15",
    "dispatchedDate": "2025-12-16",
    "deliveryAddress": "",
    "status": data.status,
    "logisticPartner": data.logisticPartner,
    "vehicleNo": data.vehicleNo,
    "driverContact": data.driverContact,
    "expectedDelivery": data.expectedDelivery,
    "remarks": data.remarks,
    "dispatchStatus": data.dispatchStatus,
    "assignedTo": data.assignedTo
    
}
```

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/dispatch/7
- Auth: **None**

**Description**

This is a DELETE request, and it is used to delete data that was previously created via a POST request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful DELETE request typically returns a `200 OK`, `202 Accepted`, or `204 No Content` response code.

**Request Body**

Mode: raw

### Dispatch Project List

- Method: **GET**
- URL: {{local}}/api/v1/dispatch/projects/list?status=5
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| status | 5 |

**Request Body**

None

### List

- Method: **GET**
- URL: {{local}}/api/v1/dispatch
- Auth: **None**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Procurement list

- Method: **GET**
- URL: {{local}}/api/v1/dispatch/procurement/list
- Auth: **None**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/dispatch/2
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/dispatch/2
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: raw
```json
{
    "status":3,
    "updatedBy":111
}
```

### Update Vehicle

- Method: **POST**
- URL: {{local}}/api/v1/dispatch/vehicle
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "vehicleId": 1,
    "dispatchIds": [2,5],
    "status": 4,
    "updatedBy": 111
}
```

### Upload Files

- Method: **POST**
- URL: {{local}}/api/v1/dispatch/1/upload
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| images[] | text |  |

## Faqs

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/faqs | None |
| Delete | DELETE | {{local}}/api/v1/faqs/1 | None |
| List | GET | {{local}}/api/v1/faqs?&search=q&export= | None |
| Show | GET | {{local}}/api/v1/faqs/1 | Bearer token |
| Update | PUT | {{local}}/api/v1/faqs/1 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/faqs
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: raw
```json
{
    "question": "question",
    "answer": "answer",
    "status": 1
}
```

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/faqs/1
- Auth: **None**

**Description**

This is a DELETE request, and it is used to delete data that was previously created via a POST request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful DELETE request typically returns a `200 OK`, `202 Accepted`, or `204 No Content` response code.

**Request Body**

Mode: raw

### List

- Method: **GET**
- URL: {{local}}/api/v1/faqs?&search=q&export=
- Auth: **None**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Query Parameters**

| Param | Value |
|---|---|
|  |  |
| search | q |
| export |  |

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/faqs/1
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/faqs/1
- Auth: **None**

**Description**

This is a PUT request and it is used to overwrite an existing piece of data. For instance, after you create an entity with a POST request, you may want to modify that later. You can do that using a PUT request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful PUT request typically returns a `200 OK`, `201 Created`, or `204 No Content` response code.

**Request Body**

Mode: raw
```json
{
    "question": "question1",
    "answer": "answer1",
    "status": 1
}
```

## Inventory

| Name | Method | URL | Auth |
|---|---|---|---|
| Add Brand | POST | {{local}}/api/v1/inventory/brand | None |
| Add Category | POST | {{local}}/api/v1/inventory/category | None |
| Create | POST | {{local}}/api/v1/inventory | None |
| Delete | DELETE | {{local}}/api/v1/inventory/1 | None |
| List | GET | {{local}}/api/v1/inventory | None |
| Show | GET | {{local}}/api/v1/inventory/1 | Bearer token |
| Update | PUT | {{local}}/api/v1/inventory/1 | None |

### Add Brand

- Method: **POST**
- URL: {{local}}/api/v1/inventory/brand
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "name":"Renew"
}
```

### Add Category

- Method: **POST**
- URL: {{local}}/api/v1/inventory/category
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "name":"solar panel"
}
```

### Create

- Method: **POST**
- URL: {{local}}/api/v1/inventory
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: raw

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/inventory/1
- Auth: **None**

**Description**

This is a DELETE request, and it is used to delete data that was previously created via a POST request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful DELETE request typically returns a `200 OK`, `202 Accepted`, or `204 No Content` response code.

**Request Body**

Mode: raw

### List

- Method: **GET**
- URL: {{local}}/api/v1/inventory
- Auth: **None**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

Mode: raw
```json
{
    "name":"Hybrid Inverter (5 kW)",
    "categoryId": 1,
    "brandId":1,
    "specification":"550W 5kW Hybrid",
    "currentPrice":"2,50,000",
    "newPrice":"2,50,000",
    "quantity":"1"
}
```

### Show

- Method: **GET**
- URL: {{local}}/api/v1/inventory/1
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/inventory/1
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: raw
```json
{
    "categoryId":2
}
```

## Large Image Upload

| Name | Method | URL | Auth |
|---|---|---|---|
| Check Large Image | POST | {{local}}/api/v1/request-installations/upload-chunk-images | None |
| Merge Large Image | POST | {{local}}/api/v1/request-installations/merge-chunk-images | None |

### Check Large Image

- Method: **POST**
- URL: {{local}}/api/v1/request-installations/upload-chunk-images
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| monthlyElectricityBill | text | 5000 |
| image[] | file | [file] |
| chunkIndex | text | 0 |

### Merge Large Image

- Method: **POST**
- URL: {{local}}/api/v1/request-installations/merge-chunk-images
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: raw
```json
{
  "fileId": "default_file",
  "totalChunks": 1,
  "fileName": "download (1).jpg"
}
```

## Leads

| Name | Method | URL | Auth |
|---|---|---|---|
| Assign Vendor | POST | {{local}}/api/v1/leads/assign-vendor | None |
| Create | POST | {{local}}/api/v1/leads | None |
| Get Favorites | GET | {{local}}/api/v1/leads/get-favorites/7 | None |
| List | GET | {{local}}/api/v1/leads?vendorId=20&isArchived=1 | None |
| Quotation | POST | {{local}}/api/v1/price/quotation/263 | None |
| Show | GET | {{local}}/api/v1/leads/9 | None |
| Toggle Favorites | POST | {{local}}/api/v1/leads/toggle-favorites | None |
| Update | PUT | {{local}}/api/v1/leads/81 | None |
| Update Installation Images | PUT | {{local}}/api/v1/leads/upload/2 | None |

### Assign Vendor

- Method: **POST**
- URL: {{local}}/api/v1/leads/assign-vendor
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "leadId":19,
    "assignedVendor": 11,
    "assignedBy": 7
}
```

### Create

- Method: **POST**
- URL: {{local}}/api/v1/leads
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| name | text | GP |
| email | text | sreemirrah@coderzvisiontech.com |
| mobileNumber | text | 8072809878 |
| countryId | text | 101 |
| address | text | Trichy |
| projectType | text | 2 |
| siteVisitDate | text | 2025-12-25 |
| requiredCapacity | text | 5 |
| serviceConnNo | text | 45 |
| comments | text | No comments |
| createdBy | text | 11 |
| images[] | file | [file] |
| ebName | text | Das |

### Get Favorites

- Method: **GET**
- URL: {{local}}/api/v1/leads/get-favorites/7
- Auth: **None**

**Request Body**

None

### List

- Method: **GET**
- URL: {{local}}/api/v1/leads?vendorId=20&isArchived=1
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| vendorId | 20 |
| isArchived | 1 |

**Request Body**

None

### Quotation

- Method: **POST**
- URL: {{local}}/api/v1/price/quotation/263
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "projectValue": 250000,
    "additionalNote": ""
}
```

### Show

- Method: **GET**
- URL: {{local}}/api/v1/leads/9
- Auth: **None**

**Request Body**

Mode: raw

### Toggle Favorites

- Method: **POST**
- URL: {{local}}/api/v1/leads/toggle-favorites
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "userId":7,
    "leadId":13
}
```

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/leads/81
- Auth: **None**

**Request Body**

Mode: raw
```json
// {
//     "name":"Guru Arjun"
// }
// {
//     "archivedReason": 4,
//     "isArchived": 1,
//     "comments": "vcddf",
//     "archivedBy": 11
// }

// {
//     "siteVisitDate": "2026-01-30",
//     "siteVisitTime": "14:30:00"
// }    

// {
//     "vendorApproval": 1
// }

{
    "assignedVendor": 20,
    "assignedBy": 11
}
```

### Update Installation Images

- Method: **PUT**
- URL: {{local}}/api/v1/leads/upload/2
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| userId | text | 11 |
| leadId | text | 2 |
| images[] | file | [file] |
| imageTypes[] | text | panel_number |
| imageTypes[] | text | panel_number |

## Loan

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/loans | None |
| dashboard-list | POST | {{local}}/api/v1/loans/dashboard/list | None |
| Delete | DELETE | {{local}}/api/v1/loans/8 | None |
| List | GET | {{local}}/api/v1/loans?paymentType=&search=&export=&loanApprove=1&status=1 | None |
| Loan Create Old | POST | {{local}}/api/v1/payments | None |
| loan-funnel | POST | {{local}}/api/v1/loans/funnel | None |
| Show | GET | {{local}}/api/v1/loans/33 | Bearer token |
| Update | PUT | {{local}}/api/v1/loans/42 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/loans
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| leadId | text | 1 |
| vendorId | text | 93 |
| providerId | text | 1 |
| projectValue | text | 20000 |
| documents[] | file | [file] |
| documentNumbers[] | text | 987654 |
| documentTypes[] | text | aadhar2 |
| createdBy | text | 11 |
| approvePercent | text | 100 |
| isResubmit[] | text | 0 |

### dashboard-list

- Method: **POST**
- URL: {{local}}/api/v1/loans/dashboard/list
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "timeline" : "monthly"
}
```

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/loans/8
- Auth: **None**

**Request Body**

None

### List

- Method: **GET**
- URL: {{local}}/api/v1/loans?paymentType=&search=&export=&loanApprove=1&status=1
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| paymentType |  |
| search |  |
| export |  |
| loanApprove | 1 |
| status | 1 |

**Request Body**

None

### Loan Create Old

- Method: **POST**
- URL: {{local}}/api/v1/payments
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| userId | text | 29 |
| loanType | text | 12 |
| providerType | text | 1 |
| providerId | text | 1 |
| loanAmount | text | 20000 |
| interestRate | text | 1 |
| tenureMonths | text | 12 |
| documents[] | file | [file] |
| createdBy | text | 8 |
| leadId | text | 22 |

### loan-funnel

- Method: **POST**
- URL: {{local}}/api/v1/loans/funnel
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "startDate" : "2025-11-12",
    "endDate" : "2025-11-22"
}
```

### Show

- Method: **GET**
- URL: {{local}}/api/v1/loans/33
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/loans/42
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| updatedBy | text | 106 |
| status | text | 5 |
| disbursedAmount | text | 50000 |

## Loan Providers

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/loan-providers | None |
| Delete | DELETE | {{local}}/api/v1/loan-providers/5 | None |
| List | GET | {{local}}/api/v1/loan-providers?search=&providerType=60 | None |
| Show | GET | {{local}}/api/v1/loan-providers/1 | Bearer token |
| Update | PUT | {{local}}/api/v1/loan-providers/4 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/loan-providers
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| name | text | Ecofy |
| providerType | text | 61 |
| images[] | file | [file] |
| logo[] | file | [file] |
| url | text | https://coderzvisiontech.com |
| primaryPerson | text | Krishnaraj |
| primaryContact | text | krish@gmail.com |
| remarks | text | NBFC |
| createdBy | text | 5 |

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/loan-providers/5
- Auth: **None**

**Request Body**

None

### List

- Method: **GET**
- URL: {{local}}/api/v1/loan-providers?search=&providerType=60
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| search |  |
| providerType | 60 |

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/loan-providers/1
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/loan-providers/4
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| logo[] | file | [file] |
| images[] | file | [file] |

## Login

| Name | Method | URL | Auth |
|---|---|---|---|
| Auth Login | POST | {{local}}/api/v1/auth/login | None |
| Logout | POST | {{local}}/api/v1/auth/logout | None |
| Refresh Token | POST | {{local}}/api/v1/auth/refresh-token | None |

### Auth Login

- Method: **POST**
- URL: {{local}}/api/v1/auth/login
- Auth: **None**

**Request Body**

Mode: raw
```json
// {
//     "username": "yogesh@gmail.com",
//     "password": "Coderz@123"
//     // "userType": 1
// }

{
    "username": "sales@gmail.com",
    "password": "Sales@123"
    // "userType": 1
}

// {
//     "username": "sreemirrah@coderzvisiontech.com",
//     "password": ""
// }

// {
//     "username": "VEN012",
//     "password": "Coderz@123",
//     "userType": 2
// }

// {
//     "username": "vendor12397@gmail.com",
//     "password": "",
//     "userType": 2
// }

// {
//     "username": "coderztestemail@gmail.com",
//     "password": ""
// }
```

### Logout

- Method: **POST**
- URL: {{local}}/api/v1/auth/logout
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "userId": 37
}
```

### Refresh Token

- Method: **POST**
- URL: {{local}}/api/v1/auth/refresh-token
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM5LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc1OTEyNzc4NiwiZXhwIjoxNzU5NzMyNTg2fQ.7laUBwQMgF8ZmVIpSpNCWXtPgTWBfm-MhrzKwNeBPUg"
}
```

## Menu

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/menus | None |
| Delete | DELETE | {{local}}/api/v1/menus/10 | None |
| List | GET | {{local}}/api/v1/menus?&search=Das&export= | None |
| Show | GET | {{local}}/api/v1/menus/2 | Bearer token |
| Update | PUT | {{local}}/api/v1/menus/3 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/menus
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: raw
```json
{
    "name": "Reports",
    "browser_title": "Reports",
    "page_title": "Reports"
    // "level": 1
    // "visibility": 1
}
```

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/menus/10
- Auth: **None**

**Description**

This is a DELETE request, and it is used to delete data that was previously created via a POST request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful DELETE request typically returns a `200 OK`, `202 Accepted`, or `204 No Content` response code.

**Request Body**

Mode: raw

### List

- Method: **GET**
- URL: {{local}}/api/v1/menus?&search=Das&export=
- Auth: **None**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Query Parameters**

| Param | Value |
|---|---|
|  |  |
| search | Das |
| export |  |

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/menus/2
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/menus/3
- Auth: **None**

**Description**

This is a PUT request and it is used to overwrite an existing piece of data. For instance, after you create an entity with a POST request, you may want to modify that later. You can do that using a PUT request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful PUT request typically returns a `200 OK`, `201 Created`, or `204 No Content` response code.

**Request Body**

Mode: raw
```json
{
    "name": "Customer1",
    "browser_title": "Customer",
    "page_title": "Customer¯̉",
    "level": 2,
    "visibility": 1
}
```

## Notifications

| Name | Method | URL | Auth |
|---|---|---|---|
| Get Notifications By User | GET | {{local}}/api/v1/notifications/3?page=1&per_page=10&type=assignVendor&isRead=0 | None |
| Update | PUT | {{local}}/api/v1/notifications/1 | None |

### Get Notifications By User

- Method: **GET**
- URL: {{local}}/api/v1/notifications/3?page=1&per_page=10&type=assignVendor&isRead=0
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| page | 1 |
| per_page | 10 |
| type | assignVendor |
| isRead | 0 |

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/notifications/1
- Auth: **None**

**Request Body**

Mode: raw

## Payment

| Name | Method | URL | Auth |
|---|---|---|---|
| Delete | DELETE | {{local}}/api/v1/payments/6 | None |
| Invoice Download | GET | {{local}}/api/v1/payments/invoice/20/2 | None |
| List | GET | {{local}}/api/v1/payments?paymentType=&search=&export= | None |
| Loan and Payments | GET | {{local}}/api/v1/payments/combined/list?page=2 | None |
| Online Payment Create | POST | {{local}}/api/v1/payments | None |
| Show | GET | {{local}}/api/v1/payments/2 | Bearer token |
| Transactions | GET | {{local}}/api/v1/payments/transactions/list?userId=3&filterType=lastMonth | None |
| Update | PUT | {{local}}/api/v1/payments/13 | None |

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/payments/6
- Auth: **None**

**Request Body**

None

### Invoice Download

- Method: **GET**
- URL: {{local}}/api/v1/payments/invoice/20/2
- Auth: **None**

**Request Body**

None

### List

- Method: **GET**
- URL: {{local}}/api/v1/payments?paymentType=&search=&export=
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| paymentType |  |
| search |  |
| export |  |

**Request Body**

None

### Loan and Payments

- Method: **GET**
- URL: {{local}}/api/v1/payments/combined/list?page=2
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| page | 2 |

**Request Body**

None

### Online Payment Create

- Method: **POST**
- URL: {{local}}/api/v1/payments
- Auth: **None**

**Request Body**

Mode: urlencoded

### Show

- Method: **GET**
- URL: {{local}}/api/v1/payments/2
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Transactions

- Method: **GET**
- URL: {{local}}/api/v1/payments/transactions/list?userId=3&filterType=lastMonth
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| userId | 3 |
| filterType | lastMonth |

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/payments/13
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| updatedBy | text | 11 |
| paidStatus | text | 2 |

## Permissions

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/permissions | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/permissions
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "teamId": 4,
    "roleId": 1,
    "menuIds": [1, 2, 3, 4, 5]
}
```

## Projects

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/projects | None |
| Delete | DELETE | {{local}}/api/v1/projects/2 | None |
| DPR download | GET | {{local}}/api/v1/projects/dpr-report/13 | None |
| List | GET | {{local}}/api/v1/projects?search=&export=per_page=&stage= | None |
| Milestone List | POST | {{local}}/api/v1/projects/milestone-details | None |
| Project with Payment List | GET | {{local}}/api/v1/projects/combined/payments?export=&per_page=&page=&stage=7&search= | None |
| RP Create Order | POST | {{local}}/api/v1/payments/make-payment | None |
| RP Get Payment | GET |  | None |
| Show | GET | {{local}}/api/v1/projects/1 | Bearer token |
| Update | PUT | {{local}}/api/v1/projects/3 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/projects
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| leadId | text | 1 |
| createdBy | text | 92 |

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/projects/2
- Auth: **None**

**Request Body**

None

### DPR download

- Method: **GET**
- URL: {{local}}/api/v1/projects/dpr-report/13
- Auth: **None**

**Request Body**

None

### List

- Method: **GET**
- URL: {{local}}/api/v1/projects?search=&export=per_page=&stage=
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| search |  |
| export | per_page= |
| stage |  |

**Request Body**

Mode: raw

### Milestone List

- Method: **POST**
- URL: {{local}}/api/v1/projects/milestone-details
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: raw
```json
{
    // "userId": 1,
    // "userType": 1,
    // "sourceType": "project",
    "sourceId": 149
}
```

### Project with Payment List

- Method: **GET**
- URL: {{local}}/api/v1/projects/combined/payments?export=&per_page=&page=&stage=7&search=
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| export |  |
| per_page |  |
| page |  |
| stage | 7 |
| search |  |

**Request Body**

None

### RP Create Order

- Method: **POST**
- URL: {{local}}/api/v1/payments/make-payment
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "amount": 500001.80,
    "currency":"INR",
    "leadId":135
}
```

### RP Get Payment

- Method: **GET**
- URL: 
- Auth: **None**

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/projects/1
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/projects/3
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| updatedBy | text | 3 |
| isDprApproved | text | Rejected |
| remarks | text | This is unacceptable. Will not approve this |

## Push Notification

| Name | Method | URL | Auth |
|---|---|---|---|
| Notification List | GET | {{local}}/api/v1/push-notification/list?userId=3 | None |
| Register Token | POST | {{local}}/api/v1/push-notification/register-token | None |
| Send Notification | POST | {{local}}/api/v1/push-notification/send | None |
| Update Token | PUT | {{local}}/api/v1/push-notification/update-token | None |

### Notification List

- Method: **GET**
- URL: {{local}}/api/v1/push-notification/list?userId=3
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| userId | 3 |

**Request Body**

None

### Register Token

- Method: **POST**
- URL: {{local}}/api/v1/push-notification/register-token
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "userId": 29,
    "deviceToken":"f3NIHdAhXyj6zyHnaTPYJV:APA91bETOatHn6eihU0Jj1aTaqbp0V0J-Sn5KW_W8XN4xyzIMXdJDwSgnHENJGX-7kFqBbql8KQhGYZ-hVDMVcAFi4C0Zq0Sfn_SwZavZpD_V2pmiLf8s2A",
    "deviceType": "web"
}
```

### Send Notification

- Method: **POST**
- URL: {{local}}/api/v1/push-notification/send
- Auth: **None**

**Request Body**

Mode: raw
```json
{
  "userId": 29,
  "senderId": 29,
  "title": "Order Update",
  "description": "Your order #87666 has been shipped",
  "recipients": ["cL5Qtlgpa3mNoEKCjZ1mV0:APA91bG0EBdP4VhEawXGGYP7oYoscquKjSe5mtBb0BNvSyiVgBMsDY01m-gS8rwasFbHz9edafp84eduURyc-THKJEDKywtHRIzXdcDBtaiPx7GJkLMQ-Tc"],
  "data": {
    "screen": "OrderDetails",
    "orderId": 7899,
    "type": "order_update"
  }
}
```

### Update Token

- Method: **PUT**
- URL: {{local}}/api/v1/push-notification/update-token
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "userId":2,
    "newToken": "ePqXOlzwRJ2g46Zd4AVxs4:APA91bFiisjHcP5Hax-rXBGKFjBncye6AdwgnE11nxV_T5Ofchdnt-fsFVjSu0UA5-y54C44cvuZ2GT1X4JT2oLjcA8E9TY-jfy7o6W51VX7RFDIs5OvhWQ",
    "deviceType": "android"
}
```

## Raise Request

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/raise-requests | None |
| Delete | DELETE | {{local}}/api/v1/raise-requests/5 | None |
| List | GET | {{local}}/api/v1/raise-requests?export=&search= | None |
| Show | GET | {{local}}/api/v1/raise-requests/3 | Bearer token |
| Update | PUT | {{local}}/api/v1/raise-requests/1 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/raise-requests
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| projectId | text | 1 |
| description | text | this is something big |
| images[] | file | [file] |
| userId | text | 11 |

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/raise-requests/5
- Auth: **None**

**Request Body**

None

### List

- Method: **GET**
- URL: {{local}}/api/v1/raise-requests?export=&search=
- Auth: **None**

**Query Parameters**

| Param | Value |
|---|---|
| export |  |
| search |  |

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/raise-requests/3
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/raise-requests/1
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "status":1,
    "updatedBy":1
}
```

## Rating & Review

| Name | Method | URL | Auth |
|---|---|---|---|
| Add | POST | {{local}}/api/v1/ratings | None |
| List | GET | {{local}}/api/v1/ratings | None |
| Show | GET | {{local}}/api/v1/ratings/3 | None |
| Summary | POST | {{local}}/api/v1/ratings/summary | None |

### Add

- Method: **POST**
- URL: {{local}}/api/v1/ratings
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "projectId": 12,
    "reviewerType": 1,
    "reviewerId": 5,
    "revieweeType": 2,
    "revieweeId": 2,
    "overallRating": 4,
    "overallReview": "Excellent vendor performance!",
    "specificRating": 5,
    "specificReview": "Delivered before deadline."
}
```

### List

- Method: **GET**
- URL: {{local}}/api/v1/ratings
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| email | text | karthik@coderzvisiontech.com |
| type | text | newsletter |

### Show

- Method: **GET**
- URL: {{local}}/api/v1/ratings/3
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| email | text | karthik@coderzvisiontech.com |
| type | text | newsletter |

### Summary

- Method: **POST**
- URL: {{local}}/api/v1/ratings/summary
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "projectId": 12,
    "revieweeId": 2
}
```

## Request Installation

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/request-installations | None |
| Delete | DELETE | {{local}}/api/v1/request-installations/1 | None |
| List | GET | {{local}}/api/v1/request-installations?type=&search=&export= | None |
| Show | GET | {{local}}/api/v1/request-installations/1 | Bearer token |
| Update | PUT | {{local}}/api/v1/request-installations/3 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/request-installations
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| userId | text | 12 |
| userType | text | 3 |
| installationTypeId | text | 3 |
| houseFlatNo | text | 12A |
| address | text | 123 Main Street, City |
| billName | text | billName |
| monthlyElectricityBill | text | 5000 |
| images[] | file | [file] |
| latitude | text | 17.4312699 |
| longitude | text | 78.3778712 |

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/request-installations/1
- Auth: **None**

**Description**

This is a DELETE request, and it is used to delete data that was previously created via a POST request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful DELETE request typically returns a `200 OK`, `202 Accepted`, or `204 No Content` response code.

**Request Body**

Mode: raw

### List

- Method: **GET**
- URL: {{local}}/api/v1/request-installations?type=&search=&export=
- Auth: **None**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Query Parameters**

| Param | Value |
|---|---|
| type |  |
| search |  |
| export |  |

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/request-installations/1
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/request-installations/3
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| billName | text | billName1 |

## Roles

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/roles | None |
| List | GET | {{local}}/api/v1/roles | None |
| Show | GET | {{local}}/api/v1/roles/1 | None |
| Update | PUT | {{local}}/api/v1/roles/1 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/roles
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "name":"Manager",
    "userType":7
}
```

### List

- Method: **GET**
- URL: {{local}}/api/v1/roles
- Auth: **None**

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/roles/1
- Auth: **None**

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/roles/1
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "name": "Manager"
}
```

## Service Requests

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/amc-requests | None |
| Delete | DELETE | {{local}}/api/v1/amc-requests/5 | None |
| List | GET | {{local}}/api/v1/amc-requests | None |
| Show | GET | {{local}}/api/v1/amc-requests/1 | Bearer token |
| Update | PUT | {{local}}/api/v1/amc-requests/1 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/amc-requests
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "userId": 145,
    "serviceId": 22,
    "siteVisitDate":"2026-01-25"
}
```

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/amc-requests/5
- Auth: **None**

**Request Body**

None

### List

- Method: **GET**
- URL: {{local}}/api/v1/amc-requests
- Auth: **None**

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/amc-requests/1
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/amc-requests/1
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "updatedBy":1
}
```

## Site Survey

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/site-surveys | None |
| List | GET | {{local}}/api/v1/site-surveys | None |
| Price | POST | {{local}}/api/v1/site-surveys/price/calculation | None |
| Show | GET | {{local}}/api/v1/site-surveys/21 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/site-surveys
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| city | text | 57586 |
| requiredCapacity | text | 2 |
| latitude | text | 13.0922573 |
| longitude | text | 80.2125642 |
| eastWestLength | text | 12 |
| northSouthLength | text | 21 |
| buildingHeight | text | 5 |
| obstructionNorth | text | 5 |
| obstructionSouth | text | 5 |
| obstructionEast | text | 5 |
| obstructionWest | text | 5 |
| meterFloor | text | 5 |
| meterDirection | text | South |
| inverterFloor | text | 4 |
| earthingLocation | text | 65 |
| acCableRouting | text | 58 |
| dcCableRouting | text | 57 |
| earthingCableRouting | text | 58 |
| createdBy | text | 3 |
| leadId | text | 249 |
| projectType | text | 1 |
| module | text | 40 |
| inverter | text | 43 |
| phase | text | 86 |
| structureHeight | text | 32 |
| structureType | text | 29 |
| roofType | text | 27 |
| floorHeight | text | 4 |
| stairCaseLength | text | 8 |
| stairCaseWidth | text | 9 |

### List

- Method: **GET**
- URL: {{local}}/api/v1/site-surveys
- Auth: **None**

**Request Body**

None

### Price

- Method: **POST**
- URL: {{local}}/api/v1/site-surveys/price/calculation
- Auth: **None**

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| city | text | 57586 |
| requiredCapacity | text | 2 |
| latitude | text | 13.0922573 |
| longitude | text | 80.2125642 |
| eastWestLength | text | 12 |
| northSouthLength | text | 21 |
| buildingHeight | text | 5 |
| obstructionNorth | text | 5 |
| obstructionSouth | text | 5 |
| obstructionEast | text | 5 |
| obstructionWest | text | 5 |
| meterFloor | text | 5 |
| meterDirection | text | South |
| inverterFloor | text | 4 |
| earthingLocation | text | 65 |
| acCableRouting | text | 58 |
| dcCableRouting | text | 57 |
| earthingCableRouting | text | 58 |
| createdBy | text | 11 |
| leadId | text | 33 |
| projectType | text | 1 |
| module | text | 40 |
| inverter | text | 43 |
| phase | text | 86 |
| structureHeight | text | 32 |
| structureType | text | 29 |
| roofType | text | 27 |
| floorHeight | text | 4 |
| stairCaseLength | text | 8 |
| stairCaseWidth | text | 9 |
| structureImages[] | file | [file] |
| siteImages[] | file | [file] |

### Show

- Method: **GET**
- URL: {{local}}/api/v1/site-surveys/21
- Auth: **None**

**Request Body**

Mode: raw

## Solarman

| Name | Method | URL | Auth |
|---|---|---|---|
| Device based stations | POST | {{local}}/api/v1/solarman/device-station-list | None |
| get token | GET | {{local}}/api/v1/solarman/get-token | None |
| Historical Data | POST | {{local}}/api/v1/solarman/historical-data | None |
| Station List | POST | {{local}}/api/v1/solarman/stations | Bearer token |

### Device based stations

- Method: **POST**
- URL: {{local}}/api/v1/solarman/device-station-list
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "page":1,
    "size":20
}
```

### get token

- Method: **GET**
- URL: {{local}}/api/v1/solarman/get-token
- Auth: **None**

**Request Body**

None

### Historical Data

- Method: **POST**
- URL: {{local}}/api/v1/solarman/historical-data
- Auth: **None**

**Request Body**

Mode: raw
```json
// {
//   "deviceId": "241465799",
//   "deviceSn": "2406192320",
//   "startTime": "2025-10-25",
//   "endTime": "2025-11-10",
//   "timeType": "2"
// }

// {
//   "deviceId": "241465799",
//   "deviceSn": "2406192320",
//   "startTime": "2025-01",
//   "endTime": "2025-01",
//   "timeType": "3"
// }


{
    "deviceId":"253792252",
    "deviceSn":"2506066101",
    "endTime":"2026",
    "startTime":"2026",
    "timeType":"4"
}

// {
//   "deviceId": "241465799",
//   "deviceSn": "2406192320",
//   "startTime": "1735689600",
//   "endTime": "1735776000",
//   "timeType": "5"
// }
```

### Station List

- Method: **POST**
- URL: {{local}}/api/v1/solarman/stations
- Auth: **Bearer token**

**Request Body**

Mode: raw
```json
{
    "page":1,
    "size":20
}
```

## Subscription

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/subscriptions | None |
| Delete | DELETE | {{local}}/api/v1/subscriptions/1 | None |
| List | GET | {{local}}/api/v1/subscriptions?userId=6&search=&export= | None |
| Show | GET | {{local}}/api/v1/subscriptions/1 | Bearer token |
| Update | PUT | {{local}}/api/v1/subscriptions/2 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/subscriptions
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: raw
```json
{
    "name": "Annual AMC Plan",
    "title": "₹ 9000 / month",
    "price": 9000,
    "period": "yearly",
    "planDays": 365,
    "keyPoints": ["Dedicated Customer Support","Dedicated General TAT", "15% Discount on Spare Parts", "15% Discount on Upgrades"],
    "shortDescription": "A flexible annual plan for hassle-free maintenance of your solar system.",
    "isMostPopular": false,
    "ctaLabel": "Get now",
    "sortOrder": 3,
    "status": 1
}
```

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/subscriptions/1
- Auth: **None**

**Description**

This is a DELETE request, and it is used to delete data that was previously created via a POST request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful DELETE request typically returns a `200 OK`, `202 Accepted`, or `204 No Content` response code.

**Request Body**

Mode: raw

### List

- Method: **GET**
- URL: {{local}}/api/v1/subscriptions?userId=6&search=&export=
- Auth: **None**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Query Parameters**

| Param | Value |
|---|---|
| userId | 6 |
| search |  |
| export |  |

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/subscriptions/1
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/subscriptions/2
- Auth: **None**

**Description**

This is a PUT request and it is used to overwrite an existing piece of data. For instance, after you create an entity with a POST request, you may want to modify that later. You can do that using a PUT request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful PUT request typically returns a `200 OK`, `201 Created`, or `204 No Content` response code.

**Request Body**

Mode: raw
```json
{
    "name": "Monthly AMC Plan",
    "title": "₹ 600 / month",
    "price": 600,
    "period": "monthly",
    "planDays": 30,
    "keyPoints": ["Priority support", "Monthly system health check", "Minor repairs included"],
    "shortDescription": "A flexible monthly plan for hassle-free maintenance of your solar system.",
    "isMostPopular": true,
    "ctaLabel": "Get now",
    "sortOrder": 1,
    "status": 1
}
```

## Technicians

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/technicians | None |
| Delete | DELETE | {{local}}/api/v1/technicians/1 | None |
| List | GET | {{local}}/api/v1/technicians | None |
| Show | GET | {{local}}/api/v1/technicians/1 | None |
| Update | PUT | {{local}}/api/v1/technicians/1 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/technicians
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "name":"Swetha",
    "mobileNumber":"9875678988",
    "email":"swe@gmail.com",
    "assignedRequests":0,
    "assignedTickets":[],
    "status":1,
    "remarks":"Good technician"
}
```

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/technicians/1
- Auth: **None**

**Request Body**

None

### List

- Method: **GET**
- URL: {{local}}/api/v1/technicians
- Auth: **None**

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/technicians/1
- Auth: **None**

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/technicians/1
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "name":"Sweatha",
    "mobileNumber":"9875678988",
    "email":"swe@gmail.com",
    "assignedRequests":0,
    "assignedTickets":[],
    "status":1,
    "remarks":"Good technician"
}
```

## Tickets

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/tickets | None |
| Delete | DELETE | {{local}}/api/v1/tickets/7 | None |
| List | GET | {{local}}/api/v1/tickets?search= | None |
| Show | GET | {{local}}/api/v1/tickets/2 | Bearer token |
| Update | PUT | {{local}}/api/v1/tickets/2 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/tickets
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| description | text | Uploaded income proof rejected by system due to unclear document. Requesting re-validation. |
| assignedTo | text | 92 |
| priorityId | text | 7 |
| moduleType | text | project |
| createdBy | text | 92 |

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/tickets/7
- Auth: **None**

**Description**

This is a DELETE request, and it is used to delete data that was previously created via a POST request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful DELETE request typically returns a `200 OK`, `202 Accepted`, or `204 No Content` response code.

**Request Body**

Mode: raw

### List

- Method: **GET**
- URL: {{local}}/api/v1/tickets?search=
- Auth: **None**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Query Parameters**

| Param | Value |
|---|---|
| search |  |

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/tickets/2
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/tickets/2
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| description | text | Loan |
| status | text | 0 |

## User

| Name | Method | URL | Auth |
|---|---|---|---|
| Admin Create | POST | {{local}}/api/v1/users | None |
| Check Verification | POST | {{local}}/api/v1/users/check-verify | None |
| Customer Create | POST | {{local}}/api/v1/users | None |
| Customer Profile | GET | {{local}}/api/v1/users/88/profile?type=3 | Bearer token |
| Customer Profile Update | PUT | {{local}}/api/v1/users/6/profile | None |
| Delete | DELETE | {{local}}/api/v1/users/20 | None |
| List | GET | {{local}}/api/v1/users?approval=0&type= | Bearer token |
| Send OTP | POST | {{local}}/api/v1/users/send-otp | None |
| Show | GET | {{local}}/api/v1/users/66 | Bearer token |
| Social Login | POST | {{local}}/api/v1/users | None |
| Update | PUT | {{local}}/api/v1/users/244 | None |
| Vendor Create | POST | {{local}}/api/v1/users | None |
| Vendor Profile | GET | {{local}}/api/v1/users/3/profile?type=2 | Bearer token |
| Vendor Profile Update | PUT | {{local}}/api/v1/users/3/profile | None |
| Verify OTP | POST | {{local}}/api/v1/users/verify-otp | None |

### Admin Create

- Method: **POST**
- URL: {{local}}/api/v1/users
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| name | text | Yogesh |
| email | text | yogesh@gmail.com |
| mobileNumber | text | 6382701425 |
| password | text | Coderz@123 |
| isEmailVerified | text | true |
| isMobileVerified | text | true |
| countryId | text | 101 |
| userType | text | 6 |
| roleId | text | 3 |
| joiningDate | text | 2024-01-20 |

### Check Verification

- Method: **POST**
- URL: {{local}}/api/v1/users/check-verify
- Auth: **None**

**Request Body**

Mode: raw
```json
// {
//     "name":"Pravin",
//     "email": "selv123a@gmail.com",
//     "mobileNumber":"9839383777",
//     "countryId":101
// }

{
    "name": "Pravin Ram",
    "email": "coderztestemail@gmail.com",
    "mobileNumber": "2222222299",
    "countryId": 91,
    "userId":80 // check after login
}
```

### Customer Create

- Method: **POST**
- URL: {{local}}/api/v1/users
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| name | text | Customer |
| email | text | customer12336@gmail.com |
| mobileNumber | text | 777737463 |
| isEmailVerified | text | true |
| isMobileVerified | text | true |
| countryId | text | 101 |
| userType | text | 3 |
| providerUid | text | 0qjO2aot70SGgEIcIBUSpaGKz1R2 |
| photoUrl | text | https://lh3.googleusercontent.com/a/ACg8ocJsvRJ9lD8URSny3ORLjRRbF6Gq3YxZRQ2R-_w3JEN-93jcvw=s96-c |
| isSocialLogin | text | true |

### Customer Profile

- Method: **GET**
- URL: {{local}}/api/v1/users/88/profile?type=3
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Query Parameters**

| Param | Value |
|---|---|
| type | 3 |

**Request Body**

None

### Customer Profile Update

- Method: **PUT**
- URL: {{local}}/api/v1/users/6/profile
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| name | text | GP |
| userType | text | 3 |
| moduleId | text | 1 |
| inverterId | text | 2 |

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/users/20
- Auth: **None**

**Description**

This is a DELETE request, and it is used to delete data that was previously created via a POST request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful DELETE request typically returns a `200 OK`, `202 Accepted`, or `204 No Content` response code.

**Request Body**

Mode: raw

### List

- Method: **GET**
- URL: {{local}}/api/v1/users?approval=0&type=
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Query Parameters**

| Param | Value |
|---|---|
| approval | 0 |
| type |  |

**Request Body**

None

### Send OTP

- Method: **POST**
- URL: {{local}}/api/v1/users/send-otp
- Auth: **None**

**Request Body**

Mode: raw
```json
{
    "countryCode":"91",
    "identifier":"678976544",
    "type":"register"
}
```

### Show

- Method: **GET**
- URL: {{local}}/api/v1/users/66
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Social Login

- Method: **POST**
- URL: {{local}}/api/v1/users
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| name | text | Coderz Vision |
| email | text | coderzvision@gmail.com |
| photoUrl | text | https://lh3.googleusercontent.com/a/ACg8ocJsvRJ9lD8URSny3ORLjRRbF6Gq3YxZRQ2R-_w3JEN-93jcvw=s96-c |
| isEmailVerified | text | true |
| isSocialLogin | text | true |
| countryId | text | 101 |
| userType | text | 3 |
| providerUid | text | 0qjO2aot70SGgEIcIBUSpaGKz1R2 |

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/users/244
- Auth: **None**

**Description**

This is a PUT request and it is used to overwrite an existing piece of data. For instance, after you create an entity with a POST request, you may want to modify that later. You can do that using a PUT request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful PUT request typically returns a `200 OK`, `201 Created`, or `204 No Content` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| mobileNumber | text | 8932999 |

### Vendor Create

- Method: **POST**
- URL: {{local}}/api/v1/users
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| name | text | pravin |
| email | text | 25cqk@virgilian.com |
| mobileNumber | text | 9087485869 |
| password | text | Pravin@261 |
| isEmailVerified | text | true |
| isMobileVerified | text | true |
| countryId | text | 101 |
| companyName | text | pravin |
| companyAddress | text | test |
| isNationalPortal | text | false |
| cityId | text | 134452 |
| stateId | text | 4017 |
| pincode | text | 600254 |
| businessEmail | text | test26@gmail.com |
| businessMobile | text | 8800778800 |
| documentTypes[] | text | Aadhar |
| documentNumbers[] | text | 666611112222 |
| userType | text | 2 |
| names[] | text | Yes bank |
| accNumbers[] | text | 9945788025 |
| codes[] | text | YESB0000253 |
| documents[] | file | [file] |
| documentTypes[] | text | PAN |
| documentTypes[] | text | GST |
| documentTypes[] | text | Canceled Cheque |
| documentTypes[] | text | Labour Certificate |
| documentNumbers[] | text | DCTPP8452D |
| documentNumbers[] | text | 22TAMIL1234A1Z5 |
| documentNumbers[] | text | N/A |
| documentNumbers[] | text | N/A |
| documents[] | file | [file] |
| documents[] | file | [file] |
| documents[] | file | [file] |
| documents[] | file | [file] |

### Vendor Profile

- Method: **GET**
- URL: {{local}}/api/v1/users/3/profile?type=2
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Query Parameters**

| Param | Value |
|---|---|
| type | 2 |

**Request Body**

None

### Vendor Profile Update

- Method: **PUT**
- URL: {{local}}/api/v1/users/3/profile
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: formdata
| Field | Type | Value |
|---|---|---|
| documentTypes[] | text | Labour Certificate |
| documentNumbers[] | text | 9876556588432344 |
| userType | text | 2 |
| documents[] | file | [file] |

### Verify OTP

- Method: **POST**
- URL: {{local}}/api/v1/users/verify-otp
- Auth: **None**

**Request Body**

Mode: raw
```json
// {
//     // "countryCode":"+91",
//     "identifier":"sreemirrah@coderzvisiontech.com",
//     "otp": "918934",
//     "type":"register",
//     "userId":2
// }

{
    "type": "verify",
    "identifier": "8888888888",
    "otp": "648378",
    "userId": 11
}
```

## User Subscription

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/user-subscriptions | None |
| Delete | DELETE | {{local}}/api/v1/user-subscriptions/5 | None |
| List | GET | {{local}}/api/v1/user-subscriptions?search=&export=&userId=2 | None |
| Show | GET | {{local}}/api/v1/user-subscriptions/1 | Bearer token |
| Update | PUT | {{local}}/api/v1/user-subscriptions/4 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/user-subscriptions
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: raw
```json
{
  "userId": 67,
  "subscriptionId": 5,
  "paidAmount": 400,
  "transactionId": "TXN123456958",
  "address": "123 Example Street",
  "isNewAddress": true,
  "isActive":true
}
```

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/user-subscriptions/5
- Auth: **None**

**Description**

This is a DELETE request, and it is used to delete data that was previously created via a POST request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful DELETE request typically returns a `200 OK`, `202 Accepted`, or `204 No Content` response code.

**Request Body**

Mode: raw

### List

- Method: **GET**
- URL: {{local}}/api/v1/user-subscriptions?search=&export=&userId=2
- Auth: **None**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Query Parameters**

| Param | Value |
|---|---|
| search |  |
| export |  |
| userId | 2 |

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/user-subscriptions/1
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/user-subscriptions/4
- Auth: **None**

**Description**

This is a PUT request and it is used to overwrite an existing piece of data. For instance, after you create an entity with a POST request, you may want to modify that later. You can do that using a PUT request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful PUT request typically returns a `200 OK`, `201 Created`, or `204 No Content` response code.

**Request Body**

Mode: raw
```json
{
  "userId": 12,
  "subscriptionId": 1,
  "paidAmount": 500,
  "transactionId": "TXN123456789",
  "address": "123 Example Street",
  "isNewAddress": true,
  "isActive":true
}
```

## Vehicles

| Name | Method | URL | Auth |
|---|---|---|---|
| Create | POST | {{local}}/api/v1/vehicles | None |
| Delete | DELETE | {{local}}/api/v1/vehicles/7 | None |
| List | GET | {{local}}/api/v1/vehicles | None |
| Show | GET | {{local}}/api/v1/vehicles/1 | Bearer token |
| Update | PUT | {{local}}/api/v1/vehicles/1 | None |

### Create

- Method: **POST**
- URL: {{local}}/api/v1/vehicles
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: raw
```json
{
    "vehicleCode":"VHC001",
    "vehicleNumber": "TN 69 M 8307",
    "vehicleType":"Truck",
    "vehicleCapacity":"1000",
    "driverName":"Mahi",
    "driverContact":"9876799333",
    "licenseNumber":"POIUYLKJ001",
    "licenseType":"LMV",
    "availabilityStatus":"Available",
    "lastAssignedDate":"2025-12-15",
    "remarks":"Very Good Driver and Vehicle"
}
```

### Delete

- Method: **DELETE**
- URL: {{local}}/api/v1/vehicles/7
- Auth: **None**

**Description**

This is a DELETE request, and it is used to delete data that was previously created via a POST request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).

A successful DELETE request typically returns a `200 OK`, `202 Accepted`, or `204 No Content` response code.

**Request Body**

Mode: raw

### List

- Method: **GET**
- URL: {{local}}/api/v1/vehicles
- Auth: **None**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Show

- Method: **GET**
- URL: {{local}}/api/v1/vehicles/1
- Auth: **Bearer token**

**Description**

This is a GET request and it is used to "get" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).

A successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data.

**Request Body**

None

### Update

- Method: **PUT**
- URL: {{local}}/api/v1/vehicles/1
- Auth: **None**

**Description**

This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.

A successful POST request typically returns a `200 OK` or `201 Created` response code.

**Request Body**

Mode: raw
```json
{
    "vehicleCode":"VHC001",
    "vehicleNumber": "TN 69 M 8307",
    "vehicleType":"Truck",
    "vehicleCapacity":"1000",
    "driverName":"Mahisha",
    "driverContact":"9876799333",
    "licenseNumber":"POIUYLKJ001",
    "licenseType":"LMV",
    "availabilityStatus":"Available",
    "lastAssignedDate":"2025-12-15",
    "remarks":"Very Good Driver and Vehicle"
}
```

## Vendors

| Name | Method | URL | Auth |
|---|---|---|---|
| Combined List | GET | {{local}}/api/v1/vendors/combined/list | None |
| Leaderboard | GET | {{local}}/api/v1/vendors/leaderboard/20 | None |
| List | GET | {{local}}/api/v1/vendors | None |
| Overview | GET | {{local}}/api/v1/vendors/11/detail | None |
| Project History | GET | {{local}}/api/v1/vendors/3/project | None |
| Ticket History | GET | {{local}}/api/v1/vendors/3/ticket | None |
| Vendor Dashboard | GET | {{local}}/api/v1/vendors/dashboard/11 | None |

### Combined List

- Method: **GET**
- URL: {{local}}/api/v1/vendors/combined/list
- Auth: **None**

**Request Body**

None

### Leaderboard

- Method: **GET**
- URL: {{local}}/api/v1/vendors/leaderboard/20
- Auth: **None**

**Request Body**

None

### List

- Method: **GET**
- URL: {{local}}/api/v1/vendors
- Auth: **None**

**Request Body**

None

### Overview

- Method: **GET**
- URL: {{local}}/api/v1/vendors/11/detail
- Auth: **None**

**Request Body**

None

### Project History

- Method: **GET**
- URL: {{local}}/api/v1/vendors/3/project
- Auth: **None**

**Request Body**

None

### Ticket History

- Method: **GET**
- URL: {{local}}/api/v1/vendors/3/ticket
- Auth: **None**

**Request Body**

None

### Vendor Dashboard

- Method: **GET**
- URL: {{local}}/api/v1/vendors/dashboard/11
- Auth: **None**

**Request Body**

None
