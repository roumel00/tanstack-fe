export type NotificationContext =
  | {
      type: 'invite_sent'
      title: string
      actorId: string
      actorName: string
      inviteeEmail: string
    }
  | {
      type: 'invite_cancelled'
      title: string
      actorId: string
      actorName: string
      inviteeEmail: string
    }
  | {
      type: 'role_changed'
      title: string
      actorId: string
      actorName: string
      newRole: string
      previousRole: string
    }
  | {
      type: 'member_removed'
      title: string
      actorId: string
      actorName: string
      targetName: string
      targetEmail: string
    }

export type Notification = {
  _id: string
  workspaceId: string
  recipientId: string
  context: NotificationContext
  read: boolean
  createdAt: string
}
