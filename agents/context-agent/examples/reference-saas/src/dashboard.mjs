export function dashboardQuery({ workspaceId, dashboardId }) {
  return {
    workspaceId,
    dashboardId,
    source: "hourly-metric-aggregates",
  };
}
