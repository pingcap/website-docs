import axios from "axios";
import { Locale } from "shared/interface";
import { FeedbackCategory, TrackingType } from "./types";

const hubspotFormURL =
  "https://api.hsforms.com/submissions/v3/integration/submit/4466002/{{formId}}";

const hubspotForms = [
  {
    category: FeedbackCategory.Positive,
    tracking: TrackingType.Lite,
    formId: "08c7738f-9e08-4283-a080-179c224dfe9e",
  },
  {
    category: FeedbackCategory.Negative,
    tracking: TrackingType.Lite,
    formId: "2df2e54d-d82b-4262-8480-a250959503e8",
  },
  {
    category: FeedbackCategory.Positive,
    tracking: TrackingType.Detail,
    formId: "89234e15-05f2-42e2-9005-f50443c310db",
  },
  {
    category: FeedbackCategory.Negative,
    tracking: TrackingType.Detail,
    formId: "bfc8bbe6-8ed9-4a4c-8e9e-a875ee3ed26d",
  },
];

function getCookie(name: string) {
  const match = document.cookie.match(
    RegExp("(?:^|;\\s*)" + name + "=([^;]*)")
  );
  return match ? match[1] : null;
}

export function submitLiteFeedback(options: {
  locale: Locale;
  category: FeedbackCategory;
}) {
  const { locale, category } = options;
  const formId = hubspotForms.find(
    (item) => item.tracking === TrackingType.Lite && item.category === category
  )?.formId;

  if (!formId) {
    return;
  }

  const url = hubspotFormURL.replace("{{formId}}", formId);

  return axios
    .post(url, {
      fields: [
        {
          objectTypeId: "0-1",
          name: "hs_language",
          value: locale,
        },
        {
          objectTypeId: "0-1",
          name: "website",
          value: document.URL,
        },
      ],
      context: {
        hutk: getCookie("hubspotutk"),
        pageUri: document.URL,
        pageName: document.title,
      },
      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: "I agree to the PingCAP Privacy Policy.",
        },
      },
    })
    .catch((e) => {
      console.error("Failed to submit lite feedback to hubspot", e);
    });
}

export function submitFeedbackDetail(options: {
  locale: Locale;
  category: FeedbackCategory;
  reason: string;
}) {
  const { locale, category, reason } = options;
  const formId = hubspotForms.find(
    (item) =>
      item.tracking === TrackingType.Detail && item.category === category
  )?.formId;

  if (!formId) {
    return;
  }

  const url = hubspotFormURL.replace("{{formId}}", formId);

  return axios
    .post(url, {
      fields: [
        {
          objectTypeId: "0-1",
          name: "hs_language",
          value: locale,
        },
        {
          objectTypeId: "0-1",
          name: "message",
          value: reason,
        },
        {
          objectTypeId: "0-1",
          name: "website",
          value: document.URL,
        },
      ],
      context: {
        hutk: getCookie("hubspotutk"),
        pageUri: document.URL,
        pageName: document.title,
      },
      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: "I agree to the PingCAP Privacy Policy.",
        },
      },
    })
    .catch((e) => {
      console.error("Failed to submit feedback details to hubspot", e);
    });
}
