import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

/**
 * @async
 * @function GET
 * @param {NextRequest} req Request object -- interview ID from req
 * @returns {Promise<NextResponse>} JSON with retrieve status of token
 * @throws {Error} On database errors, failed to retrieve saved token details, or unauthorized access
 * @description This endpoint is used to retrieve a token for the LiveKit
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const interviewId = url.searchParams.get("id");
  const authId = url.searchParams.get("authId");

  const roomName = `${interviewId}&${authId}`;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const at = new AccessToken(apiKey, apiSecret, {
    identity: "You",
  });
  at.addGrant({
    room: roomName || "",
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  });
  return NextResponse.json(
    {
      roomName,
      accessToken: await at.toJwt(),
      url: process.env.LIVEKIT_URL,
    },
    { status: 200 }
  );
}
