export type ReCaptchaResponse = {
  success: boolean
  score: number
  action: string
  challenge_ts: string
  hostname: string
}
