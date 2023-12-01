import { useCanister, useConnect } from "@connect2ic/react"
import React, { useEffect, useState } from "react"

interface PurifyProps {
  TFAuthed: boolean
}

const Purify = ({ TFAuthed }: PurifyProps) => {
  const [purify] = useCanister("purify")
  const [profile, setProfile] = useState(null)
  const [index, setIndex] = useState(null)
  const [comments, setComments] = useState(null)

  const [createProfilePrincipal, setCreateProfilePrincipal] = useState(null)
  const [createIndexPrincipal, setCreateIndexPrincipal] = useState(null)
  const [queryProfilePrincipal, setQueryProfilePrincipal] = useState(null)
  const [queryIndexPrincipal, setQueryIndexPrincipal] = useState(null)
  const [ratePrincipal, setRatePrincipal] = useState(null)
  const [rateComment, setRateComment] = useState(null)

  const createProfile = async (principalText: String) => {
    console.log("Creating profile")
    await purify.create_profile(principalText)
    console.log("Profile created")
  }

  const createIndex = async (principalText: String) => {
    console.log("Creating index")
    await purify.create_index(principalText)
    console.log("Index created")
  }

  const queryProfile = async (principalText: String) => {
    console.log("Querying profile")
    const profile = await purify.query_profile(principalText)
    const comments = await purify.query_comments(principalText)
    console.log("Profile queried")
    console.log(profile)
    console.log(comments)
    setProfile(profile)
    setComments(comments)
  }

  const queryIndex = async (principalText: String) => {
    console.log("Querying index")
    const index = await purify.query_index(principalText)
    console.log("Index queried")
    console.log(index)
    setIndex(index)
  }

  const rate = async (
    comment: String,
    commentor: String,
    like: Boolean,
    principal: String,
  ) => {
    console.log("Rating")
    await purify.rate(comment, commentor, like, principal)
    console.log("Rated")
  }

  return (
    <div>
      Hello
      <div>
        {TFAuthed && (
          <div>
            <button onClick={() => createProfile(createProfilePrincipal)}>
              Create Profile
            </button>
            <input
              type="text"
              placeholder="Principal"
              onChange={(e) => setCreateProfilePrincipal(e.target.value)}
            />

            <button onClick={() => createIndex(createIndexPrincipal)}>
              Create Index
            </button>
            <input
              type="text"
              placeholder="Principal"
              onChange={(e) => setCreateIndexPrincipal(e.target.value)}
            />

            <button
              onClick={() =>
                rate(rateComment, "commentor", true, ratePrincipal)
              }
            >
              Rate
            </button>
            <input
              type="text"
              placeholder="Comment"
              onChange={(e) => setRateComment(e.target.value)}
            />
            <input
              type="text"
              placeholder="Principal"
              onChange={(e) => setRatePrincipal(e.target.value)}
            />

            <button onClick={() => queryProfile(queryProfilePrincipal)}>
              Query Profile
            </button>
            <input
              type="text"
              placeholder="Principal"
              onChange={(e) => setQueryProfilePrincipal(e.target.value)}
            />

            <div>
              {profile && (
                <div>
                  <div>Profile</div>
                  <div>Principal: {profile[0]}</div>
                  <div>Plus: {profile[1]}</div>
                  <div>Minus: {profile[2]}</div>
                  <div>Vely Points: {profile[3]}</div>
                  {comments &&
                    comments.map((comment) => (
                      <div>
                        <p>{`Comment: ${comment.comment}`}</p>
                        <p>{`Commentor: ${comment.commentor}`}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <button onClick={() => queryIndex(queryIndexPrincipal)}>
              Query Index
            </button>
            <input
              type="text"
              placeholder="Principal"
              onChange={(e) => setQueryIndexPrincipal(e.target.value)}
            />
            <div>
              {index && (
                <div>
                  <div>Index</div>
                  <div>{index[0]}</div>
                  <div>{index[1]}</div>
                  <div>{index[2]}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { Purify }
