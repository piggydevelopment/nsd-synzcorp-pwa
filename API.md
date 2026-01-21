# API Specification

## Indexes
- [Authentication](#authentication)
  - [Request OTP](#request-otp)
  - [Verify OTP](#verify-otp)
  - [Create User / Login](#create-user--login)
- [User Management](#user-management)
  - [Get User Information](#get-user-information)
  - [Update User Information](#update-user-information)
  - [Update Treatment Information](#update-treatment-information)
- [Content](#content)
  - [Get Banners](#get-banners)
  - [Get Specialists by Type](#get-specialists-by-type)
  - [Get Specialist Detail](#get-specialist-detail)
- [Appointment & Meeting](#appointment--meeting)
  - [Create Appointment](#create-appointment)
  - [Get User Appointments](#get-user-appointments)
  - [Start Meeting (Tracker)](#start-meeting-tracker)
  - [End Meeting (Tracker)](#end-meeting-tracker)
- [Evaluation](#evaluation)
  - [Submit Evaluation](#submit-evaluation)

## Authentication

### Request OTP
- **URL**: `/api/user-create-otp`
- **Method**: `POST`
- **Description**: Request a One-Time Password to be sent to the user's email.
- **Request Data**:
  ```json
  {
    "user_email": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": 201,
    "data": {
      "ref_num": "string"
    }
  }
  ```

### Verify OTP
- **URL**: `/api/user-verify-otp`
- **Method**: `POST`
- **Description**: Verify the received OTP.
- **Request Data**:
  ```json
  {
    "otp_num": "string",
    "ref_num": "string",
    "user_email": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": 200,
    "message": "success"
  }
  ```

### Create User / Login
- **URL**: `/api/user`
- **Method**: `POST`
- **Description**: Create a new user or retrieve existing user session after OTP verification.
- **Request Data**:
  ```json
  {
    "email": "string",
    "organization_id": "number"
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "id": "number",
      "email": "string",
      "firstname": "string",
      "lastname": "string",
      "is_pdpa_accepted": "number",
      "attribute_1": "string",
      "phone_number": "string",
      ...other_user_fields
    }
  }
  ```

## User Management

### Get User Information
- **URL**: `/api/user/:id`
- **Method**: `GET`
- **Description**: Retrieve user details.
- **Parameters**: `id` (User ID)
- **Response**:
  ```json
  {
    "data": {
      "id": "number",
      "firstname": "string",
      "lastname": "string",
      ...
    }
  }
  ```

### Update User Information
- **URL**: `/api/user/:id`
- **Method**: `PUT`
- **Description**: Update user profile information.
- **Parameters**: `id` (User ID)
- **Request Data**:
  ```json
  {
    "firstname": "string",
    "lastname": "string",
    "phone_number": "string",
    "is_pdpa_accepted": "string",
    ...
  }
  ```
- **Response**:
  ```json
  {
    "status": 200,
    "data": "Updated User Object"
  }
  ```

### Update Treatment Information
- **URL**: `/api/user/treatment-information/:id`
- **Method**: `POST`
- **Description**: Submit or update user's additional health/treatment information.
- **Parameters**: `id` (User ID)
- **Request Data**:
  ```json
  {
    "firstname": "string",
    "lastname": "string",
    "occupation": "string",
    "birthday": "date (YYYY-MM-DD)",
    "gender": "string",
    "idcard_number": "string",
    "current_medicine": "string",
    "history_treatment_household": "string",
    "history_drug_allergy": "string",
    "history_food_allergy": "string",
    "emergency_contact": "string",
    "contact_relation": "string",
    "congenital_disease": "string",
    "important_symptoms": "string",
    "received_treatment": "string",
    "hospital_treatment": "string",
    "addicted_cigarettes": "boolean",
    "addicted_coffee": "boolean",
    "addicted_alcohol": "boolean"
  }
  ```

## Content

### Get Banners
- **URL**: `/api/banners`
- **Method**: `GET`
- **Description**: Retrieve a list of banners for the homepage.
- **Response**:
  ```json
  {
    "data": [
      {
        "url_link": "string",
        "image_url": "string"
      }
    ]
  }
  ```

### Get Specialists by Type
- **URL**: `/api/specialist/type/:type`
- **Method**: `GET`
- **Description**: Retrieve a list of specialists filtered by type (e.g., 1 for Psychiatrist, 2 for Psychologist).
- **Parameters**: `type` (Number)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "number",
        "prefix": "string",
        "firstname": "string",
        "lastname": "string",
        "profile_pic_file_name": "string",
        "type_name": "string"
        ...
      }
    ]
  }
  ```

### Get Specialist Detail
- **URL**: `/api/specialist/:id`
- **Method**: `GET`
- **Description**: Retrieve detailed information for a specific specialist.
- **Parameters**: `id` (Specialist ID)
- **Response**:
  ```json
  {
    "data": {
      "id": "number",
      "prefix": "string",
      "firstname": "string",
      "lastname": "string",
      "education_record": "string",
      "work_history": "string",
      "schedule_appointments": "string",
      "topics_json": "array",
      "is_active": "number"
    }
  }
  ```

## Appointment & Meeting

### Create Appointment
- **URL**: `/api/appointment`
- **Method**: `POST`
- **Description**: Book a new appointment with a specialist.
- **Request Data**:
  ```json
  {
    "organization_id": "number",
    "user_id": "number",
    "specialist_id": "number",
    "appointment_date": "date (YYYY-MM-DD)",
    "appointment_time": "time (HH:mm)"
  }
  ```
- **Response**:
  ```json
  {
    "status": 200,
    "message": "success"
  }
  ```

### Get User Appointments
- **URL**: `/api/appointment/:user_id`
- **Method**: `GET`
- **Description**: Retrieve booking history for a user.
- **Parameters**: `user_id` (User ID)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "number",
        "number": "string",
        "appointment_date": "string",
        "appointment_time": "string",
        "appointment_status_id": "number",
        "booking_status": "string",
        "second_meeting_room_url": "string (nullable)",
        "Review": "object (nullable)",
        "Specialist": "object"
      }
    ]
  }
  ```

### Start Meeting (Tracker)
- **URL**: `/api/appointment/meetingroom/start`
- **Method**: `POST`
- **Description**: Log the start of a meeting session.
- **Request Data**:
  ```json
  {
    "user_id": "number",
    "appointment_number": "string",
    "start_datetime": "datetime",
    "end_datetime": ""
  }
  ```

### End Meeting (Tracker)
- **URL**: `/api/appointment/meetingroom/end`
- **Method**: `POST`
- **Description**: Log the end of a meeting session.
- **Request Data**:
  ```json
  {
    "user_id": "number",
    "appointment_number": "string",
    "start_datetime": "datetime",
    "end_datetime": "datetime"
  }
  ```

## Evaluation

### Submit Evaluation
- **URL**: `/api/evaluation`
- **Method**: `POST`
- **Description**: Submit feedback after a consultation session.
- **Request Data**:
  ```json
  {
    "overall_score": "number",
    "q1": "number",
    "q2": "number",
    "additional_comments": "string",
    "appointment_id": "number"
  }
  ```

## API Summary Table

| API | Endpoint | Method | Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| **Request OTP** | `/api/user-create-otp` | `POST` | `user_email` | `{ status, data: { ref_num } }` |
| **Verify OTP** | `/api/user-verify-otp` | `POST` | `otp_num`, `ref_num`, `user_email` | `{ status, message }` |
| **Create User / Login** | `/api/user` | `POST` | `email`, `organization_id` | `{ data: UserObject }` |
| **Get User Info** | `/api/user/:id` | `GET` | `id` | `{ data: UserObject }` |
| **Update User Info** | `/api/user/:id` | `PUT` | `id`, Body: User Fields | `{ status, data }` |
| **Update Treatment** | `/api/user/treatment-information/:id` | `POST` | `id`, Body: Treatment Fields | `{ status, data }` |
| **Get Banners** | `/api/banners` | `GET` | - | `{ data: [Banner] }` |
| **Get Specialists (Type)** | `/api/specialist/type/:type` | `GET` | `type` | `{ data: [Specialist] }` |
| **Get Specialist Detail** | `/api/specialist/:id` | `GET` | `id` | `{ data: SpecialistDetail }` |
| **Create Appointment** | `/api/appointment` | `POST` | Body: Appointment Fields | `{ status, message }` |
| **Get User Appointments** | `/api/appointment/:user_id` | `GET` | `user_id` | `{ data: [Appointment] }` |
| **Start Meeting** | `/api/appointment/meetingroom/start` | `POST` | Body: Meeting Info | - |
| **End Meeting** | `/api/appointment/meetingroom/end` | `POST` | Body: Meeting Info | - |
| **Submit Evaluation** | `/api/evaluation` | `POST` | Body: Evaluation Fields | - |
