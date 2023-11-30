import { Emitter } from "../events"

export async function GET() {

    console.log("stream.js> get()")

    const stream = new ReadableStream({
        start(controller) {
            const events_listener = (counter) => {
                console.log(`stream.ts> counter = ${counter}`)
                const data = `data: ${JSON.stringify({ counter })}\r\n\r\n`;
                controller.enqueue(data)
            }
            Emitter.off('count', events_listener)
            Emitter.on('count', events_listener)
        },
        cancel() {
            // remove all current listeners
            console.log("stream.ts> cancel()")
            Emitter.removeAllListeners()
        }
    })

    return new Response(stream, {
        status: 200,
        headers: {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        }
    });
}
