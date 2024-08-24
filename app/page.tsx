'use client'
import { Box, Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import Navbar from './components/layout/Navbar'
import { useSnackbar } from './context/SnackbarContext'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ])
  const [message, setMessage] = useState('')
  const { showSnackbar } = useSnackbar();

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let result = ''

      return reader?.read().then(function processText({ done, value }): Promise<string> {
        if (done) {
          return Promise.resolve(result)
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  const [professorUrl, setProfessorUrl] = useState('')

  const submitProfessorLink = async () => {
    try {
      const response = await fetch('/api/submit-professor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: professorUrl }),
      })
      const data = await response.json()
      if (data.success) {

        showSnackbar('Professor data added successfully', 'success');
        setProfessorUrl('')
      } else {
        showSnackbar('An error occurred during processing', 'error');
      }
    } catch (error) {
      console.error('Error:', error)
      showSnackbar('An error occurred during processing', 'error');
    }
  }

  return (
    <><Navbar />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          direction={'column'}
          width="500px"
          height="700px"
          border="1px solid white"
          bgcolor={"rgba(255, 255, 255, 0.6)"}
          borderRadius={5}
          p={2}
          spacing={3}
        >
          <Stack
            direction={'column'}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'assistant'
                      ? "#f0f0f0"
                      : "#0070f3"
                  }
                  fontFamily={"Orbitron"}
                  color={message.role === 'assistant' ? "#000" : "#fff"}
                  borderRadius={8}
                  p={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                '& input': {
                  fontFamily: 'Orbitron',
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Orbitron',
                  borderColor: 'white',
                  color: 'white',
                },
                '& .MuiInput-underline:before': {
                  borderColor: 'white',
                  color: 'white',
                },
                '& .MuiInput-underline:after': {
                  borderColor: 'white',
                  color: 'white',
                },
              }}
            />
            <Button variant="contained" sx={{
              fontFamily: 'Orbitron',
              color: 'white',
              backgroundColor: '#a7b80d',
              '&:hover': {
                backgroundColor: '#7f8c10',
              }
            }} onClick={sendMessage}>
              Send
            </Button>
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <TextField
              label="Professor Rate My Professor URL"
              fullWidth
              value={professorUrl}
              onChange={(e) => setProfessorUrl(e.target.value)}
              sx={{
                '& input': {
                  fontFamily: 'Orbitron',
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Orbitron',
                  borderColor: 'white',
                  color: 'white',
                },
                '& .MuiInput-underline:before': {
                  borderColor: 'white',
                  color: 'white',
                },
                '& .MuiInput-underline:after': {
                  borderColor: 'white',
                  color: 'white',
                },
              }}
            />
            <Button variant="contained" sx={{
              fontFamily: 'Orbitron',
              color: 'white',
              backgroundColor: '#a7b80d',
              '&:hover': {
                backgroundColor: '#7f8c10',
              }
            }} onClick={submitProfessorLink}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}