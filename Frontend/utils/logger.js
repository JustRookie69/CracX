export function logEvent(eventType, payload) {
    const log = {
      eventType,
      payload,
      timestamp: new Date().toISOString()
    };
    console.log("Event:", log);
    // You can later add: send to server here
  }
  