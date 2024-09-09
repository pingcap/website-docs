import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import { useState } from "react";
import { z } from "zod";

import axios from "axios";

import { LoadingButton } from "@mui/lab";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { Locale } from "shared/interface";

type FormType = {
  email: string;
  loading: boolean;
  error: null | "invalidEmail" | "networkError";
};

// Collect email address that subscribe to TiDB release and send it to the SendGrid API
function EmailSubscriptionForm() {
  const { t } = useI18next();

  const API_URL =
    "https://03tryjsrrb.execute-api.us-west-2.amazonaws.com/Prod/subscribe/";

  const [formData, setFormData] = useState<FormType>({
    email: "",
    loading: false,
    error: null,
  });
  const [success, setSuccess] = useState(false);

  const validateEmail = (): boolean => {
    // Set up a schema for validating the email address
    const schema = z.string().email();

    try {
      schema.parse(formData.email);
      return true;
    } catch (e) {
      console.error(e);
      setFormData({ ...formData, error: "invalidEmail" });
      return false;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData((prevState) => ({ ...prevState, email: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateEmail()) {
      // Submitting...
      setFormData({ ...formData, loading: true, error: null });

      try {
        const payload = new URLSearchParams({
          email: formData.email,
        });
        await axios.post(API_URL, payload);

        setFormData({ ...formData, loading: false, error: null });
        setSuccess(true);
      } catch (e) {
        setFormData({ ...formData, loading: false, error: "networkError" });
        console.error(e);
      }
    }
  };

  return (
    <div>
      <p>
        <strong>
          <Trans i18nKey="releaseSubscription.title" />
        </strong>
      </p>

      {!success ? (
        <div>
          <form onSubmit={handleSubmit}>
            <Box display="flex" alignItems="baseline">
              <TextField
                size="small"
                variant="outlined"
                type="text"
                name="email"
                placeholder={t("releaseSubscription.placeholder")}
                value={formData.email}
                onChange={handleChange}
                error={!!formData.error}
                helperText={
                  !!formData.error
                    ? formData.error === "invalidEmail"
                      ? t("releaseSubscription.error.invalidEmail")
                      : t("releaseSubscription.error.networkError")
                    : " "
                }
              />

              <LoadingButton
                type="submit"
                variant="contained"
                loading={formData.loading}
                aria-label="subscribe"
                sx={{
                  ml: 2,
                  backgroundColor: "website.k1",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#0A85C2",
                    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.16)",
                  },
                  "&.MuiLoadingButton-loading": {
                    color: "rgba(0, 0, 0, 0.26)",
                  },
                  ".MuiLoadingButton-loadingIndicator": {
                    position: "initial",
                    left: "auto",
                    transform: "none",
                    mr: 1,
                  },
                }}
              >
                <Trans i18nKey="releaseSubscription.button.subscribe" />
              </LoadingButton>
            </Box>
          </form>
        </div>
      ) : (
        <Box>
          <p>
            <span
              role="img"
              aria-label="love-letter"
              style={{ marginRight: "0.2rem" }}
            >
              💌
            </span>
            <Trans i18nKey="releaseSubscription.success" />
          </p>
        </Box>
      )}
    </div>
  );
}

export function EmailSubscriptionWrapper() {
  const { language } = useI18next();
  const disabled = language === Locale.ja;

  if (disabled) {
    return null;
  }

  return <EmailSubscriptionForm />;
}
