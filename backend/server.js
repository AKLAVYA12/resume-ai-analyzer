const express = require('express')
const cors = require('cors')
const multer = require('multer')
const { PDFParse } = require('pdf-parse')
require('dotenv').config()
const Groq = require('groq-sdk')


const app = express()
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const upload = multer()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend is running')
})

app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const parser = new PDFParse({ data: req.file.buffer })
    const pdfData = await parser.getText()

    const resumeText = pdfData.text
    const jobDescription = req.body.jobDescription
    
    const prompt = `
    You are an AI resume analyzer.

    Compare the resume with the job description.

    Resume:
    ${resumeText}

    Job Description:
    ${jobDescription}

    Give response in this format:
    1. Match Score out of 100
    2. Missing Keywords
    3. Strengths
    4. Improvements
    `
    const completion = await groq.chat.completions.create({
    messages: [
        {
        role: 'user',
        content: prompt,
        },
    ],
    model: 'llama-3.3-70b-versatile',
    })
     res.json({
     message: 'Analysis complete',
     result: completion.choices[0].message.content,
  })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error parsing PDF' })
  }
})

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})
