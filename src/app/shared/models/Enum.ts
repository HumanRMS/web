export enum LeaveEventType
{
    Paid = 1,
    Medical = 2,
    UnPaid = 3,
    Oraganization = 4
}

export enum DurationType
{
    FullDay = 1,
    HalfDay = 2
}

export enum LeaveStatus
{
    Pending = 1,
    Approved = 2,
    Rejected = 3,
    Cancel = 4
}

export enum AssigneeType
{
    CreatedBy = 1,
    Approver = 2,
    Viewer = 3
}

export enum APIResponseStatus
{
    Success = 1,
    Failed = 2,
    Conflict = 3
}