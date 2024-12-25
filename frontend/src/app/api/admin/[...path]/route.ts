import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

/**
 * Next.js (Server) 経由でリクエストを Spring Boot に転送します。
 *
 * このフローは、クッキーをクライアント側で直接扱えないようにするためのものです。
 * フロー: Next.js (Client) -> Next.js (Server) (トークンを含む) -> Spring Boot
 *
 * @param {NextRequest} request - Next.js からのリクエストオブジェクト。
 * @param {string} method - HTTP メソッド (例: 'GET', 'POST', 'PUT', 'DELETE')。
 * @returns {Promise<NextResponse>} リクエスト結果を含むレスポンスオブジェクト。
 */
async function handleRequest(
  request: NextRequest,
  method: string
): Promise<NextResponse> {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('access_token')

    if (!accessToken?.value) {
      return NextResponse.json(
        { error: 'access token not found' },
        { status: 401 }
      )
    }

    // URLの取得とクエリパラメータの処理
    const url = new URL(request.url)
    const { pathname, searchParams } = url
    const requestUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken.value}`,
    }

    const options: RequestInit = {
      method,
      headers,
    }

    // リクエストボディの処理
    const body = await request.json().catch(() => null)
    if (body && Object.keys(body).length > 0) {
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

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET')
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE')
}
