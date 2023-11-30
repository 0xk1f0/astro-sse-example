import { Emitter } from "../events"

export async function GET() {

    console.log("stream.js> get()")

    let events_listener: (counter: any) => void;

    const stream = new ReadableStream({
        start(controller) {
            events_listener = (counter) => {
                console.log(`stream.ts> counter = ${counter}`)
                const data = `data: ${JSON.stringify({ counter })}\r\n\r\n`;
                controller.enqueue(data)
            }
            Emitter.off('count', events_listener)
            Emitter.on('count', events_listener)
        },
        cancel() {
            // remove listener
            console.log("stream.ts> cancel()")
            Emitter.removeListener('count', events_listener)
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
