import { NextResponse } from 'next/server'

export async function handleErrorResponse(
  response: Response,
  errorContext: string
): Promise<NextResponse> {
  const status = response.status
  const errorBody = await response.json()

  console.error(`${errorContext} Status: ${status}, Body: ${errorBody.error}`)

  return NextResponse.json(
    {
      error: 'Failed to request.',
      details: errorBody.error,
    },
    { status }
  )
}
