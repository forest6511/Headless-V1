import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('access_token')

    if (!accessToken?.value) {
      return NextResponse.json(
        { error: 'access token not found' },
        { status: 401 }
      )
    }

    const { pathname } = new URL(request.url)
    const body = await request.json()
    const requestUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${pathname}`

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const status = response.status
      const errorBody = await response.text()
      console.error(`Failed to request. Status: ${status}, Body: ${errorBody}`)
      return NextResponse.json(
        { error: 'Failed to request.', details: errorBody },
        { status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error during POST request:', error)
    return NextResponse.json(
      { error: 'unexpected error occurred' },
      { status: 500 }
    )
  }
}
