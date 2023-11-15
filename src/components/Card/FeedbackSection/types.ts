export const FeedbackCategory = {
  Positive: 'positive',
  Negative: 'negative'
} as const

export type FeedbackCategory = typeof FeedbackCategory[keyof typeof FeedbackCategory]

export const TrackingType = {
  Lite: 'lite',
  Detail: 'detail'
} as const

export type TrackingType = typeof TrackingType[keyof typeof TrackingType]
