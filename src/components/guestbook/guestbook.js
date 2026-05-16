import React, { useState } from "react"
import { supabase } from "../../lib/supabase"
import * as styles from "./guestbook.module.css"

export function Guestbook() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("idle")

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setStatus("submitting")
    const { error } = await supabase
      .from("baby_guestbook")
      .insert({ name: name.trim(), message: message.trim() })
    if (error) {
      setStatus("error")
    } else {
      setStatus("success")
      setName("")
      setMessage("")
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "98aba803-e71a-4d1e-bb8f-c49e28715be1",
          subject: "New note on Baby T 💌",
          from_name: name.trim(),
          message: message.trim(),
        }),
      })
    }
  }

  return (
    <div className={styles.guestbook}>
      {status === "success" ? (
        <div className={styles.thanks}>
          <p>Thank you! Your note is on its way 💌</p>
          <button
            className={styles.again}
            onClick={() => setStatus("idle")}
          >
            Send another note
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className={styles.input}
          />
          <textarea
            placeholder="Leave Hope & Carly a note..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            className={styles.textarea}
            rows={4}
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className={styles.button}
          >
            {status === "submitting" ? "Sending..." : "Send Note"}
          </button>
          {status === "error" && (
            <p className={styles.error}>Something went wrong — please try again.</p>
          )}
        </form>
      )}
    </div>
  )
}
