require('dotenv').config();


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();



app.use(cors());
app.use(bodyParser.json());


const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI , { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


const surveyResponseSchema = new mongoose.Schema({
  sessionId: String,
  responses: Object,
  status: { type: String, default: 'IN_PROGRESS' },
});

const SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema);


app.post('/api/submit-survey', async (req, res) => {
  const { sessionId, responses } = req.body;

  if (!sessionId || !responses) {
    return res.status(400).json({ message: 'Invalid data submitted.' });
  }

  try {
    
    const survey = new SurveyResponse({ sessionId, responses });
    await survey.save();

    res.status(200).json({ message: 'Survey submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving survey response.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
