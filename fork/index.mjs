import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import { OAuthSession } from "../../../services/oauth-local/src/index.mjs"
import { twentyEightApiFetch, TwentyEightApiFetchServerError, TwentyEightApiFetchClientError } from '../../../services/twenty-eight-api-fetch/src/index.mjs'
import "./dotenv.mjs"

let session = new OAuthSession({
  id: 'jchat-fork',
  codeUrl: 'https://id.twitch.tv/oauth2/authorize',
  tokenUrl: 'https://id.twitch.tv/oauth2/token',
  clientId: process.env.TWITCH_CLIENT_ID,
  clientSecret: process.env.TWITCH_CLIENT_SECRET,
  scopes: []
})

await session.start()

const app = express()

const port = 54021

app.use(express.json());
app.use(cors());

function asyncHandler(handler) {
  return (req, res, next) => {
    handler(req, res).catch((error) => {
      next(error)
    })
  }
}

app.use('/fork/customcss.css', express.static('./customcss.css'))
app.use('/v2', express.static('../v2'))
app.use('/img', express.static('../img'))
app.use('/styles', express.static('../styles'))
app.use('/settings.js', express.static('../settings.js'))
app.use('/utils.js', express.static('../utils.js'))

app.get('/user-badges', asyncHandler(async (req, res) => {
  res.json({
  })
}))

app.get('/cheermotes', asyncHandler(async (req, res) => {
  let { broadcaster_id } = req.query

  let response = await session.try(({ accessToken, clientId }) => fetch(
    'https://api.twitch.tv/helix/bits/cheermotes?' + new URLSearchParams({ broadcaster_id }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': clientId
      },
    }
  ))

  res.json(await response.json())
}))

app.use(function (err, req, res, next) {
  console.error(err.stack)

  res.status(500).json({
    name: 'UnknownServerError',
    message: 'Unknown Server error.'
  })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
