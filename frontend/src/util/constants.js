export const REQUEST_MAPPING = {
    APPROVED: { status: 'approved', action: 'Approve' },
    REJECTED: { status: 'rejected', action: 'Reject' },
    PENDING: { status: 'pending', action: 'Pend' },
    CANCELLED: { status: 'canceled', action: 'Cancel' }
}

export const LEAVE_TYPES = {
    ANNUAL: 'annual-leave',
    SICK: 'sick-leave',
    PARENTING: 'parenting-leave',
    UNPAID: 'unpaid-leave',
    STUDY: 'study-leave',
    HALF_DAY: 'half-day-leave',
    BEREAVEMENT_LEAVE: 'bereavement-leave',
    MARRIAGE_LEAVE: 'marriage-leave'
}

export const HUMAN_LEAVE_TYPES = {
    'annual-leave': 'Annual Leave',
    'sick-leave': 'Sick Leave',
    'parenting-leave': 'Parenting Leave',
    'unpaid-leave': 'Unpaid Leave',
    'study-leave': 'Study Leave',
    'half-day-leave': 'Half Day Off',
    'bereavement-leave': 'Bereavement Leave',
    'marriage-leave': 'Marriage Leave'
}
