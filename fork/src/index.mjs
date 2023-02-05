import express from 'express'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { twitchApiRequest } from "../../../../services/twitch-api-request/src/index.mjs"
import { OAuthSession } from "../../../../services/oauth-local/src/index.mjs"
import { twentyEightApiFetch, TwentyEightApiFetchServerError, TwentyEightApiFetchClientError } from '../../../../services/twenty-eight-api-fetch/src/index.mjs'
import "./dotenv.mjs"

async function userId(session, login) {
  console.log(`Retrieving id of ${login}`)

  let response = await session.try(({ accessToken, clientId }) => twitchApiRequest({
    url: 'https://api.twitch.tv/helix/users',
    query: {
      login
    },
    clientId,
    accessToken
  }))

  if (response.data.length === 0) {
    throw new Error(`Could not find ${login}`)
  }

  return response.data.data[0].id
}

let session = new OAuthSession({
  id: 'jchat-fork',
  codeUrl: 'https://id.twitch.tv/oauth2/authorize',
  tokenUrl: 'https://id.twitch.tv/oauth2/token',
  clientId: process.env.TWITCH_CLIENT_ID,
  clientSecret: process.env.TWITCH_CLIENT_SECRET,
  scopes: []
})

await session.start()

let broadcasterId = await userId(session, process.env.TWITCH_CHANNEL)

const app = express()

const port = process.env.PORT

app.use(express.json());
app.use(cors());

function asyncHandler(handler) {
  return (req, res, next) => {
    handler(req, res).catch((error) => {
      next(error)
    })
  }
}

app.get('/info', asyncHandler(async (req, res) => {
  res.json({
    channelName: process.env.TWITCH_CHANNEL,
    channelId: broadcasterId,
  })
}))

app.use('/color', createProxyMiddleware(`${process.env.CENTRAL_WS_API_PREFIX}/color`));

app.use('/fork/customcss.css', express.static('./customcss.css'))
app.use('/v2', express.static('../v2'))
app.use('/img', express.static('../img'))
app.use('/styles', express.static('../styles'))
app.use('/settings.js', express.static('../settings.js'))
app.use('/utils.js', express.static('../utils.js'))

app.get('/user-badges', asyncHandler(async (req, res) => {
  let response = await twentyEightApiFetch({
    url: `${process.env.CENTRAL_HTTP_API_PREFIX}/custom-badges/twitch`,
    query: {}
  })

  res.json(response.data)
}))

app.get('/cheermotes', asyncHandler(async (req, res) => {
  let { broadcaster_id } = req.query

  let response = await session.try(({ accessToken, clientId }) => twitchApiRequest({
    url: 'https://api.twitch.tv/helix/bits/cheermotes',
    query: {
      broadcaster_id
    },
    accessToken,
    clientId,
  }))

  res.json(response.data)
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
