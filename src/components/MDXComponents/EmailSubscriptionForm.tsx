import { Trans, useI18next } from "gatsby-plugin-react-i18next"
import { useState } from "react"
import { z } from "zod"

import axios from "axios"

import { LoadingButton } from "@mui/lab"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"


type FormType = {
  email: string;
  loading: boolean;
  error: null | "invalidEmail" | "networkError";
};


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

        await axios.post(API_URL, undefined, {
          email: formData.email
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
                error={!!formData.error}
                helperText={formData.error === "invalidEmail" ? t('releaseSubscription.error.invalidEmail') : t('releaseSubscription.error.networkError')}
              />

              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={formData.loading}
                loadingIndicator={t('releaseSubscription.button.subscribing')}
                ml="1rem"
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
  
  return <EmailSubscriptionForm />
}
