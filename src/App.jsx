import { useState } from 'react'
import './index.css'

function App() {
  const [resume, setresume] = useState(null)
  const [jobDescription, setjobDescription] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  

  const handlefile = (event) => {
    const file = event.target.files[0]
    setresume(file)
  }

  const handlesubmit = async () => {
    const formData = new FormData()
    formData.append('resume', resume)
    formData.append('jobDescription', jobDescription)

    setLoading(true)
    setResult('')

    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    setResult(data.result)
    setLoading(false)
  }

  return (
    <div>
      <h1>AI Resume Checker</h1>
      <input type="file" onChange={handlefile} />
      <br />
      <textarea
        placeholder="paste job description here"
        rows={10}
        cols={50}
        value={jobDescription}
        onChange={(e) => setjobDescription(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handlesubmit}>check resume</button>
      <br />
      <br />
      <h3>display here</h3>
      <p>{result}</p>
      <p>{resume ? resume.name : 'No file selected'}</p>
    </div>
  )
}

export default App
