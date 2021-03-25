import twilio from "twilio";

export const sendMessage = (
  sid: string,
  auth: string,
  from: string,
  to: string
) => async (message: Record<string, any>) => {
  const client = twilio(sid, auth);

  await client.messages.create({
    from,
    to,
    body: JSON.stringify(message, null, 2),
  });
};
