const BLOCKED_EVENT_FILTERS = [
  {
    name: "hubapi",
    matches: (event, hint) =>
      hasBlockedDomainReference(event, hint, "hubapi.com"),
  },
];

function beforeSendSentryEvent(event, hint) {
  for (const filter of BLOCKED_EVENT_FILTERS) {
    if (filter.matches(event, hint)) {
      return null;
    }
  }

  return event;
}

function hasBlockedDomainReference(event, hint, domain) {
  return collectSearchableValues(event, hint).some((value) =>
    containsDomain(value, domain)
  );
}

function collectSearchableValues(event, hint) {
  const values = [];

  pushString(values, event?.message);
  pushString(values, event?.request?.url);

  for (const exception of event?.exception?.values || []) {
    pushString(values, exception?.type);
    pushString(values, exception?.value);

    for (const frame of exception?.stacktrace?.frames || []) {
      pushString(values, frame?.filename);
    }
  }

  for (const breadcrumb of event?.breadcrumbs || []) {
    pushString(values, breadcrumb?.message);
    pushString(values, breadcrumb?.category);
    pushString(values, breadcrumb?.data?.url);
    pushString(values, breadcrumb?.data?.to);
    pushString(values, breadcrumb?.data?.from);
  }

  const originalException = hint?.originalException;

  if (typeof originalException === "string") {
    pushString(values, originalException);
  } else if (originalException instanceof Error) {
    pushString(values, originalException.message);
    pushString(values, originalException.stack);
  }

  return values;
}

function containsDomain(value, domain) {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }

  const normalizedValue = value.toLowerCase();
  const normalizedDomain = domain.toLowerCase();

  if (normalizedValue.includes(normalizedDomain)) {
    return true;
  }

  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return (
      hostname === normalizedDomain || hostname.endsWith(`.${normalizedDomain}`)
    );
  } catch {
    return false;
  }
}

function pushString(values, value) {
  if (typeof value === "string" && value.length > 0) {
    values.push(value);
  }
}

module.exports = {
  BLOCKED_EVENT_FILTERS,
  beforeSendSentryEvent,
  containsDomain,
  hasBlockedDomainReference,
};
