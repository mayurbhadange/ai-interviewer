import { NextRequest, NextResponse } from "next/server";
import {
  WebhookReceiver,
  EgressClient,
  GCPUpload,
  EncodedFileOutput,
} from "livekit-server-sdk";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY as string,
  process.env.LIVEKIT_API_SECRET as string
);

/**
 * @async
 * @function POST
 * @param {NextRequest} req Request object
 * @returns {Promise<NextResponse>} JSON with saving the video url in DB
 * @throws {Error} On database errors, failed to save video url, or unauthorized access
 * @description This endpoint is used to start a webhook from LiveKit and call events :-
 *   - On "room_started" event the Egress is initialized and Google Cloud Storage configurations are made
 *   - On "room_finished" event the video url is stored in database and cached in redis
 */
export async function POST(req: NextRequest) {
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);

  try {
    const event = await receiver.receive(
      rawBody.toString(),
      req.headers.get("authorization") || undefined
    );

    console.log("Received webhook event:", event);
    const eventType = event.event;

    switch (eventType) {
      case "room_started":
        console.log("room_started");
        const roomName = event.room?.name;
        const outputs = {
          file: new EncodedFileOutput({
            filepath: `${event.room?.sid}.mp4`,
            output: {
              case: "gcp",
              value: new GCPUpload({
                bucket: "",
                credentials: "",
              }),
            },
          }),
        };

        try {
          const egressClient = new EgressClient(process.env.LIVEKIT_URL!);
          const egress = await egressClient.startRoomCompositeEgress(
            roomName!,
            outputs
          );
          console.log(
            egress,
            "EGRESS OBJECT - ____________________________________"
          );
        } catch (error) {
          console.log(error);
        }
        break;

      case "room_finished":
        console.log("room_finished");
        const userId = event.room?.name;

        try {
          // handle saving the video in database here
          return NextResponse.json(
            {
              status: true,
              message: "Interview details saved successfully!",
            },
            { status: 200 }
          );
        } catch (dbError) {
          console.error("Database Error:", dbError);
        }
        break;

      default:
        console.log("Unhandled event type:", eventType);
        break;
    }

    return NextResponse.json(
      { message: "Webhook event received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
