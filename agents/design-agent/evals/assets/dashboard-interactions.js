(() => {
  if (window.__interactionHarness?.ready) return;

  const style = document.createElement("style");
  style.dataset.interactionHarness = "true";
  style.textContent = `
    button:disabled {
      cursor: not-allowed;
      color: #626b78;
      background: #e5e8ed;
      border-color: #c2c8d1;
      opacity: 1;
    }
    .interaction-feedback {
      grid-column: 1 / -1;
      margin: 0;
      padding: 9px 11px;
      border-radius: 6px;
      background: #eef5ff;
      color: #153d73;
      font-weight: 700;
    }
    .interaction-error {
      grid-column: 1 / -1;
      margin: 0;
      padding: 9px 11px;
      border: 1px solid #d4554d;
      border-radius: 6px;
      background: #fff1f0;
      color: #8f1712;
      font-weight: 700;
    }
    [hidden] { display: none !important; }
  `;
  document.head.append(style);

  const critical = document.querySelector(".incident.critical");
  const assign = critical?.querySelector(".incident-actions .primary");
  const ownerLine = critical?.querySelector("p");
  if (!critical || !assign || !ownerLine) {
    throw new Error("Interaction harness cannot find the critical incident");
  }
  assign.id = "assign-owner";
  assign.setAttribute("aria-describedby", "assignment-status assignment-error");

  const status = document.createElement("p");
  status.id = "assignment-status";
  status.className = "interaction-feedback";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.hidden = true;

  const error = document.createElement("p");
  error.id = "assignment-error";
  error.className = "interaction-error";
  error.setAttribute("role", "alert");
  error.textContent = "Owner could not be assigned. Check permissions and retry.";
  error.hidden = true;
  critical.append(status, error);

  const bulk = [...document.querySelectorAll(".toolbar button")].find(
    (button) => button.textContent.trim() === "Bulk edit",
  );
  const selectionStatus = document.querySelector(".selection-status");
  const selectAll = document.querySelector("#select-all");
  const tableChecks = [...document.querySelectorAll("tbody input[type=checkbox]")];
  const listChecks = [...document.querySelectorAll(".ticket-list input[type=checkbox]")];
  if (!bulk || !selectionStatus || !selectAll || tableChecks.length !== 5 || listChecks.length !== 5) {
    throw new Error("Interaction harness cannot find ticket selection controls");
  }
  bulk.id = "bulk-edit";
  tableChecks.forEach((checkbox, index) => {
    checkbox.dataset.ticketId = ["8941", "8937", "8928", "8919", "8911"][index];
  });
  listChecks.forEach((checkbox, index) => {
    checkbox.dataset.ticketId = ["8941", "8937", "8928", "8919", "8911"][index];
  });

  const selected = new Set();
  const updateSelection = () => {
    [...tableChecks, ...listChecks].forEach((checkbox) => {
      checkbox.checked = selected.has(checkbox.dataset.ticketId);
    });
    selectAll.checked = selected.size === tableChecks.length;
    selectAll.indeterminate = selected.size > 0 && selected.size < tableChecks.length;
    bulk.disabled = selected.size === 0;
    selectionStatus.textContent =
      selected.size === 1 ? "1 ticket selected" : `${selected.size} tickets selected`;
    window.__interactionHarness.selected = [...selected];
  };

  [...tableChecks, ...listChecks].forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selected.add(checkbox.dataset.ticketId);
      else selected.delete(checkbox.dataset.ticketId);
      updateSelection();
    });
  });
  selectAll.addEventListener("change", () => {
    selected.clear();
    if (selectAll.checked) tableChecks.forEach((checkbox) => selected.add(checkbox.dataset.ticketId));
    updateSelection();
  });

  let assignmentAttempt = 0;
  assign.addEventListener("click", () => {
    assignmentAttempt += 1;
    error.hidden = true;
    status.hidden = false;
    status.textContent = "Assigning Maya to Payments API…";
    assign.disabled = true;
    assign.setAttribute("aria-busy", "true");
    assign.textContent = "Assigning…";
    window.__interactionHarness.assignment = "loading";

    window.setTimeout(() => {
      assign.removeAttribute("aria-busy");
      if (assignmentAttempt === 1) {
        status.hidden = true;
        error.hidden = false;
        assign.disabled = false;
        assign.textContent = "Retry assignment";
        window.__interactionHarness.assignment = "error";
        return;
      }
      error.hidden = true;
      status.hidden = false;
      status.textContent = "Payments API assigned to Maya.";
      ownerLine.textContent = "Owner: Maya · 142 tickets";
      assign.disabled = true;
      assign.textContent = "Assigned to Maya";
      window.__interactionHarness.assignment = "success";
    }, 900);
  });

  window.__interactionHarness = {
    ready: true,
    assignment: "idle",
    selected: [],
  };
  updateSelection();
})();
