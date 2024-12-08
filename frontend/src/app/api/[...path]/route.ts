import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

// 共通処理を抽出した関数
async function handleRequest(request: NextRequest, method: string) {
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
    const requestUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${pathname}`

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken.value}`,
    }

    // DELETE以外はbodyを含める
    const options: RequestInit = {
      method,
      headers,
    }

    if (method !== 'DELETE') {
      const body = await request.json()
      options.body = JSON.stringify(body)
    }

    const response = await fetch(requestUrl, options)

    if (!response.ok) {
      const status = response.status
      const errorBody = await response.text()
      console.error(
        `Failed to ${method} request. Status: ${status}, Body: ${errorBody}`
      )
      return NextResponse.json(
        { error: 'Failed to request.', details: errorBody },
        { status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error during ${method} request:`, error)
    return NextResponse.json(
      { error: 'unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST')
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT')
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE')
}
