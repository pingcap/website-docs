import {
  closeIcon,
  feedbackPrompt,
  feedbackHeader,
  feedbackTitle,
  feedbackBody,
  feedbackForm,
  thumbs,
  thumb,
} from './user-feedback.module.scss'

import { useState } from 'react'

import { FormattedMessage } from 'react-intl'
import HubspotForm from 'react-hubspot-form'
import { Loading } from 'components/Loading'
import { trackCustomEvent } from 'gatsby-plugin-google-analytics'
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi'

import { Locale } from 'typing'

interface Props {
  title: string
  locale: Locale
}

export function UserFeedback({ title, locale }: Props) {
  const [showCloseBtn, setShowCloseBtn] = useState(false)
  const [showFeedbackBody, setShowFeedbackBody] = useState(false)
  const [showYesFollowUp, setShowYesFollowUp] = useState('unset')

  const setDocHelpful = (docTitle: string, isHelpful: boolean) => () => {
    trackCustomEvent({
      category: isHelpful ? `doc-${locale}-useful` : `doc-${locale}-useless`,
      action: 'click',
      label: docTitle,
      transport: 'beacon',
    })

    if (isHelpful) {
      setShowYesFollowUp('show')
    } else {
      setShowYesFollowUp('hide')
    }
  }

  const showThumbs = () => {
    setShowCloseBtn(true)
    setShowFeedbackBody(true)
  }

  const closeFeedback = () => {
    setShowFeedbackBody(false)
    setShowCloseBtn(false)
    setShowYesFollowUp('unset')
  }

  return (
    <section className={feedbackPrompt}>
      <div className={feedbackHeader}>
        <div
          className={feedbackTitle}
          onClick={showThumbs}
          onKeyDown={showThumbs}>
          <FormattedMessage id="docHelpful.header" />
        </div>
        {showCloseBtn && (
          <button
            className={closeIcon}
            onClick={closeFeedback}
            onKeyDown={closeFeedback}>
            x
          </button>
        )}
      </div>
      {showFeedbackBody && (
        <div className={feedbackBody}>
          {showYesFollowUp === 'unset' && (
            <div className={thumbs}>
              <button
                className={thumb}
                onClick={setDocHelpful(title, true)}
                onKeyDown={setDocHelpful(title, true)}>
                <FiThumbsUp />
                <span><FormattedMessage id="docHelpful.thumbUp" /></span>
              </button>
              <button
                className={thumb}
                onClick={setDocHelpful(title, false)}
                onKeyDown={setDocHelpful(title, false)}>
                <FiThumbsDown />
                <span><FormattedMessage id="docHelpful.thumbDown" /></span>
              </button>
            </div>
          )}

          {showYesFollowUp !== 'unset' && (
            <div className={feedbackForm}>
              <HubspotForm
                portalId="4466002"
                formId={`${
                  showYesFollowUp === 'show'
                    ? locale === 'en'
                      ? 'c955b3db-740a-4f96-9d2b-011e2cd80ad6'
                      : 'caf4026d-e3a0-4285-8f80-fcdee324f50d'
                    : locale === 'en'
                    ? '3c501775-c64d-4a9e-898b-7efef630bbf4'
                    : '4bf44ac7-4104-4eca-a57c-4dd9e5cc87b9'
                }`}
                loading={<Loading wholeScreen={false} />}
              />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
