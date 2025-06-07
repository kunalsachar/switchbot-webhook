const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Your SwitchBot credentials
const SWITCHBOT_TOKEN = 'dd11f27460f3c602e9a5cdfbdc902a2dd4cfa8454dd7e572d04f046d809d330549d6dfaea5a2a8044b1e1b3fbe40188b';
const DEVICE_ID = 'DA:7C:CB:C0:5E:31';
const SECURITY_KEY = 'c430392fc1d1e4cd1fac130416680db5';

// Allow only Twilio calls from this number
const ALLOWED_NUMBERS = ['+16042596143'];

app.post('/twilio-webhook', async (req, res) => {
  const caller = req.body.From;
  console.log(`Incoming call from: ${caller}`);

  if (!ALLOWED_NUMBERS.includes(caller)) {
    return res.type('text/xml').send(`<Response><Say>Access denied.</Say><Hangup/></Response>`);
  }

  try {
    // Trigger SwitchBot
    await axios.post(`https://api.switch-bot.com/v1.0/devices/${DEVICE_ID}/commands`, {
      command: 'press',
      parameter: 'default',
      commandType: 'command'
    }, {
      headers: {
        'Authorization': SWITCHBOT_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    res.type('text/xml').send(`
      <Response>
        <Say voice="alice">Gate has been opened. Goodbye.</Say>
        <Hangup/>
      </Response>
    `);
  } catch (error) {
    console.error('SwitchBot Error:', error.message);
    res.type('text/xml').send(`
      <Response>
        <Say voice="alice">Error opening the gate. Please try again later.</Say>
        <Hangup/>
      </Response>
    `);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
