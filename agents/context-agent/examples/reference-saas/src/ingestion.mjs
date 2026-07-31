export function acceptEvent(event) {
  if (!event.workspaceId || !event.eventId) {
    throw new Error("workspaceId and eventId are required");
  }
  return {
    ...event,
    receivedAt: new Date().toISOString(),
  };
}
