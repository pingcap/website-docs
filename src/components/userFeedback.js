import '../styles/components/userFeedback.scss'

import React, { useRef, useState } from 'react'
import HubspotForm from 'react-hubspot-form'
import Loading from '../components/loading'
import { FormattedMessage } from 'react-intl'
import { trackCustomEvent } from 'gatsby-plugin-google-analytics'

const UserFeedback = ({ title, locale }) => {
  const feedbackBodyRef = useRef(null)
  const feedbackCloseRef = useRef(null)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [showYesFollowUp, setShowYesFollowUp] = useState(false)

  const setDocHelpful = (docTitle, isHelpful) => {
    trackCustomEvent({
      category: isHelpful
        ? `doc-${locale}-useful-test`
        : `doc-${locale}-useless-test`,
      action: 'click',
      label: docTitle,
      transport: 'beacon',
    })

    setShowFollowUp(true)

    if (isHelpful) {
      setShowYesFollowUp(true)
    }
  }

  const showThumbs = () => {
    if (!feedbackCloseRef.current.classList.contains('show-feedback-close')) {
      feedbackBodyRef.current.classList.add('show-feedback-body')
      feedbackCloseRef.current.classList.add('show-feedback-close')
    }
  }

  const closeFeedback = () => {
    if (feedbackCloseRef.current.classList.contains('show-feedback-close')) {
      setShowFollowUp(false)
      setShowYesFollowUp(false)
      feedbackBodyRef.current.classList.remove('show-feedback-body')
      feedbackCloseRef.current.classList.remove('show-feedback-close')
    }
  }

  return (
    <section className="PingCAP-UserFeedback feedback-prompt">
      <div className="feedback-header">
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className="feedback-title"
          onClick={showThumbs}
          onKeyDown={showThumbs}
        >
          <FormattedMessage id="docHelpful.header" />
        </div>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className="close-icon"
          onClick={closeFeedback}
          onKeyDown={closeFeedback}
          ref={feedbackCloseRef}
        >
          x
        </div>
      </div>
      <div className="feedback-body" ref={feedbackBodyRef}>
        {!showFollowUp && (
          <div className="thumbs">
            <div
              role="button"
              tabIndex={0}
              className="thumb thumb-up"
              onClick={() => setDocHelpful(title, true)}
              onKeyDown={() => setDocHelpful(title, true)}
            >
              <FormattedMessage id="docHelpful.thumbUp" />
            </div>
            <div
              role="button"
              tabIndex={0}
              className="thumb thumb-down"
              onClick={() => setDocHelpful(title, false)}
              onKeyDown={() => setDocHelpful(title, false)}
            >
              <FormattedMessage id="docHelpful.thumbDown" />
            </div>
          </div>
        )}

        {showFollowUp && (
          <div className="feedback-form">
            <HubspotForm
              portalId="4466002"
              formId={`${
                showYesFollowUp
                  ? locale === 'en'
                    ? 'c955b3db-740a-4f96-9d2b-011e2cd80ad6'
                    : 'caf4026d-e3a0-4285-8f80-fcdee324f50d'
                  : locale === 'en'
                  ? '3c501775-c64d-4a9e-898b-7efef630bbf4'
                  : '4bf44ac7-4104-4eca-a57c-4dd9e5cc87b9'
              }`}
              loading={<Loading wholeSreen={false} />}
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default UserFeedback
