# System Workflow Diagram

## High Level User Journey

```mermaid
graph TD
    User([User])
    subgraph "Authentication"
        Login[Login Page]
        OTP[OTP Page]
        Terms[PDPA/Terms Page]
    end

    subgraph "Main Application"
        Home[Home Page]
        Update[Update Profile]
        Form[Assessment Form]
        History[History Page]
        Specialist[Specialist List]
        Appt[Appointment Page]
        Confirm[Confirm Page]
    end

    subgraph "Consultation"
        Meet[Video Conference (Jitsi)]
        Eval[Evaluation Page]
    end

    subgraph "External Services"
        API[API Server]
        CS[Chatwoot Support]
    end

    User --> Login
    Login -- Input Email --> API
    API -- Send OTP --> User
    Login --> OTP
    OTP -- Verify OTP --> API
    API -- Token/User Data --> OTP
    OTP --> Terms
    Terms -- Accept --> Home
    Terms -- Reject --> Login

    Home --> Specialist
    Home --> History
    Home --> Update
    Home --> CS

    Update -- Save Profile --> API
    
    Specialist -- Select Expert --> Appt
    Appt -- Check Medical Info --> API
    API -- Info Missing --> Form
    Form -- Submit Info --> API
    API -- Success --> Appt

    Appt -- Book Slot --> API
    API -- Confirmed --> Confirm
    Confirm --> Home

    History -- Get Appointments --> API
    History -- Join Room (15 min before) --> Meet
    
    Meet -- Start Log --> API
    Meet -- Consultation Session --> User
    Meet -- End Log --> API
    Meet --> Eval

    Eval -- Submit Rating --> API
    Eval --> Home
```
