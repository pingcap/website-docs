import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import { useState } from "react";
import { z } from "zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { errorMessage } from "./email-subscription-form.module.css";

type FormType = {
  email: string;
  loading: boolean;
  error: null | "invalidEmail" | "networkError";
};
export function EmailSubscriptionWrapper() {
  const { language } = useI18next();
  const disabled = language === Locale.ja;
  
  if (disabled) {
  	return null;
  }
  
  return <EmailSubscriptionForm />
}

// Collect email address that subscribe to TiDB release and send it to the SendGrid API
function EmailSubscriptionForm() {
  const { t, navigate } = useI18next();

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
        await fetch(API_URL, {
          method: "POST",
          body: `email=${formData.email}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

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
          <Trans i18nKey="releaseSubscription.title" />:
        </strong>
      </p>

      {!success ? (
        <div>
          <form onSubmit={handleSubmit}>
            <Box display="flex" alignItems="center">
              <TextField
                size="small"
                variant="outlined"
                type="text"
                name="email"
                placeholder={t("releaseSubscription.placeholder")}
                value={formData.email}
                onChange={handleChange}
              />
              <Button
                type="submit"
                disabled={formData.loading}
                variant="contained"
                color="primary"
                sx={{ marginLeft: "1rem" }}
              >
                {formData.loading ? (
                  <Trans i18nKey="releaseSubscription.button.subscribing" />
                ) : (
                  <Trans i18nKey="releaseSubscription.button.subscribe" />
                )}
              </Button>
            </Box>
          </form>
          {formData.error && (
            <p className={errorMessage}>
              {formData.error === "invalidEmail" ? (
                <Trans i18nKey="releaseSubscription.error.invalidEmail" />
              ) : (
                <Trans i18nKey="releaseSubscription.error.networkError" />
              )}
            </p>
          )}
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
